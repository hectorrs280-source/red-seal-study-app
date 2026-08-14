/* Builds a 100-question Red Seal mock from official Task counts and a global cognitive mix within published ranges. */
(function(){
'use strict';
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function build(questions,rsos){
 const TYPES=['Knowledge and Recall','Procedural and Application','Critical Thinking'];
 const target=rsos.mock_exam_cognitive_mix?.simulation_counts||{'Knowledge and Recall':19,'Procedural and Application':38,'Critical Thinking':43};
 const tasks=rsos.mwas.flatMap(m=>m.tasks).filter(t=>Number(t.exam_questions)>0),pools={};
 for(const t of tasks){pools[t.id]={};for(const type of TYPES)pools[t.id][type]=questions.filter(q=>q.task===t.id&&q.answer_verified===true&&q.question_type===type)}
 let states=new Map([['0,0',[]]]);
 for(const t of tasks){const need=Number(t.exam_questions),opts=[];for(let k=0;k<=need;k++)for(let p=0;p<=need-k;p++){const c=need-k-p;if(k<=pools[t.id][TYPES[0]].length&&p<=pools[t.id][TYPES[1]].length&&c<=pools[t.id][TYPES[2]].length)opts.push([k,p,c])}if(!opts.length)throw new Error(`Not enough study questions for ${t.id}`);const next=new Map();for(const [key,plan] of states){const [sk,sp]=key.split(',').map(Number);for(const o of shuffle(opts)){const nk=sk+o[0],np=sp+o[1];if(nk>target[TYPES[0]]||np>target[TYPES[1]])continue;const key2=`${nk},${np}`;if(!next.has(key2))next.set(key2,[...plan,[t.id,o]])}}states=next}
 const plan=states.get(`${target[TYPES[0]]},${target[TYPES[1]]}`);if(!plan)throw new Error('Unable to build a 100-question mock with the configured mix.');const out=[];for(const [task,counts] of plan)for(let i=0;i<TYPES.length;i++)out.push(...shuffle(pools[task][TYPES[i]]).slice(0,counts[i]));if(out.length!==100)throw new Error(`Mock produced ${out.length} questions`);return shuffle(out)
}
window.RedSealMockBuilder={build};
})();
