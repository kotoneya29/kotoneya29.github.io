(function(){
'use strict';
const app=document.getElementById('ky-app');if(!app)return;
const $=(s)=>app.querySelector(s),all=(s)=>Array.from(app.querySelectorAll(s));
const examples={
 education:{label:'塾の費用',reasons:['学ぶ機会を増やしたかった','本人の希望を応援したかった','安心して学べる環境がほしかった']},
 car:{label:'車の買い替え',reasons:['家族の移動を楽にしたかった','安全・安心を重視したかった','移動に使う時間を減らしたかった']},
 home:{label:'エアコンの購入',reasons:['快適に暮らしたかった','健康や安心を大切にしたかった','古い設備の不便を解消したかった']}
};
const state={screen:'intro',intuition:null,scene:null,reason:null,feeling:null,next:null,q:0,plan:'internal',priority:'cost',role:'owner'};
const screenIds=['intro','household','questions','company'];
const text=(s,v)=>{const e=$(s);if(e)e.textContent=v;};
const money=(n)=>n.toLocaleString('ja-JP')+'円';
function showScreen(id){
 if(!screenIds.includes(id))return;
 state.screen=id;
 all('.ky-screen').forEach(x=>{x.hidden=x.dataset.screen!==id;});
 all('.ky-progress-item').forEach((x,i)=>{const active=screenIds[i]===id;const done=i<screenIds.indexOf(id);x.classList.toggle('active',active);x.classList.toggle('done',done);x.setAttribute('aria-current',active?'step':'false');});
 const screen=$('[data-screen="'+id+'"].ky-screen');const heading=screen.querySelector('h1');
 window.scrollTo({top:0,behavior:'instant'});
 if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
}
function select(group,val){
 all('[data-group="'+group+'"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===val)));
}
function showQuestion(n){
 state.q=n;all('.ky-question').forEach(x=>{x.hidden=Number(x.dataset.q)!==n;});
 all('.ky-stepdot').forEach((x,i)=>x.classList.toggle('current',i===n));
 const w=$('.ky-wizard-head');if(w)w.scrollIntoView({behavior:'smooth',block:'start'});
 if(n===4)renderHouseholdSummary();
}
function chooseScenario(key){
 state.scene=key;state.reason=null;state.feeling=null;state.next=null;
 const d=examples[key];
 text('#ky-reason-item',d.label);
 const container=$('#ky-reason-list');container.innerHTML='';
 d.reasons.forEach(r=>{const b=document.createElement('button');b.type='button';b.className='ky-choice';b.dataset.reason=r;b.textContent=r;container.appendChild(b);});
 showQuestion(1);
}
function renderHouseholdSummary(){
 const e=examples[state.scene];if(!e)return;
 text('#ky-summary-item',e.label);
 text('#ky-summary-reason',state.reason||'');
 text('#ky-summary-feeling',state.feeling||'');
 text('#ky-summary-next',state.next||'');
 const lines={
 '満足した':'使ったお金は増えた。でも、満足につながる選択だった。',
 'まだわからない':'結果が分かるまで、少し時間をかけて確かめたい。',
 '後悔した':'期待と違ったところが、次の選び方のヒントになる。'
 };
 text('#ky-summary-insight',lines[state.feeling]||'');
}
function renderCompany(){
 select('plan',state.plan);select('priority',state.priority);select('role',state.role);
 const internal=state.plan==='internal';
 text('#ky-selected-plan',internal?'社内で作る':'外部に頼む');
 text('#ky-selected-cost',money(internal?30000:44000));
 text('#ky-selected-hours',internal?'10時間':'2時間');
 const pinfo={
 cost:'費用だけを比べるなら、社内制作が14,000円少ない。',
 time:'社内で使う時間は、外注すると8時間少なくなる。',
 quality:'仕上がりの品質は金額だけでは分からない。見本や条件を確かめよう。'
 };
 text('#ky-priority-note',pinfo[state.priority]);
 const roles={
 owner:'費用を抑えることと、ほかの仕事に時間を使えること。今回の目的に合うのはどちら？',
 office:'社内の作業時間をどう見積もった？ 外注見積りに追加費用はない？ 同じ条件で比較できている？',
 staff:'実際の作業時間や負担はどうなる？ 誰が確認し、仕上がりの品質を守る？'
 };
 text('#ky-role-note',roles[state.role]);
 const next={
 cost:'社内で必要な10時間は確保できる？',
 time:'空いた8時間を、どの仕事に使う？',
 quality:'必要な仕上がりと納期は、どちらで実現できる？'
 };
 text('#ky-next-check',next[state.priority]);
 const s=$('#ky-company-conclusion');
 if(s&&!s.hidden){
 text('#ky-end-plan',internal?'社内制作':'外部への依頼');
 text('#ky-end-reason',pinfo[state.priority]);
 text('#ky-end-next',next[state.priority]);
 }
}
function reset(){
 Object.assign(state,{screen:'intro',intuition:null,scene:null,reason:null,feeling:null,next:null,q:0,plan:'internal',priority:'cost',role:'owner'});
 all('[data-group="intuition"]').forEach(x=>x.setAttribute('aria-pressed','false'));
 $('#ky-intuition-note').hidden=true;$('#ky-company-conclusion').hidden=true;
 showQuestion(0);renderCompany();showScreen('intro');
}
app.addEventListener('click',function(ev){
 const b=ev.target.closest('button');if(!b||!app.contains(b))return;
 if(b.dataset.goto){showScreen(b.dataset.goto);return;}
 if(b.dataset.group==='intuition'){
   state.intuition=b.dataset.value;select('intuition',state.intuition);$('#ky-intuition-note').hidden=false;return;
 }
 if(b.dataset.scene){chooseScenario(b.dataset.scene);return;}
 if(b.dataset.reason){state.reason=b.dataset.reason;showQuestion(2);return;}
 if(b.dataset.feeling){state.feeling=b.dataset.feeling;showQuestion(3);return;}
 if(b.dataset.next){state.next=b.dataset.next;showQuestion(4);return;}
 if(b.dataset.qback!==undefined){showQuestion(Number(b.dataset.qback));return;}
 if(b.dataset.group==='plan'||b.dataset.group==='priority'||b.dataset.group==='role'){
   state[b.dataset.group]=b.dataset.value;renderCompany();return;
 }
 if(b.dataset.action==='finish'){
   $('#ky-company-conclusion').hidden=false;renderCompany();
   $('#ky-company-conclusion').scrollIntoView({behavior:'smooth',block:'start'});return;
 }
 if(b.dataset.action==='restart'){reset();return;}
 if(b.dataset.action==='newhouse'){state.scene=null;state.reason=null;state.feeling=null;state.next=null;showQuestion(0);showScreen('questions');return;}
});
showQuestion(0);renderCompany();showScreen('intro');
})();