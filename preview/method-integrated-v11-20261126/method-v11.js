
(function(){
"use strict";
const root=document.getElementById("sales");
if(!root||root.dataset.km11Ready)return;
root.dataset.km11Ready="1";
function q(sel,base){return (base||root).querySelector(sel)}
function make(tag,cls,markup){const e=document.createElement(tag);e.className=cls;if(markup!==undefined)e.innerHTML=markup;return e}
const cases=[
 {name:"検証①",title:"既存事業を変える｜工場の事業構造を再設計",
 lead:"量産と試作・特注の役割を組み替え、熟練工の強みを活かす。",
 root:"事業を続け、熟練工の強みを活かす",
 trunk:"自社で試作・特注、量産は外注先と分担",
 branch:"経営・生産現場・外注先の役割を整理",
 flower:"売上規模指数 1→5、作業員数35→15、外注比率10→90%などを検証",
 note:"売上規模・費用構造の変化を示すもの。利益増加を断定する数値ではありません。",
 detail:"case-a-detail"},
 {name:"検証②",title:"新しい事業を育てる｜10営業所から出店モデルを構築",
 lead:"既存10営業所を地域特性で分類し、新規拠点の成長と採算を計画する。",
 root:"新規出店で、採算の見通しを持てるようにする",
 trunk:"季節変動・売れ筋・変動費・固定費で出店計画を構成",
 branch:"営業所・経営・管理部門が共通条件で判断",
 flower:"A型6拠点・B型4拠点、損益分岐点到達14〜18か月の計画基準",
 note:"14〜18か月は設計上の基準。実際の黒字化実績や保証ではありません。",
 detail:"case-b-detail"}
];
const head=q(".case-review-link");
if(head){
 head.querySelectorAll("nav").forEach(n=>n.remove());
 const nav=make("nav","km10-flow-nav",
 '<a href="#sales-title">理念</a><a href="#sales-home">家計の例</a><a href="#method-proof">根・幹・枝・花</a><a href="#sales-cases">検証①・②</a><a href="#method-simulator">自社で試す</a><a href="#sales-contact">相談</a>');
 nav.setAttribute("aria-label","ことねや式を順に読む");head.appendChild(nav);
 head.insertAdjacentElement("beforebegin",make("div","km11-test-label","配置と内容を確認するためのテストページ｜本番サイトは未変更"));
}
const experience=q(".sales-experience-bridge"),caseSection=q("#sales-cases");
if(experience&&caseSection){
 const proof=make("section","km11-proof",
 '<div class="km11-eyebrow">理念を、実務の判断につなげる</div>'+
 '<h2 id="method-proof">ことねや式は、仕事でどう形になるのか。</h2>'+
 '<p>家計では【何を大切にしたいか】から考えました。会社では根・幹・枝・花の関係をつなぎ、経営の選択を検証できる形にします。</p>'+
 '<div class="km11-layers" aria-label="ことねや式の4つの視点">'+
 '<div class="km11-layer"><span class="letter">根｜目的</span><small>なぜ必要なのか。何を守り、目指すのか。</small></div>'+
 '<div class="km11-layer"><span class="letter">幹｜判断</span><small>何を優先し、どの方法を選ぶのか。</small></div>'+
 '<div class="km11-layer"><span class="letter">枝｜立場</span><small>誰が、どの役割から実行するのか。</small></div>'+
 '<div class="km11-layer"><span class="letter">花｜結果</span><small>何が変わったか。次に何を改善するか。</small></div></div>'+
 '<div class="km11-proof-join">この4つの視点から、2つの実務を見てみる</div>'+
 '<p class="km11-proof-note">異なる業種や規模でも、経営課題を整理する順番は共通です。結果の意味は、数値とその前提条件を分けて確かめます。</p>');
 caseSection.parentNode.insertBefore(proof,caseSection);
}
if(caseSection){
 const kicker=q(".cases-kicker span:first-child",caseSection);
 if(kicker)kicker.textContent="理念からつながる2つの実務検証";
 const heading=q(".cases-title",caseSection);
 if(heading)heading.textContent="目的から判断へ。数字で確かめた2つの事例。";
 const intro=q(".cases-intro",caseSection);
 if(intro)intro.textContent="検証①は【既存事業をどう変えるか】、検証②は【新しい事業をどう育てるか】。根・幹・枝・花の視点を実際の経営判断に当てはめます。";
 const old=q(".cases-overview",caseSection),cards=make("div","km11-proof-cards");
 cases.forEach(v=>{
  const mapping=[["根｜目的",v.root],["幹｜判断",v.trunk],["枝｜立場",v.branch],["花｜結果",v.flower]]
    .map(x=>'<div><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join("");
  cards.appendChild(make("article","km11-proof-card",
   '<span class="km11-card-tag">'+v.name+'</span><h3>'+v.title+'</h3><p>'+v.lead+'</p>'+
   '<div class="km11-mapping" aria-label="'+v.name+'の理念との対応">'+mapping+'</div>'+
   '<p class="km11-card-foot">'+v.note+'</p>'+
   '<a class="km11-detail-link" data-km11-detail="'+v.detail+'" href="#'+v.detail+'">Before・Afterと数値を確認する →</a>'));
 });
 if(old){old.parentNode.insertBefore(cards,old);old.classList.add("km11-replaced")}
 else caseSection.appendChild(cards);
}
const specs={
 business:{title:"既存事業の構造を見直す",cells:[
  ["根｜目的","何を自社に残すか。自社の強みと継続条件を明確にする。"],
  ["幹｜判断","内製・外注、受注構成、原価と固定費の関係を比較する。"],
  ["枝｜立場","経営・現場・外注先・管理部門の責任範囲を整理する。"],
  ["花｜確かめる結果","売上だけでなく、人員・外注構成・固定費率と利益を別々に確認する。"]],
  note:"検証①の考え方に対応します。実績を入力した数値試算ではありません。"},
 branch:{title:"新しい営業所・支店を計画する",cells:[
  ["根｜目的","どの地域に、何を提供する拠点をつくるかを決める。"],
  ["幹｜判断","既存拠点の季節変動と売れ筋を分類し、費用の発生時期をそろえる。"],
  ["枝｜立場","本部・営業所・管理部門で売上計画と出店判断を共有する。"],
  ["花｜確かめる結果","売上・変動費・固定費の月次推移から、採算到達条件を検証する。"]],
  note:"検証②のモデル設計に対応します。14〜18か月は事例の基準であり、他社の予測値ではありません。"},
 general:{title:"まず判断の材料を整理する",cells:[
  ["根｜目的","何が困っているのか。改善することで何を実現したいのか。"],
  ["幹｜判断","選べる方法と優先順位、比較する条件をそろえる。"],
  ["枝｜立場","経営者・総務経理・現場が見ている事実を集める。"],
  ["花｜確かめる結果","予定と実際を比べ、次の一手を決める。"]],
  note:"最初の整理に使う構成例です。数字の推計・保存・送信は行いません。"}
};
function showSim(key){
 const d=specs[key],output=q("#km11-sim-output");
 if(!d||!output)return;
 output.innerHTML='<h3>'+d.title+'</h3><div class="km11-sim-grid">'+
 d.cells.map(x=>'<div class="km11-sim-item"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join("")+
 '</div><p class="km11-sim-note">'+d.note+'</p>';
 root.querySelectorAll("[data-km11-sim]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.km11Sim===key)));
}
const support=q(".sales-what-next"),contact=q("#sales-contact");
if(support&&contact){
 const sim=make("section","km11-simulator",
 '<div class="km11-eyebrow">検証から、あなたの会社へ</div>'+
 '<h2 id="method-simulator">自社なら、どこから考える？</h2>'+
 '<p class="intro">実務の2事例を、自社の課題に置き換えてみましょう。根・幹・枝・花の順に、必要な判断材料を整理します。</p>'+
 '<div class="km11-sim-options" role="group" aria-label="検討したい経営課題を選ぶ">'+
 '<button class="km11-sim-option" type="button" data-km11-sim="business" aria-pressed="true"><strong>既存事業を見直したい</strong><small>自社の強み、内製・外注、固定費を整理</small></button>'+
 '<button class="km11-sim-option" type="button" data-km11-sim="branch" aria-pressed="false"><strong>新規拠点を計画したい</strong><small>地域特性、売れ筋、採算到達を整理</small></button>'+
 '<button class="km11-sim-option" type="button" data-km11-sim="general" aria-pressed="false"><strong>何から始めるか考えたい</strong><small>目的と判断材料の棚卸しから</small></button></div>'+
 '<div id="km11-sim-output" class="km11-sim-output" aria-live="polite"></div>'+
 '<div class="km11-sim-ctas"><button type="button" class="btn primary" data-km11-experience>家計の体験をもっと詳しく試す ›</button><a href="#sales-contact">相談の入口へ進む →</a></div>'+
 '<p class="km11-sim-note">これは【判断の整理シミュレーション】です。実際の事業データによる数値予測ではありません。情報を自動送信・保存することもありません。</p>');
 contact.parentNode.insertBefore(sim,contact);showSim("business");
}
const contacts=[...root.querySelectorAll('a[href="/contact/"]')];
contacts.forEach(a=>{
 const bt=document.createElement("button");bt.type="button";bt.className=a.className;bt.dataset.km11Contact="";
 bt.textContent="お問い合わせについて確認する";a.replaceWith(bt);
});
if(contact)contact.appendChild(make("p","km11-preview-contact","【テスト版】お問い合わせの送信は行いません。正式な相談先への接続は、本番反映の承認後に設定します。"));
root.addEventListener("click",e=>{
 const sim=e.target.closest("[data-km11-sim]");
 if(sim){showSim(sim.dataset.km11Sim);return}
 const detail=e.target.closest("[data-km11-detail]");
 if(detail){const d=document.getElementById(detail.dataset.km11Detail);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({block:"start",behavior:"smooth"}),0)}return}
 const exp=e.target.closest("[data-km11-experience]");
 if(exp){if(typeof enterExperience==="function")enterExperience();return}
 const cnt=e.target.closest("[data-km11-contact]");
 if(cnt){const note=q(".km11-preview-contact");if(note)note.scrollIntoView({block:"nearest",behavior:"smooth"});return}
});

const experienceApp=document.getElementById("app");
if(experienceApp){
 experienceApp.addEventListener("click",function(event){
   const anchor=event.target.closest('a[href="/contact/"]');
   if(!anchor)return;
   event.preventDefault();
   const note=make("div","km11-preview-contact","【テスト版】お問い合わせの送信は無効です。正式な問い合わせ先への接続は本番反映の承認後に設定します。");
   const old=experienceApp.querySelector(".km11-preview-contact");
   if(old)old.remove();
   experienceApp.appendChild(note);
   note.scrollIntoView({block:"nearest",behavior:"smooth"});
 });
}
window.kotoneyaV11Audit=function(){
 const width=document.documentElement.clientWidth;
 return {width,proof:!!q("#method-proof"),cases:root.querySelectorAll(".km11-proof-card").length,
  caseDetails:root.querySelectorAll("#sales-cases details.cases-detail").length,
  simulator:!!q("#method-simulator"),simOptions:root.querySelectorAll("[data-km11-sim]").length,
  selectedOptions:root.querySelectorAll('[data-km11-sim][aria-pressed="true"]').length,
  overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-width,
  productionContactLinks:root.querySelectorAll('a[href="/contact/"]').length};
};
})();
