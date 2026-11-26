/* Preview only. Preserve original data/controls; reorganize text-heavy note row into compact choice notes. */
(() => {
  'use strict';
  const options=[['a','A案'],['b','B案'],['hold','保留']];
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function enhance(){
    document.querySelectorAll('#app .compare36').forEach(table => {
      const row=table.querySelector('.compare-note-row');
      if(!row)return;
      const wrap=table.closest('.compare-wrap36');
      if(!wrap)return;
      const values=[...row.querySelectorAll('td')].map(td=>td.textContent.trim());
      if(values.length!==3)return;
      const notes=document.createElement('div');
      notes.className='km-plan-notes';
      notes.setAttribute('aria-label','各案の内容と留意点');
      notes.innerHTML=options.map(([key,label],i)=>{
        const chosen=table.querySelector('thead .plan-cell[data-decision="'+key+'"]')?.classList.contains('chosen-col');
        return '<button type="button" class="km-plan-note'+(chosen?' is-selected':'')+'" data-decision="'+key+'" aria-pressed="'+Boolean(chosen)+'"><strong>'+label+'｜内容と留意点</strong><span>'+escape(values[i])+'</span></button>';
      }).join('');
      // On narrow screens each choice becomes a fully readable card, not a cropped four-column table.
      const rows=[...table.querySelectorAll('tbody tr:not(.compare-note-row)')].map(tr=>({name:tr.querySelector('th')?.textContent.trim()||'',values:[...tr.querySelectorAll('td')].map(td=>td.textContent.trim())}));
      const mobile=document.createElement('div');
      mobile.className='km-plan-mobile';
      mobile.setAttribute('aria-label','三つの案を比較して選ぶ');
      mobile.innerHTML=options.map(([key,label],i)=>{
        const name=table.querySelector('thead .plan-cell[data-decision="'+key+'"] .compare-name')?.textContent.trim()||label;
        const chosen=table.querySelector('thead .plan-cell[data-decision="'+key+'"]')?.classList.contains('chosen-col');
        return '<button type="button" class="km-mobile-choice'+(chosen?' is-selected':'')+'" data-decision="'+key+'" aria-pressed="'+Boolean(chosen)+'"><span class="km-choice-head"><b>'+label+'</b><strong>'+escape(name)+'</strong><em>'+(chosen?'選択中':'この案を選ぶ')+'</em></span><span class="km-choice-metrics">'+rows.map(x=>'<span class="km-choice-row"><span>'+escape(x.name)+'</span><strong>'+escape(x.values[i]||'—')+'</strong></span>').join('')+'</span><span class="km-choice-note">'+escape(values[i])+'</span></button>';
      }).join('');
      row.remove();
      wrap.classList.add('km-choices-enhanced');
      wrap.insertAdjacentElement('afterend',notes);
      notes.insertAdjacentElement('afterend',mobile);
      const hint=document.createElement('p');
      hint.className='compare-scroll-hint';
      hint.textContent='← 比較表は左右にスクロールできます →';
      wrap.insertAdjacentElement('afterend',hint);
    });
    document.querySelectorAll('#sales .four-table').forEach(table=>{
      if(table.parentElement?.classList.contains('km-sales-table-scroll'))return;
      const wrap=document.createElement('div');
      wrap.className='km-sales-table-scroll';
      wrap.style.cssText='max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin';
      table.parentNode.insertBefore(wrap,table);
      wrap.appendChild(table);
    });
  }
  function audit(){
    const tables=[...document.querySelectorAll('#app .finance36,#app .compare36,#app .result36,#sales .sales-table')].filter(el=>el.getClientRects().length);
    const viewport=document.documentElement.clientWidth;
    const overflow=Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-viewport;
    const notes=[...document.querySelectorAll('#app .km-plan-notes')];
    const noteCompleteness=notes.every(n=>n.children.length===3 && [...n.children].every(b=>b.querySelector('span')?.textContent.trim()));
    const mobileCards=[...document.querySelectorAll('#app .km-plan-mobile')].every(n=>n.querySelectorAll('.km-mobile-choice').length===3);
    return {width:viewport,visibleTables:tables.length,comparisonTables:document.querySelectorAll('#app .compare36').length,notes:notes.length,noteCompleteness,mobileCards,horizontalPageOverflow:overflow>3,overflowPixels:overflow};
  }
  window.kotoneyaFlowAudit=audit;
  const app=document.getElementById('app');
  if(app){new MutationObserver(enhance).observe(app,{childList:true});}
  enhance();
  if(new URLSearchParams(location.search).has('auditFlow')){
    const show=()=>{
      const v=audit();let el=document.getElementById('km-flow-audit-pill');
      if(!el){el=document.createElement('div');el.id='km-flow-audit-pill';el.style.cssText='position:fixed;z-index:99999;bottom:10px;left:10px;padding:8px 12px;border-radius:8px;color:#fff;background:#265d45;font:700 12px system-ui;box-shadow:0 2px 8px #0003';document.body.appendChild(el);}
      el.style.background=(!v.noteCompleteness||v.horizontalPageOverflow)?'#a33131':'#265d45';
      el.textContent='配置検査 '+v.width+'px｜表 '+v.visibleTables+'｜注記 '+v.notes+'｜画面外 '+v.overflowPixels+'px';
    };
    const observed=document.getElementById('app');if(observed)new MutationObserver(()=>requestAnimationFrame(show)).observe(observed,{childList:true});
    window.addEventListener('load',show);window.addEventListener('resize',show);document.addEventListener('click',()=>requestAnimationFrame(show));show();
  }
})();
