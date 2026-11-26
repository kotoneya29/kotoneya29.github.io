/* V9 independent preview: changes only this document's display structure. */
(function(){
  "use strict";
  const target=document.getElementById('app');
  if(!target)return;
  function arrange(){
    const section=target.querySelector('.one-household');
    if(!section)return;
    const choices=section.querySelector('.method-family-choices');
    if(!choices || choices.closest('.km-choice-results-layout'))return;
    const scenario=section.querySelector('.scenario-header');
    const assumptions=section.querySelector('.subtle-detail');
    const result=section.querySelector('.inline-results')||section.querySelector('.inline-empty');
    const anchor=scenario||choices;
    const panel=document.createElement('div');
    panel.className='km-choice-results-layout';
    panel.setAttribute('aria-label','選択肢と条件・結果を左右で確認する');
    const left=document.createElement('div');
    left.className='km-choice-rail';
    const right=document.createElement('div');
    right.className='km-evidence-panel';
    const title=document.createElement('div');
    title.className='km-evidence-heading';
    title.innerHTML='<strong>条件と結果</strong><small>左の選択を変えると結果が更新されます</small>';
    anchor.parentNode.insertBefore(panel,anchor);
    panel.append(left,right);
    left.appendChild(choices);
    right.appendChild(title);
    if(scenario)right.appendChild(scenario);
    if(assumptions)right.appendChild(assumptions);
    if(result)right.appendChild(result);
    // Previously discussed two practical cases belong to the sales section,
    // so this transformation never hides or removes that section.
    if(!document.getElementById('km-layout-test-mark')){
      const mark=document.createElement('div');
      mark.className='km-visual-test-identifier';
      mark.id='km-layout-test-mark';
      mark.textContent='V9｜配置テスト（本番未変更）';
      section.querySelector('.eyebrow')?.insertAdjacentElement('afterend',mark);
    }
  }
  const observer=new MutationObserver(arrange);
  observer.observe(target,{childList:true});
  arrange();
  window.kotoneyaV9Audit=function(){
    const area=target.querySelector('.km-choice-results-layout');
    if(!area)return {visible:false};
    const rail=area.querySelector('.km-choice-rail');
    const right=area.querySelector('.km-evidence-panel');
    const cr=rail.getBoundingClientRect(),rr=right.getBoundingClientRect();
    const viewport=document.documentElement.clientWidth;
    const twoColumn=viewport>730;
    return {
      visible:true,width:viewport,
      options:rail.querySelectorAll('button[data-decision]').length,
      assumptions:right.querySelectorAll('.subtle-detail').length,
      results:right.querySelectorAll('.inline-results').length,
      twoColumn,
      sideBySide:cr.right<=rr.left+1,
      overlap:cr.right>rr.left+1&&twoColumn,
      pageOverflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-viewport
    };
  };
  if(new URLSearchParams(location.search).get('testChoice')==='car'){
    // Test-only convenience: open directly on the car example with B selected.
    try{
      enterExperience();
      S.stage='experience';
      S.topic='car';
      S.decision='b';
      S.phase='home';
      S.step=2;
      S.highestStage=Math.max(S.highestStage,1);
      render();
      window.scrollTo(0,0);
    }catch(err){console.warn('Preview start unavailable',err);}
  }
})();
