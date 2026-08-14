/* Per-profile persistence + adaptive study tracking. */
(function () {
  'use strict';
  const DAY = 86400000;
  function defaults(){return{
    quiz:{answered:0,correct:0,byMwa:{},byTask:{},bySubtask:{},history:[],examAttempts:[],questionStats:{},activeSession:null},
    vocabulary:{},vocabTests:[],calendar:{completedDays:[],dayProgress:{}},
    settings:{showSpanish:true,englishNewPerDay:5,dailyQuizTarget:10},
    activityDates:[],resume:{tab:'home',mode:null,questionId:null,updatedAt:null},lastUpdated:null
  }}
  function key(){return window.ProfileStore.progressKey()}
  function load(){const k=key();if(!k)return defaults();try{const p=JSON.parse(localStorage.getItem(k));if(!p)return defaults();const d=defaults();return{
    ...d,...p,
    quiz:{...d.quiz,...(p.quiz||{}),byMwa:{...(p.quiz?.byMwa||{})},byTask:{...(p.quiz?.byTask||{})},bySubtask:{...(p.quiz?.bySubtask||{})},history:[...(p.quiz?.history||[])],examAttempts:[...(p.quiz?.examAttempts||[])],questionStats:{...(p.quiz?.questionStats||{})},activeSession:p.quiz?.activeSession||null},
    vocabulary:{...(p.vocabulary||{})},vocabTests:[...(p.vocabTests||[])],
    calendar:{...d.calendar,...(p.calendar||{}),completedDays:[...(p.calendar?.completedDays||[])],dayProgress:{...(p.calendar?.dayProgress||{})}},
    settings:{...d.settings,...(p.settings||{})},activityDates:[...(p.activityDates||[])],resume:{...d.resume,...(p.resume||{})}
  }}catch(_){return defaults()}}
  function save(p){const k=key();if(!k)return;p.lastUpdated=new Date().toISOString();localStorage.setItem(k,JSON.stringify(p))}
  function dateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
  function touch(p){const k=dateKey();if(!p.activityDates.includes(k))p.activityDates.push(k);p.activityDates=p.activityDates.sort().slice(-365)}
  function inc(bucket,id,correct){if(!id)return;bucket[id]||={answered:0,correct:0};bucket[id].answered++;if(correct)bucket[id].correct++}
  function currentDay(){const p=window.ProfileStore.active();return p&&window.StudyCalendar?window.StudyCalendar.currentDay(p):1}
  function dayObj(p,day=currentDay()){const id=String(day);p.calendar.dayProgress[id]||={vocabReviewed:[],vocabTestPct:null,lessonViewed:false,lessonTask:null,quizAnswered:0,quizCorrect:0,quizQuestionIds:[],mockCompleted:false,mockPct:null,completedAt:null};return p.calendar.dayProgress[id]}
  function refreshCompletion(p,day=currentDay()){
    const d=dayObj(p,day),plan=window.StudyCalendar?.planForDay(window.ProfileStore.active(),p,window.__RSOS_DATA__,day);
    const req=window.StudyCalendar?.requirementsForDay?.(plan)||{vocab:5,vocabTest:true,lesson:true,quiz:10,mock:false};
    const vocabCount=new Set(d.vocabReviewed||[]).size;
    const ok=req.mock?!!d.mockCompleted:(vocabCount>=req.vocab && (!req.vocabTest || Number(d.vocabTestPct)>=80) && (!req.lesson || !!d.lessonViewed) && Number(d.quizAnswered)>=req.quiz);
    const set=new Set(p.calendar.completedDays||[]);
    if(ok){set.add(Number(day));d.completedAt=d.completedAt||new Date().toISOString()}else{set.delete(Number(day));d.completedAt=null}
    p.calendar.completedDays=[...set].sort((a,b)=>a-b);return ok
  }
  function recordQuizAnswer(question,correct,detail={}){const p=load();p.quiz.answered++;if(correct)p.quiz.correct++;inc(p.quiz.byMwa,question.mwa,correct);inc(p.quiz.byTask,question.task,correct);inc(p.quiz.bySubtask,question.subtask,correct);
    const qid=String(question.id),qs=p.quiz.questionStats[qid]||{attempts:0,correct:0,wrong:0,streak:0,lastAt:null,lastCorrect:null};qs.attempts++;if(correct){qs.correct++;qs.streak++}else{qs.wrong++;qs.streak=0}qs.lastAt=new Date().toISOString();qs.lastCorrect=!!correct;p.quiz.questionStats[qid]=qs;
    p.quiz.history.push({questionId:question.id,mwa:question.mwa,task:question.task,subtask:question.subtask,questionType:question.question_type,correct,selectedIndex:detail.selectedIndex,correctIndex:question.correct,mode:detail.mode||'practice',at:new Date().toISOString()});p.quiz.history=p.quiz.history.slice(-2500);
    if(['daily','guided','remediation'].includes(detail.mode)){const d=dayObj(p);d.quizAnswered++;if(correct)d.quizCorrect++;if(!d.quizQuestionIds.includes(question.id))d.quizQuestionIds.push(question.id);refreshCompletion(p)}
    touch(p);save(p);return p}
  function recordExamAttempt(result){const p=load();p.quiz.examAttempts.push({...result,at:new Date().toISOString()});p.quiz.examAttempts=p.quiz.examAttempts.slice(-40);if(result.total===100){const d=dayObj(p);d.mockCompleted=true;d.mockPct=result.pct;refreshCompletion(p)}touch(p);save(p)}

  function saveQuizSession(session){const p=load();p.quiz.activeSession=session?{...session,updatedAt:new Date().toISOString()}:null;save(p)}
  function getQuizSession(){return load().quiz.activeSession||null}
  function clearQuizSession(){const p=load();p.quiz.activeSession=null;save(p)}
  function getVocab(id){return load().vocabulary[String(id)]||null}
  function updateVocab(id,state){const p=load();p.vocabulary[String(id)]=state;const d=dayObj(p);if(!d.vocabReviewed.includes(id))d.vocabReviewed.push(id);refreshCompletion(p);touch(p);save(p);return p}
  function recordVocabTest(score,total,termIds){const p=load(),pct=total?Math.round(score/total*100):0;p.vocabTests.push({score,total,pct,termIds,at:new Date().toISOString()});p.vocabTests=p.vocabTests.slice(-365);const d=dayObj(p);d.vocabTestPct=Math.max(Number(d.vocabTestPct)||0,pct);refreshCompletion(p);touch(p);save(p)}
  function markLessonViewed(task){const p=load(),d=dayObj(p);d.lessonViewed=true;d.lessonTask=task||d.lessonTask;refreshCompletion(p);touch(p);save(p)}
  function getDayProgress(day=currentDay()){return dayObj(load(),day)}
  function setResume(tab,mode=null,questionId=null){const p=load();p.resume={tab,mode,questionId,updatedAt:new Date().toISOString()};save(p)}
  function getResume(){return load().resume}
  function setSetting(name,value){const p=load();p.settings[name]=value;save(p)}
  function getSetting(name,fallback){const p=load();return Object.hasOwn(p.settings,name)?p.settings[name]:fallback}
  function streak(dates){const s=new Set(dates);let d=new Date(),n=0;if(!s.has(dateKey(d)))d=new Date(d.getTime()-DAY);while(s.has(dateKey(d))){n++;d=new Date(d.getTime()-DAY)}return n}
  function weakTasks(limit=6){const p=load();return Object.entries(p.quiz.byTask).filter(([,v])=>v.answered>=2).map(([task,v])=>({task,answered:v.answered,pct:Math.round(v.correct/v.answered*100)})).sort((a,b)=>a.pct-b.pct||b.answered-a.answered).slice(0,limit)}
  function weakSubtasks(limit=10){const p=load();return Object.entries(p.quiz.bySubtask).filter(([id,v])=>id&&v.answered>=2).map(([subtask,v])=>({subtask,answered:v.answered,pct:Math.round(v.correct/v.answered*100)})).sort((a,b)=>a.pct-b.pct||b.answered-a.answered).slice(0,limit)}
  function missedQuestionIds(limit=20){const p=load();return Object.entries(p.quiz.questionStats).filter(([,v])=>v.wrong>0&&v.streak<2).sort((a,b)=>new Date(a[1].lastAt)-new Date(b[1].lastAt)).slice(0,limit).map(([id])=>Number(id))}
  function stats(){const p=load(),mastered=Object.values(p.vocabulary).filter(v=>v.repetitions>=3&&v.easeFactor>=2.3).length;return{...p,mastered,streak:streak(p.activityDates),weakTasks:weakTasks(6),weakSubtasks:weakSubtasks(10),today:getDayProgress()}}
  window.ProgressStore={load,save,recordQuizAnswer,recordExamAttempt,saveQuizSession,getQuizSession,clearQuizSession,getVocab,updateVocab,recordVocabTest,markLessonViewed,getDayProgress,setResume,getResume,setSetting,getSetting,stats,weakTasks,weakSubtasks,missedQuestionIds,refreshCompletion};
})();
