/* Persistencia separada por perfil local para V2. */
(function () {
  'use strict';
  const DAY = 86400000;
  function defaults() { return { quiz: { answered: 0, correct: 0, byMwa: {}, byTask: {}, history: [], examAttempts: [] }, vocabulary: {}, vocabTests: [], calendar: { completedDays: [] }, settings: { showSpanish: true, englishNewPerDay: 5, dailyQuizTarget: 10 }, activityDates: [], lastUpdated: null }; }
  function key() { return window.ProfileStore.progressKey(); }
  function load() { const k=key(); if(!k)return defaults(); try { const p=JSON.parse(localStorage.getItem(k)); if(!p)return defaults(); const d=defaults(); return {...d,...p,quiz:{...d.quiz,...(p.quiz||{}),byMwa:{...(p.quiz?.byMwa||{})},byTask:{...(p.quiz?.byTask||{})},history:[...(p.quiz?.history||[])],examAttempts:[...(p.quiz?.examAttempts||[])]},vocabulary:{...(p.vocabulary||{})},vocabTests:[...(p.vocabTests||[])],calendar:{...d.calendar,...(p.calendar||{}),completedDays:[...(p.calendar?.completedDays||[])]},settings:{...d.settings,...(p.settings||{})},activityDates:[...(p.activityDates||[])]}; } catch(_){ return defaults(); } }
  function save(p){const k=key();if(!k)return;p.lastUpdated=new Date().toISOString();localStorage.setItem(k,JSON.stringify(p));}
  function dateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
  function touch(p){const k=dateKey();if(!p.activityDates.includes(k))p.activityDates.push(k);p.activityDates=p.activityDates.sort().slice(-365);}
  function inc(bucket,id,correct){bucket[id]||={answered:0,correct:0};bucket[id].answered++;if(correct)bucket[id].correct++;}
  function recordQuizAnswer(q,correct,detail={}){const p=load();p.quiz.answered++;if(correct)p.quiz.correct++;inc(p.quiz.byMwa,q.mwa,correct);inc(p.quiz.byTask,q.task,correct);p.quiz.history.push({questionId:q.id,mwa:q.mwa,task:q.task,subtask:q.subtask,questionType:q.question_type,correct,selectedIndex:detail.selectedIndex,correctIndex:q.correct,mode:detail.mode||'practice',at:new Date().toISOString()});p.quiz.history=p.quiz.history.slice(-1500);touch(p);save(p);return p;}
  function recordExamAttempt(result){const p=load();p.quiz.examAttempts.push({...result,at:new Date().toISOString()});p.quiz.examAttempts=p.quiz.examAttempts.slice(-30);touch(p);save(p);}
  function getVocab(id){return load().vocabulary[String(id)]||null;}
  function updateVocab(id,state){const p=load();p.vocabulary[String(id)]=state;touch(p);save(p);return p;}
  function recordVocabTest(score,total,termIds){const p=load();p.vocabTests.push({score,total,termIds,at:new Date().toISOString()});p.vocabTests=p.vocabTests.slice(-180);touch(p);save(p);}
  function markDay(dayIndex,done=true){const p=load(),id=Number(dayIndex),set=new Set(p.calendar.completedDays);done?set.add(id):set.delete(id);p.calendar.completedDays=[...set].sort((a,b)=>a-b);touch(p);save(p);}
  function setSetting(name,value){const p=load();p.settings[name]=value;save(p);}
  function getSetting(name,fallback){const p=load();return Object.hasOwn(p.settings,name)?p.settings[name]:fallback;}
  function streak(dates){const s=new Set(dates);let d=new Date(),n=0;if(!s.has(dateKey(d)))d=new Date(d.getTime()-DAY);while(s.has(dateKey(d))){n++;d=new Date(d.getTime()-DAY);}return n;}
  function weakTasks(limit=5){const p=load();return Object.entries(p.quiz.byTask).filter(([,v])=>v.answered>=3).map(([task,v])=>({task,answered:v.answered,pct:Math.round(v.correct/v.answered*100)})).sort((a,b)=>a.pct-b.pct||b.answered-a.answered).slice(0,limit);}
  function stats(){const p=load(),mastered=Object.values(p.vocabulary).filter(v=>v.repetitions>=3&&v.easeFactor>=2.3).length;return {...p,mastered,streak:streak(p.activityDates),weakTasks:weakTasks(6)};}
  window.ProgressStore={load,save,recordQuizAnswer,recordExamAttempt,getVocab,updateVocab,recordVocabTest,markDay,setSetting,getSetting,stats,weakTasks};
})();
