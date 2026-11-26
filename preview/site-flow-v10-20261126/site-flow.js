
/* V10 TEST BRANCH ONLY — keeps all supplied figures, cases and decision handlers. */
(function(){
 'use strict';
 const sales=document.getElementById('sales');
 const app=document.getElementById('app');

 function initSales(){
  if(!sales||sales.dataset.km10Ready)return;
  sales.dataset.km10Ready='1';

  // A single, concise top-level route: meaning -> example -> evidence -> experience.
  const bar=sales.querySelector('.case-review-link');
  if(bar){
   const heading=bar.querySelector('strong');
   if(heading)heading.textContent='ことねや式｜考え方から実務・体験へ';
   bar.querySelectorAll('a').forEach(a=>a.remove());
   const nav=document.createElement('nav');
   nav.className='km10-flow-nav';
   nav.setAttribute('aria-label','ことねや式の内容案内');
   nav.innerHTML='<a href="#sales-home">① 家計から理解する</a><a href="#sales-cases">② 検証①・②を見る</a><a href="#sales-contact">③ 自分で試す・相談</a>';
   bar.appendChild(nav);
  }
  const kicker=sales.querySelector('#sales-cases .cases-kicker span:first-child');
  if(kicker)kicker.textContent='経営の仕組みを実務で検証した2つの事例';
  const overview=[...sales.querySelectorAll('#sales-cases .cases-overview article')];
  overview.forEach((article,i)=>{
    const label=article.querySelector('.cases-label');
    if(label&&!label.querySelector('.km10-validation-prefix')){
      const prefix=document.createElement('strong');prefix.className='km10-validation-prefix';
      prefix.textContent='検証'+String.fromCharCode(9312+i)+'｜';
      label.insertBefore(prefix,label.firstChild);
    }
    const link=article.querySelector('.cases-jump');
    if(link)link.setAttribute('aria-label','検証'+(i+1)+'のBefore・Afterと判断材料を見る');
  });
  const table=sales.querySelector('.sales-household .four-table');
  if(table&&!sales.querySelector('.km10-four-mobile')){
    const headings=[...table.querySelectorAll('thead th')].map(n=>n.textContent.trim());
    const rows=[...table.querySelectorAll('tbody tr')];
    if(headings.length===4&&rows.length===4){
      const converted=document.createElement('div');
      converted.className='km10-four-mobile';
      converted.setAttribute('aria-label','家計簿を考える4つの問いの例');
      rows.forEach(row=>{
       const cells=[...row.children];
       const card=document.createElement('section');
       card.className='km10-four-card';
       const h=document.createElement('h4');
       h.textContent=cells[0]?.textContent.trim()||'';
       const dl=document.createElement('dl');
       for(let i=1;i<4;i++){
        const dt=document.createElement('dt'),dd=document.createElement('dd');
        dt.textContent=headings[i];dd.textContent=cells[i]?.textContent.trim()||'';
        dl.append(dt,dd);
       }
       card.append(h,dl);converted.appendChild(card);
      });
      table.insertAdjacentElement('afterend',converted);
    }
  }
  // The two detail analyses remain complete but do not occupy the whole page until opened.
  sales.querySelectorAll('#sales-cases details.cases-detail').forEach(d=>{
    if(!d.dataset.km10Ready){
      d.dataset.km10Ready='1';
      d.open=false;
    }
  });
 }

 function initApp(){
  if(!app || app.hidden)return;
  // Stage 03: information first, judgment second, next action last.
  const debrief=app.querySelector('.compact-debrief');
  if(debrief&&!debrief.querySelector('.km10-debrief-layout')){
    const cards=[...debrief.querySelectorAll(':scope > .debrief-section')];
    if(cards.length>=3){
      const wrapper=document.createElement('div');
      wrapper.className='km10-debrief-layout';
      const left=document.createElement('div');left.className='km10-debrief-facts';
      const right=document.createElement('div');right.className='km10-debrief-meaning';
      cards[0].parentNode.insertBefore(wrapper,cards[0]);
      wrapper.append(left,right);
      left.appendChild(cards[0]);
      cards.slice(1).forEach(el=>right.appendChild(el));
    }
  }
  // Stage 04: actual work on the left / viewpoints and decision information on the right.
  const company=app.querySelector('.company-lean');
  if(company&&!company.querySelector('.km10-company-layout')){
    const mainpoint=company.querySelector(':scope > .company-mainpoint');
    if(mainpoint){
      const wrapper=document.createElement('div');
      wrapper.className='km10-company-layout';
      const left=document.createElement('div');left.className='km10-company-scene';
      const right=document.createElement('div');right.className='km10-company-judgement';
      mainpoint.parentNode.insertBefore(wrapper,mainpoint);
      wrapper.append(left,right);
      left.appendChild(mainpoint);
      company.querySelectorAll(':scope > .method-business-flow, :scope > .method-business-compare').forEach(el=>left.appendChild(el));
      company.querySelectorAll(':scope > .company-point:not(.company-mainpoint), :scope > .method-takeaway').forEach(el=>right.appendChild(el));
    }
  }
 }
 function performAudit(){
  const width=document.documentElement.clientWidth;
  const pageOverflow=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-width;
  const cases=sales?.querySelectorAll('#sales-cases .cases-overview article').length||0;
  const caseDetails=sales?.querySelectorAll('#sales-cases .cases-detail').length||0;
  const conversion=sales?.querySelectorAll('.km10-four-card').length||0;
  const choice=app?.querySelectorAll('.km-choice-rail button[data-decision]').length||0;
  return {width,pageOverflow,cases,caseDetails,mobileFourQuestions:conversion,
    stage:app?.hidden?'sales':app?.querySelector('.compact-debrief')?'debrief':app?.querySelector('.company-lean')?'company':app?.querySelector('.final-lean')?'final':app?.querySelector('.one-household')?'household':app?.querySelector('.intro-tree-first')?'intro':'other',
    choiceButtons:choice,debriefLayout:!!app?.querySelector('.km10-debrief-layout'),
    companyLayout:!!app?.querySelector('.km10-company-layout'),
    visibleCaseValidation:cases===2&&caseDetails===2};
 }
 window.kotoneyaV10Audit=performAudit;
 if(app){
   // Detect whole-stage re-render, not child mutations from the layout rearrangements.
   const observer=new MutationObserver(()=>{initApp();});
   observer.observe(app,{childList:true,subtree:false});
 }
 initSales();initApp();
 // Navigation conveniences only for the test version; ordinary visitors start at the sales intro.
 const q=new URLSearchParams(location.search),v=q.get('testView');
 if(v==='intro'||v==='household'||v==='debrief'||v==='company'||v==='final'){
  try{
    enterExperience();
    if(v!=='intro'){
      S.stage='experience';S.topic=q.get('topic')&&DATA[q.get('topic')]?q.get('topic'):'car';
      S.decision=['a','b','hold'].includes(q.get('decision'))?q.get('decision'):'b';
      S.phase=v==='company'?'company':'home';S.step=v==='debrief'?5:2;
      S.highestStage=Math.max(S.highestStage,v==='final'?4:v==='company'?3:v==='debrief'?2:1);
      if(v==='final')S.stage='final';
      render();
    }
    initApp();
  }catch(e){console.warn('V10 preview-stage navigation unavailable',e);}
 }else if(v==='cases'){
   requestAnimationFrame(()=>{
     const el=document.getElementById('sales-cases');
     if(el)el.scrollIntoView({block:'start'});
   });
 }
 if(q.has('auditV10')){
   const status=()=>{
     const a=performAudit();
     let el=document.getElementById('km10-audit');
     if(!el){
       el=document.createElement('div');el.id='km10-audit';
       el.style.cssText='position:fixed;bottom:10px;right:10px;z-index:9999;border-radius:8px;padding:8px 11px;color:white;font:750 12px sans-serif;background:#265d45;box-shadow:0 2px 10px #0003';
       document.body.appendChild(el);
     }
     el.textContent='V10配置検査｜'+a.width+'px｜'+a.stage+'｜事例'+a.cases+'｜横はみ出し'+a.pageOverflow+'px';
     el.style.background=(!a.visibleCaseValidation||a.pageOverflow>3)?'#a43838':'#265d45';
   };
   window.addEventListener('load',status);window.addEventListener('resize',status);
   document.addEventListener('click',()=>requestAnimationFrame(status));
   if(app)new MutationObserver(()=>requestAnimationFrame(status)).observe(app,{childList:true,subtree:false});
   status();
 }
})();
