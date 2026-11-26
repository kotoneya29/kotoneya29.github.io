
/* ことねや式 V12 — 表示位置は固定、選択内容だけ差し替え。
   Test-only. Source descriptions and numbers are read from the existing V11 DOM. */
(function(){
"use strict";
const root=document.getElementById("sales");
if(!root||document.getElementById("km12-shell"))return;
const q=(sel,node)=> (node||root).querySelector(sel);
const all=(sel,node)=> [...(node||root).querySelectorAll(sel)];
const clean=x=>String(x||"").replace(/\s+/g," ").trim();
const esc=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const el=(tag,cls,markup)=>{const e=document.createElement(tag);e.className=cls||"";if(markup!=null)e.innerHTML=markup;return e;};
const stageNames=["理念","家計","会社","検証①・②","自社で考える","相談"];
const stageTitles=[
 ["ことねや式とは","根・幹・枝・花を、判断の一つの流れとして見る"],
 ["家計から始める","同じ支出でも、何が残ったかで評価は変わる"],
 ["会社に置き換える","数字だけでなく、判断する人とルールをつなぐ"],
 ["実務で確かめる","理念が経営の選択につながった、2つの実例"],
 ["あなたの会社なら","何を変えたいか、何を育てたいか"],
 ["次の一歩","まず一つの困りごとから考えてみる"]
];
const treeImage=q(".sales-tree.desktop-tree img")||q(".sales-tree img");
const treeSrc=treeImage?treeImage.getAttribute("src"):"";
const originalLayerEls=all(".km11-layers .km11-layer");
const layers=originalLayerEls.map((n,i)=>({
 short:["根","幹","枝","花"][i],
 label:clean(q(".letter",n)?.textContent)||["根｜目的","幹｜判断","枝｜立場","花｜結果"][i],
 detail:clean(q("small",n)?.textContent)
}));
if(layers.length!==4){
 layers.splice(0,layers.length,
  {short:"根",label:"根｜目的",detail:"なぜ必要なのか。何を守り、目指すのか。"},
  {short:"幹",label:"幹｜判断",detail:"何を優先し、どの方法を選ぶのか。"},
  {short:"枝",label:"枝｜立場",detail:"誰が、どの役割から実行するのか。"},
  {short:"花",label:"花｜結果",detail:"何が変わったか。次に何を改善するか。"});
}
const familyRows=all(".sales-household .four-table tbody tr").map(tr=>all("th,td",tr).map(x=>clean(x.textContent)));
const familyTopics=all(".sales-household .four-table thead th").slice(1).map(x=>clean(x.textContent));
const budgetRows=all(".sales-household .sales-example table tbody tr").map(tr=>all("th,td",tr).map(x=>clean(x.textContent)));
const caseCards=all(".km11-proof-card");
const cases=[0,1].map(i=>{
 const detail=q(["#case-a-detail","#case-b-detail"][i]);
 const card=caseCards[i];
 const ba=all(".cases-era",detail);
 const maps=all(".km11-mapping > div",card).map(row=>({
  label:clean(q("strong",row)?.textContent),
  value:clean(q("span",row)?.textContent)
 }));
 const kpis= i===0
 ? all(".qmetric",detail).map(n=>({label:clean(q("span",n)?.textContent),before:clean(q(".qmetric-before",n)?.textContent),after:clean(q(".qmetric-after",n)?.textContent)}))
 : all(".case2-keyfacts > div",detail).map(n=>({label:clean(q("small",n)?.textContent),after:clean(q("strong",n)?.textContent)}));
 return {
  title:clean(q("h3",card)?.textContent)||["工場の事業構造を再設計","新規拠点の成長モデルを構築"][i],
  lead:clean(q(":scope > p",card)?.textContent)||"",
  mapping:maps,detailNode:detail,metrics:kpis,
  before:ba[0]?{title:clean(q("h4",ba[0])?.textContent),text:clean(q("p",ba[0])?.textContent)}:null,
  after:ba[1]?{title:clean(q("h4",ba[1])?.textContent),text:clean(q("p",ba[1])?.textContent)}:null,
  caution:clean(q(".km11-card-foot",card)?.textContent)
 };
});
const simButtons=all("[data-km11-sim]");
const simData=[];
simButtons.forEach((btn,i)=>{
 btn.click();
 const area=q("#km11-sim-output");
 simData.push({
  name:clean(q("strong",btn)?.textContent),
  sub:clean(q("small",btn)?.textContent),
  title:clean(q("h3",area)?.textContent),
  items:all(".km11-sim-item",area).map(n=>({
   label:clean(q("b",n)?.textContent),
   value:clean(q("span",n)?.textContent)
  })),
  note:clean(q(".km11-sim-note",area)?.textContent)
 });
});
if(simButtons.length)simButtons[0].click();
if(!caseCards.length||!budgetRows.length||!simData.length)return; // Fail open to intact V11
const state={step:0,tree:0,topic:1,caseIndex:0,map:0,sim:0};
const params=new URLSearchParams(location.search);
const startStage=params.get("v12");
const stageNamesId=["concept","household","company","cases","simulation","contact"];
if(stageNamesId.includes(startStage))state.step=stageNamesId.indexOf(startStage);
const shell=el("section","km12-shell");
shell.id="km12-shell";
shell.setAttribute("aria-label","ことねや式 V12 操作テスト");
const nav=el("nav","km12-nav");nav.setAttribute("aria-label","内容を切り替える");
const top=el("header","km12-top");
const content=el("div","km12-content");content.id="km12-content";content.setAttribute("role","region");content.setAttribute("aria-live","polite");
const foot=el("footer","km12-foot");
const overlay=el("div","km12-modal");overlay.hidden=true;overlay.setAttribute("role","presentation");
overlay.innerHTML='<div class="km12-dialog" role="dialog" aria-modal="true" aria-labelledby="km12-modal-title">'+
 '<div class="km12-dialog-head"><h2 id="km12-modal-title"></h2><button type="button" data-km12-close>閉じる ×</button></div>'+
 '<div class="km12-dialog-body"></div></div>';
shell.append(nav,top,content,foot,overlay);root.insertBefore(shell,root.firstChild);
document.body.classList.add("km12-active");
let previousFocus=null;
function switchButtons(entries,current,action){
 return '<div class="km12-switches">'+entries.map((x,i)=>
  '<button type="button" class="km12-switch'+(i===current?' selected':'')+'" aria-pressed="'+(i===current)+'" data-km12-'+action+'="'+i+'">'+esc(x)+'</button>').join("")+'</div>';
}
function stage0(){
 const layer=layers[state.tree];
 return '<div class="km12-layout wide-left">'+
 '<div><div class="km12-tree">'+(treeSrc?'<img alt="ことねや式の木。根・幹・枝・花からなる理念図" src="'+treeSrc+'">':'<div>根 → 幹 → 枝 → 花</div>')+'</div>'+
 '<p class="km12-note">木全体はそのままに、右の4つの言葉を選んで意味を確認できます。</p></div>'+
 '<div class="km12-card km12-tint"><div class="km12-label">どの視点から考える？</div>'+
 switchButtons(layers.map(x=>x.short+"｜"+x.label.split("｜")[1]),state.tree,"tree")+
 '<h2>'+esc(layer.label)+'</h2><div class="km12-highlight">'+esc(layer.detail)+'</div>'+
 '<p class="km12-em" style="margin-top:14px">「なぜ？」から「どうだった？」までを一本につなぐ。</p>'+
 '<p class="km12-note">【根】目的　→【幹】判断　→【枝】立場　→【花】結果</p>'+
 '<button class="km12-detail-trigger" data-km12-detail="intro">従来の詳しい説明を見る</button></div></div>';
}
function stage1(){
 const labels=familyTopics.length===3?familyTopics:["学費・教育費","車の購入費","住宅・生活設備費"];
 const rowSet=familyRows.map(row=>({label:row[0],value:row[state.topic+1]||""}));
 const cell=budgetRows.map(r=>'<div class="km12-number"><small>'+esc(r[0])+'（先月 → 今月）</small>'+
 '<strong'+(r[0].includes("残り")?' class="km12-negative"':'')+'>'+esc(r[1]||"")+' → '+esc(r[2]||"")+'</strong>'+
 '<div class="km12-diff">'+esc(r[3]||"")+'</div></div>').join("");
 return '<div class="km12-layout"><div class="km12-card"><div class="km12-label">事実｜ある家庭の1か月</div><h2>収入は増えた。でも、残りは減った。</h2>'+
 '<div class="km12-numbers">'+cell+'</div><div class="km12-highlight">収支の増減だけで、家族の満足は判断できません。<br>【何のための支出だったか】を確かめます。</div>'+
 '<button class="km12-detail-trigger" data-km12-detail="family">家計の元の表を見る</button></div>'+
 '<div class="km12-card km12-tint"><div class="km12-label">思い・結果｜身近な使い道を選ぶ</div>'+
 switchButtons(labels,state.topic,"topic")+
 rowSet.map((row,i)=>'<div class="km12-question"><span class="km12-ordinal">'+String(i+1).padStart(2,"0")+'</span>'+
 '<div class="km12-value"><strong>'+esc(row.label.replace(/^\d+\s*/,""))+'</strong><div>'+esc(row.value)+'</div></div></div>').join("")+
 '<p class="km12-note">同じお金でも、何を実現できたかで次の判断は変わります。</p></div></div>';
}
function stage2(){
 const c=layers[state.tree];
 return '<div class="km12-layout"><div class="km12-card km12-tint">'+
 '<div class="km12-label">家計 → 会社</div><h2>家計の4つの問いは、経営にも使える。</h2>'+
 '<div class="km12-mapping">'+
 '<div class="km12-map-item"><strong>目的をそろえる</strong><span>何のために必要？</span></div>'+
 '<div class="km12-map-item"><strong>数字をそろえる</strong><span>何を優先して、何と比べる？</span></div>'+
 '<div class="km12-map-item"><strong>人をつなぐ</strong><span>誰が、どこまで判断する？</span></div>'+
 '<div class="km12-map-item"><strong>結果を見る</strong><span>何が変わり、次はどうする？</span></div></div>'+
 '<div class="km12-highlight">勘と経験を否定せず、【客観的な事実・共通の価値観】で確かめる。</div></div>'+
 '<div class="km12-card"><div class="km12-label">選んで確かめる｜根・幹・枝・花</div>'+
 switchButtons(layers.map(x=>x.short),state.tree,"tree")+
 '<h2>'+esc(c.label)+'</h2><p>'+esc(c.detail)+'</p>'+
 '<p class="km12-note">次の2つの検証で、この考え方が実務にどう結びついたかを見ることができます。</p>'+
 '<button class="km12-detail-trigger" data-km12-detail="company">元の会社への置き換え説明を見る</button></div></div>';
}
function caseMetrics(k){
 if(!k.metrics.length)return'<p class="km12-note">数値は元資料で確認してください。</p>';
 return '<div class="km12-kpis">'+k.metrics.map(x=>
 '<div class="km12-kpi"><small>'+esc(x.label)+'</small><strong>'+
 (x.before?esc(x.before)+'<span class="separator">→</span>':'')+esc(x.after)+'</strong></div>').join("")+'</div>';
}
function stage3(){
 const k=cases[state.caseIndex],i=state.caseIndex;
 const mapping=k.mapping[state.map]||layers[state.map];
 const originalData=k.mapping.map(x=>x.label);
 return '<div class="km12-cases">'+cases.map((x,j)=>
 '<button type="button" data-km12-case="'+j+'" class="km12-case-btn'+(j===i?' selected':'')+'" aria-pressed="'+(i===j)+'">'+
 '<b>検証'+["①","②"][j]+'｜'+(j===0?'既存事業を変える':'新規事業を育てる')+'</b>'+
 '<small>'+esc(x.title.split("｜").slice(-1)[0])+'</small></button>').join("")+'</div>'+
 '<div class="km12-layout"><div class="km12-card"><div class="km12-label">Before / After</div>'+
 '<div class="km12-before-after">'+[k.before,k.after].map((c,j)=>
 '<div class="km12-ba'+(j===1?' after':'')+'"><span class="km12-label">'+(j===0?'Before｜変更前':'After｜改善後')+'</span>'+
 '<strong>'+esc(c?.title||"")+'</strong><p>'+esc(c?.text||"")+'</p></div>').join("")+'</div>'+
 '<div class="km12-label" style="margin-top:12px">ことねや式の視点を選ぶ</div>'+
 switchButtons(layers.map(x=>x.short),state.map,"map")+
 '<div class="km12-highlight"><strong>'+esc(mapping?.label||"")+'</strong>｜'+esc(mapping?.value||mapping?.detail||"")+'</div></div>'+
 '<div class="km12-card km12-tint"><div class="km12-label">数字で確かめる</div>'+
 '<h2>'+ (i===0?'4つの指標を比較':'10営業所を分類し、採算到達を計画') +'</h2>'+
 caseMetrics(k)+'<p class="km12-note">'+esc(k.caution)+'</p>'+
 '<button class="km12-detail-trigger" data-km12-detail="'+(i===0?'caseA':'caseB')+'">元資料の図・表を詳しく見る ↗</button></div></div>';
}
function stage4(){
 const sd=simData[state.sim];
 return '<div><div class="km12-label">あなたの課題はどれに近い？</div>'+
 '<div class="km12-cases">'+simData.map((x,i)=>'<button type="button" class="km12-case-btn'+(i===state.sim?' selected':'')+'" data-km12-sim="'+i+'" aria-pressed="'+(i===state.sim)+'"><b>'+esc(x.name)+'</b><small>'+esc(x.sub)+'</small></button>').join("")+'</div>'+
 '<div class="km12-card km12-tint"><h2>'+esc(sd.title)+'</h2><div class="km12-grid2">'+
 sd.items.map(item=>'<div class="km12-map-item"><strong>'+esc(item.label)+'</strong><span>'+esc(item.value)+'</span></div>').join("")+
 '</div><p class="km12-note">'+esc(sd.note)+'</p></div>'+
 '<p class="km12-note" style="text-align:center">これは【判断の整理】であり、企業データを使った利益予測ではありません。</p></div>';
}
function stage5(){
 return '<div class="km12-end"><div class="km12-label">KEEP THINKING, KEEP IMPROVING</div>'+
 '<div class="km12-big">使う会計から、<br>つくる会計へ。</div>'+
 '<p>まず一つの困りごとから。<br>必要な数字と役割を整理して、次の判断につなぎます。</p>'+
 '<div class="km12-grid2" style="width:min(660px,100%)"><div class="km12-card km12-tint"><h3>もっと体験する</h3>'+
 '<p>家計の選択から、会社の立場へ置き換える。</p>'+
 '<button class="km12-detail-trigger" data-km12-experience>家計の体験に進む →</button></div>'+
 '<div class="km12-card km12-tint"><h3>自社について考える</h3>'+
 '<p>何を変えるか。何を確かめたいか。</p>'+
 '<button class="km12-detail-trigger" data-km12-contact>お問い合わせについて</button></div></div>'+
 '<p class="km12-note">テスト版のため、お問い合わせの送信は行いません。</p>'+
 '<strong class="km12-spot">できるかな⁉︎をカタチに！</strong></div>';
}
const views=[stage0,stage1,stage2,stage3,stage4,stage5];
function draw(){
 nav.innerHTML=stageNames.map((x,i)=>
 '<button type="button" class="km12-navbtn'+(i===state.step?' active':'')+'" data-km12-step="'+i+'"'+(i===state.step?' aria-current="step"':'')+'>'+
 '<span class="km12-n">'+String(i+1).padStart(2,"0")+'</span>'+esc(x)+'</button>').join("");
 const h=stageTitles[state.step];
 top.innerHTML='<div><div class="km12-kicker">ことねや式｜対話・選択型プレビュー V12</div>'+
 '<h1>'+esc(h[0])+'</h1><p>'+esc(h[1])+'</p></div>'+
 '<span class="km12-count">'+(state.step+1)+' / '+stageNames.length+'</span>';
 content.innerHTML=views[state.step]();
 foot.innerHTML='<button type="button" class="prev" data-km12-prev'+(state.step===0?' disabled':'')+'>‹ 戻る</button>'+
 '<span class="km12-counter">'+esc(stageNames[state.step])+'<br>画面内で切替</span>'+
 '<button type="button" class="next" data-km12-next'+(state.step===stageNames.length-1?' disabled':'')+'>次へ ›</button>';
 content.scrollTop=0;
 const activeNav=q(".km12-navbtn.active",nav);if(activeNav)activeNav.scrollIntoView({block:"nearest",inline:"nearest"});
}
function go(i){
 const next=Math.max(0,Math.min(stageNames.length-1,i));if(next===state.step)return;
 state.step=next;draw();
 try{const url=new URL(location.href);url.searchParams.set("v12",stageNamesId[next]);history.replaceState(null,"",url.pathname+url.search+url.hash);}catch(_){}
}
function openModal(which){
 const node=which==="caseA"?cases[0].detailNode:which==="caseB"?cases[1].detailNode:
   which==="family"?q(".sales-household"):
   which==="company"?q(".sales-experience-bridge"):
   q(".sales-hero");
 if(!node)return;
 previousFocus=document.activeElement;
 const panel=q(".km12-dialog-body",overlay);
 const title=q("#km12-modal-title",overlay);
 title.textContent=({caseA:"検証①｜元の図・表と補足説明",caseB:"検証②｜元の図・表と補足説明",family:"家計簿｜詳しい説明",company:"会社で考える｜詳しい説明",intro:"ことねや式｜詳しい説明"})[which]||"詳しい説明";
 panel.innerHTML="";
 const copy=node.cloneNode(true);copy.removeAttribute("id");
 all("[id]",copy).forEach(x=>x.removeAttribute("id"));
 if(copy.tagName==="DETAILS")copy.open=true;
 copy.style.display="block";panel.append(copy);
 overlay.hidden=false;
 panel.scrollTop=0;
 q("[data-km12-close]",overlay)?.focus();
}
function closeModal(){
 overlay.hidden=true;
 q(".km12-dialog-body",overlay).replaceChildren();
 if(previousFocus&&typeof previousFocus.focus==="function")previousFocus.focus();
}
shell.addEventListener("click",e=>{
 if(e.target===overlay){closeModal();return;}
 const btn=e.target.closest("button");if(!btn)return;
 const d=btn.dataset;
 if(d.km12Step!==undefined){go(Number(d.km12Step));return;}
 if("km12Prev" in d){go(state.step-1);return;}
 if("km12Next" in d){go(state.step+1);return;}
 if(d.km12Tree!==undefined){state.tree=Number(d.km12Tree);draw();return;}
 if(d.km12Topic!==undefined){state.topic=Number(d.km12Topic);draw();return;}
 if(d.km12Case!==undefined){state.caseIndex=Number(d.km12Case);state.map=0;draw();return;}
 if(d.km12Map!==undefined){state.map=Number(d.km12Map);draw();return;}
 if(d.km12Sim!==undefined){state.sim=Number(d.km12Sim);draw();return;}
 if(d.km12Detail!==undefined){openModal(d.km12Detail);return;}
 if("km12Close" in d){closeModal();return;}
 if("km12Experience" in d){if(typeof enterExperience==="function")enterExperience();return;}
 if("km12Contact" in d){const note=el("p","km12-highlight","【テスト版】お問い合わせの送信は行いません。本番反映の承認後に正式な導線を設定します。");const end=q(".km12-end",content);if(end){const old=q(".km12-contact-note",end);if(old)old.remove();note.classList.add("km12-contact-note");end.append(note);}return;}
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&!overlay.hidden)closeModal();
});
draw();
window.kotoneyaV12Audit=()=>({
 active:document.body.classList.contains("km12-active"),step:state.step,
 navCount:q(".km12-nav",shell)?.children.length||0,
 cases:cases.length,metricsA:cases[0].metrics.length,metricsB:cases[1].metrics.length,
 familyTopics:familyTopics.length,simulations:simData.length,
 modalHidden:overlay.hidden,footerVisible:!!q(".km12-foot",shell),
 horizontalOverflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth
});
})();
