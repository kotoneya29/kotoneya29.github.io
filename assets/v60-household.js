
(function(){
"use strict";
if(typeof DATA==="undefined"||typeof S==="undefined"||typeof app==="undefined")return;
const topicNames={education:"教育費",car:"車",travel:"家族旅行"};
const scenario={
education:{
purpose:"子どもが無理なく学習を続けられるようにする。",
conditions:[["月の自由枠","10,000円"],["予定貯蓄","25,000円／月"],["学習の目標","週3回"],["家族の条件","子ども1人"]],
plans:[["毎月の追加支出（予定）","4,000円","12,000円"],["自由枠との差（予定）","6,000円残る","2,000円不足"],["家族の関与（予定）","見守り4時間／月","送迎2時間／月"],["学習回数の目標","週3回","週3回"]],
assessTitle:"C｜継続方法を決める前に試す",assessText:"体験2回、交通費等1,000円。月額学習のA・Bとは期間が違うため、同じ費用の表には入れません。",
meaning:{
a:["教材費を抑える一方、家族の見守りが必要。仮想結果では週3回の目標に届いていません。","子どもが自分で続けられる仕組みと、家族の支え方を見直す。"],
b:["学習回数は目標どおり。ただし月謝は自由枠を2,000円超え、送迎時間も予定より増えます。","不足する2,000円と送迎負担をどう調整するか。調整できなければ方法を考え直す。"],
hold:["体験2回はできましたが、継続して週3回学べるかは未判定です。","本人の反応・通いやすさ・継続費用を確かめてからA・Bの判断に戻る。"]
},
diff:{a:["＋500円／月","＋1時間／月","−1回／週","−500円","0円"],b:["0円","＋2時間／月","0回／週","0円"],hold:["0円","0回","未判定","0円"]},
foot:{a:"月の自由枠10,000円から実績4,500円を引くと5,500円。予定貯蓄25,000円は維持する想定です。",b:"「予定との差0円」と「予算に収まる」は別です。自由枠10,000円に対して月謝12,000円で2,000円不足します。",hold:"体験費1,000円は2回分の一時支出です。継続費と直接比較できません。"}
},
car:{
purpose:"家族が安心して移動できる状態を、無理のない費用で保つ。",
conditions:[["現在の貯蓄","200万円"],["守る防衛資金","100万円"],["走行距離","720km／月"],["燃料単価","170円／L"]],
plans:[["初期支出の見積","12万円","95万円"],["支払後の貯蓄（見込み）","188万円","105万円"],["防衛資金との差（見込み）","88万円余裕","5万円余裕"],["燃料費／月（同条件の試算）","12,240円","8,160円"]],
assessTitle:"C｜整備か買い替えを決める前に点検",assessText:"点検費6,000円。修理が必要か、緊急性や対象範囲は何かを確認する段階。整備・購入した結果とは分けます。",
meaning:{
a:["整備費は12万円の見積から14万円へ増加。資金は防衛資金を上回りますが、整備しただけで将来の安全性は確認できません。","整備箇所の状態、保証、今後の点検や追加費用を確かめる。"],
b:["購入額は見積95万円から98万円へ増加。貯蓄は102万円で防衛資金との差は2万円です。","安全性・保険や税金・今後の整備費も含めて資金余力と比較する。"],
hold:["点検費6,000円で、部品1件・修理見積3万円という新しい情報を得た段階です。","修理の必要性と緊急度を確かめる。Aの整備見積12万円と同じ範囲とは限りません。"]
},
diff:{a:["＋2万円","−2万円","−2万円"],b:["＋3万円","−3万円","−3万円"],hold:["0円","0円","点検で判明"]},
foot:{a:"燃料費は旧車で12,240円／月のまま。安全性は実際の点検結果で確認する必要があります。",b:"燃料費12,240円→8,160円は旧車・候補車の試算比較（4,080円／月減）。購入後の実測値ではありません。",hold:"点検で判明した3万円の修理見積は、Aの整備見積12万円と同一範囲と確認されていません。"}
}
};
const tripTitles=["準備と役割を決める","予約・購入を確認する","予算と支払予定を管理する"];
const tripKeys=["a","b","hold"];
const tripPrompts=[
["役割と残作業を見える化","誰が何を担当し、未完了の準備をどこで引き継ぐかを確かめる。","担当は明確になった一方、負担の偏りが解消したかはまだ確認できません。"],
["必要性と確認・決裁","宿泊条件と予約番号、交通費の購入判断と決済を分けて確認する。","予約済みと思い込んでいた移動手段が未予約と判明。決済済みと予約完了は同じではありません。"],
["費用総額と資金の動き","旅行費10万円の予算と、宿泊・交通・現地費の合計、引落予定を区別する。","合計105,000円の見込みで5,000円超過。交通費のカード利用と後日の口座引落は二重計上しません。"]
];
const params=new URLSearchParams(location.search);const savedTopic=(typeof S.topic==="string"&&topicNames[S.topic]?S.topic:null)||(topicNames[params.get("topic")]?params.get("topic"):null);const savedChoice=(["a","b","hold"].includes(S.decision)?S.decision:null)||(["a","b","hold"].includes(params.get("decision"))?params.get("decision"):null);const state={topic:savedTopic||"education",choice:savedChoice,step:savedTopic==="travel"&&["0","1","2"].includes(sessionStorage.getItem("kotoneya-v61-last-step"))?Number(sessionStorage.getItem("kotoneya-v61-last-step")):savedTopic==="travel"?Math.max(0,tripKeys.indexOf(savedChoice)):0};
let attached=false;
function element(tag,cls,txt){
 const x=document.createElement(tag);
 if(cls)x.className=cls;
 if(txt!==undefined&&txt!==null)x.textContent=String(txt);
 return x;
}
function add(parent,...children){children.forEach(x=>{if(x)parent.append(x)});return parent;}
function heading(tag,txt,cls){return element(tag,cls||"",txt)}
function button(txt,cls,fn){const x=element("button",cls||"v60-btn",txt);x.type="button";x.addEventListener("click",fn);return x}
function rowData(head,rows){
 const shell=element("div","v60-scroll");
 const table=element("table");
 const thead=element("thead"),hr=element("tr");
 head.forEach(c=>add(hr,element("th","",c)));
 add(thead,hr);add(table,thead);
 const tbody=element("tbody");
 rows.forEach(arr=>{
  const tr=element("tr");
  arr.forEach((cell,i)=>{const td=element(i===0?"th":"td","",cell);if(i===0)td.scope="row";if(i>0&&/(不足|超過|−[0-9]|＋[1-9]|未判定)/.test(String(cell)))td.classList.add("v60-critical");add(tr,td)});
  add(tbody,tr);
 });
 add(table,tbody);add(shell,table);return shell;
}
function conditionCard(k,v){const x=element("div");add(x,element("small","",k),element("b","",v));return x}
function helpText(txt,cls){return element("p",cls||"v60-muted",txt)}
function sectionLabel(txt){return heading("h2",txt,"v60-label")}
function go03(topic,decision){
 if(!topic||!decision)return;
 location.href="/method/experience/?section=3&topic="+encodeURIComponent(topic)+"&decision="+encodeURIComponent(decision);
}
function sync(){
 S.stage="experience";S.phase="home";S.step=2;S.topic=state.topic;S.decision=state.choice;
 if(app.querySelector("#v60-household")){const url=new URL(location.href);url.searchParams.set("section","2");url.searchParams.set("topic",state.topic);if(state.choice)url.searchParams.set("decision",state.choice);else url.searchParams.delete("decision");if(url.href!==location.href)history.replaceState(history.state,"",url.pathname+url.search+url.hash)}
 const bar=app.querySelector(".journey");
 if(bar&&typeof journey==="function"){const tmp=document.createElement("div");tmp.innerHTML=journey();const replacement=tmp.firstElementChild;if(replacement)bar.replaceWith(replacement)}
}
function setTopic(topic){
 if(!topicNames[topic])return;
 state.topic=topic;state.choice=null;state.step=0;sync();draw();
}
function setChoice(key){
 if(!["a","b","hold"].includes(key))return;
 state.choice=state.choice===key?null:key;sync();draw();
}
function setTravelStep(i){
 state.step=i;state.choice=tripKeys[i];sync();draw();
}
function build(){
 const root=element("section","one-household v60-app");
 root.id="v60-household";
 add(root,element("div","v60-eyebrow","02 家計簿｜目的・比較・仮想結果"),
 heading("h1","家計なら、どう判断する？"),helpText("同じ条件で比べる → 方法を選ぶ → 仮想結果を確かめる → 03で判断を振り返る。","v60-lead"));
 const tabs=element("nav","v60-topics");tabs.setAttribute("aria-label","家計のテーマ");
 for(const id of ["education","car","travel"]){const b=button((DATA[id]?.icon||"")+" "+topicNames[id],"",()=>setTopic(id));b.dataset.v60Topic=id;b.setAttribute("aria-pressed",String(state.topic===id));add(tabs,b)}
 root.append(tabs);
 const content=element("div");content.id="v60-topic-body";root.append(content);
 return root;
}
function draw(){
 const root=document.getElementById("v60-household");if(!root)return;
 root.querySelectorAll("[data-v60-topic]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.v60Topic===state.topic)));
 const body=root.querySelector("#v60-topic-body");body.replaceChildren();
 if(state.topic==="travel"){drawTravel(body)}else{drawAlternatives(body)}
}
function drawAlternatives(host){
 const typ=state.topic,cfg=scenario[typ],d=DATA[typ];
 const intro=element("section","v60-panel v60-focus");
 add(intro,element("small","v60-kicker","① 判断前｜目的と制約"),heading("h2",cfg.purpose));
 const conditions=element("div","v60-conditions");cfg.conditions.forEach(([name,val])=>conditions.append(conditionCard(name,val)));intro.append(conditions);
 if(typ==="car")intro.append(helpText("安全性の数値比較は未設定。費用や燃料費だけで「どちらが安全か」は判断できません。"));
 else intro.append(helpText("同じ目的に対して、A・Bは継続方法、Cは事前に試して確かめる方法です。"));
 host.append(intro);
 const choose=element("section","v60-panel");
 add(choose,element("small","v60-kicker","② 進め方を選ぶ"),heading("h2",typ==="car"?"整備・買い替え・点検から選ぶ":"自宅学習・教室・体験から選ぶ"));
 const opts=element("div","v60-choice-grid");
 [["a","A"],["b","B"],["hold","C"]].forEach(([key,label])=>{
  const o=d.options[key],node=button("","v60-choice",()=>setChoice(key));
  const expanded=state.choice===key;
  node.dataset.v60Choice=key;
  node.setAttribute("aria-pressed",String(expanded));
  node.setAttribute("aria-expanded",String(expanded));
  node.setAttribute("aria-label",label+" "+o.name+"｜"+(expanded?"仮想結果を閉じる":"仮想結果を開く"));
  const role=key==="hold"?(typ==="car"?"判断前の点検":"判断前の体験"):"実行方法";
  add(node,element("small","",label+"｜"+o.amount),element("strong","",o.name),element("span","v62-card-role",role),element("em","",expanded?"仮想結果を閉じる":"仮想結果を開く"));
  opts.append(node);
 });
 choose.append(opts);
 const details=element("details","v60-compare-details");
 if(!state.choice)details.open=true;
 details.append(element("summary","", "A・Bの計画を比較（Cは別の条件）"));
 const compareLabel=typ==="education"?["確認項目","A 自宅学習","B 学習教室"]:["確認項目","A 整備","B 買い替え"];
 details.append(rowData(compareLabel,cfg.plans));
 details.append(helpText(typ==="car"?"燃料費は旧車と候補車の同条件での試算。購入後の実測値ではありません。":"家庭の見守り時間と送迎時間は性質が異なり、時間数だけで負担は判断できません。"));
 choose.append(details);
 const note=helpText(typ==="car"?"Cの点検はA・Bを決める前に状態を確かめる方法です。費用と結果は同じ条件では比較できません。":"Cの体験は2回だけの一時支出です。A・Bの月額学習とは期間を揃えて比較できません。","v60-choice-note");
 choose.append(note);host.append(choose);
 if(state.choice)drawAlternativeResult(host);else host.append(element("div","v60-empty","A・B・CのBOXを押すと仮想結果が開きます。同じBOXをもう一度押すと閉じます。"));
}
function drawAlternativeResult(host){
 const typ=state.topic,key=state.choice,cfg=scenario[typ],d=DATA[typ],data=d.results[key],opts=d.options[key];
 const panel=element("section","v60-result");panel.id="v60-result";
 const title=element("div","v60-result-head");
 const h=element("div");add(h,element("small","v60-kicker","③ 選択後｜予定と仮想結果"),element("strong","",opts.name));
 add(title,h,element("span","v60-status","架空のシミュレーション"));panel.append(title);
 const layout=element("div","v60-result-grid"),left=element("div"),right=element("aside","v60-insight");
 const extra=(typeof DISPLAY36!=="undefined"&&DISPLAY36[typ+"-"+key]?.rows)||[];
 const filtered=typ==="car"?data.rows.filter(x=>!x[0].includes("燃料費")):data.rows;
 const rows=filtered.concat(extra);
 const diffs=cfg.diff[key];
 const entries=rows.map((r,i)=>[r[0],r[1],r[2],diffs[i]||"—"]);
 left.append(rowData(["確認項目","予定・基準","仮想結果","差・変化"],entries));
 if(typ==="car"&&key!=="hold"){
  const fuel=element("div","v60-warning");
  fuel.textContent="参考｜月720kmの燃料費（同条件の試算）：旧車12,240円／候補車8,160円。差額4,080円／月。これは予定と仮想結果の差ではありません。";
  left.append(fuel);
 }
 if(!(typ==="car"&&key!=="hold"))left.append(helpText(cfg.foot[key],"v60-footnote"));
 add(right,element("strong","","この結果から何が言える？"),helpText(cfg.meaning[key][0]),element("strong","","次に判断すること"),helpText(cfg.meaning[key][1]));
 add(layout,left,right);panel.append(layout);
 const acts=element("div","v60-result-actions");
 add(acts,button("別の方法を比較する","v60-btn",()=>{state.choice=null;sync();draw()}),button("03 解説へ進む →","v60-btn v60-btn-primary",()=>go03(typ,key)));
 panel.append(acts);host.append(panel);
}
function drawTravel(host){
 const d=DATA.travel;
 const intro=element("section","v60-panel v60-focus");
 add(intro,element("small","v60-kicker","① 判断前｜今回の目的と制約"),heading("h2",d.purpose));
 const cond=element("div","v60-conditions");
 [["旅行人数","家族3人"],["旅行予算","100,000円"],["費用の性質","一時支出"],["支出前の貯蓄","200万円"]].forEach(([k,v])=>cond.append(conditionCard(k,v)));
 intro.append(cond);intro.append(helpText("旅行はA・B・Cから一つ選ぶ話ではありません。準備・予約・支払管理の3工程を順番に進めます。"));host.append(intro);
 const frame=element("section","v60-panel");
 add(frame,element("small","v60-kicker","② 進め方｜3つの工程はつながっています"),heading("h2","準備 → 予約・購入 → 予算と資金"));
 const nav=element("div","v60-step-nav");
 tripTitles.forEach((title,i)=>{const b=button("","",()=>setTravelStep(i));b.setAttribute("aria-current",state.step===i?"step":"false");add(b,element("small","","STEP "+(i+1)),element("strong","",title));nav.append(b)});
 frame.append(nav);host.append(frame);
 const idx=state.step,key=tripKeys[idx],result=d.results[key],note=tripPrompts[idx];
 const resultPanel=element("section","v60-result");
 const head=element("div","v60-result-head");
 const title=element("div");add(title,element("small","v60-kicker","③ この工程で変わったこと"),element("strong","","STEP "+(idx+1)+"｜"+tripTitles[idx]));
 add(head,title,element("span","v60-status","仮想の経過"));resultPanel.append(head);
 if(idx===2){
  const stats=element("div","v60-trip-stats");
  [["旅行予算","100,000円"],["費用の合計見込み","105,000円"],["予算超過","5,000円"]].forEach(([k,v])=>stats.append(conditionCard(k,v)));resultPanel.append(stats);
 }
 const body=element("div","v60-result-grid"),left=element("div"),right=element("aside","v60-insight");
 const headers=["確認項目",idx===2?"計画・基準":"変更前","仮想結果・確認内容"];
 left.append(rowData(headers,result.rows));
 if(idx===2){
  const separate=element("div","v60-warning","12/12の交通費カード利用25,000円と、1/27の口座引落25,000円は同じ費用です。旅行費を2回計上しません。");
  left.append(separate);
 }
 left.append(helpText(result.money,"v60-footnote"));
 add(right,element("strong","",note[0]),helpText(note[1]),element("strong","","この工程で分かったこと"),helpText(note[2]));
 add(body,left,right);resultPanel.append(body);
 const actions=element("div","v60-result-actions");
 actions.append(button("03 解説へ進む →","v60-btn v60-btn-primary",()=>{sessionStorage.setItem("kotoneya-v61-last-step",String(idx));go03("travel","hold")}));
 resultPanel.append(actions);host.append(resultPanel);
}
function patch03(){
 const section=app.querySelector(".compact-debrief");
 if(!section||section.dataset.v60)return;
 section.dataset.v60="1";
 const label=section.querySelector(".debrief-section h2");
 if(label&&label.textContent.trim()==="予定と結果")label.textContent="予定と仮想結果";
 section.querySelectorAll("thead th").forEach(x=>{
  if(x.textContent.trim()==="実績・結果")x.textContent="仮想結果";
 });
 const topic=S.topic;if(!topicNames[topic])return;
 const bridge=element("div","v60-bridge");
 if(topic==="travel"){
  section.querySelector("h1").textContent="家族旅行、3つの工程で何が分かった？";
  const ribbon=section.querySelector(".selection-ribbon");
  if(ribbon){
   const label=ribbon.querySelector("small"),value=ribbon.querySelector("strong");
   if(label)label.textContent="家計で進めた内容";
   if(value)value.textContent="家族旅行｜準備・予約・支払管理";
  }
  add(bridge,element("strong","","役割・予約・支払管理を、一つの旅行計画として振り返る"));
  const review=element("div","v61-travel-summary");
  const items=[
   ["STEP 1｜準備","役割を分担","残作業と負担の偏りは確認が必要"],
   ["STEP 2｜予約・購入","移動手段が未予約と判明","予約番号と購入条件を確認"],
   ["STEP 3｜費用・資金","費用見込み105,000円","予算超過5,000円と引落日を管理"]
  ];
  items.forEach(([title,found,action])=>{
   const card=element("div","v61-step-card");
   add(card,element("small","",title),element("strong","",found),helpText(action));
   review.append(card);
  });
  bridge.append(review);
  bridge.append(helpText("下の表はSTEP3の費用・資金の詳細です。12/12のカード利用と1/27の口座引落は同じ費用で、二重計上しません。"));
  const first=section.querySelector(".debrief-section h2");if(first)first.textContent="STEP3｜費用と資金の確認";
  const blocks=[...section.querySelectorAll(".debrief-section")];
  if(blocks[1]){const p=blocks[1].querySelector("p");if(p)p.textContent="担当の分担を整理し、移動手段の未予約を発見しました。一方、費用見込みは予算10万円に対して10万5,000円で、5,000円超過しています。";}
  if(blocks[2]){const p=blocks[2].querySelector("p");if(p)p.textContent="準備の分担、予約の確定、費用の計上、実際の引落は別々の確認事項です。カード利用と引落を重複して旅行費に計上してはいけません。";}
  if(blocks[3]){const p=blocks[3].querySelector("p");if(p)p.textContent="残作業と負担を確認し、予約を確定させ、予算超過5,000円をどう調整するか決めます。あわせて引落日までの資金予定を管理します。";}
 }else{
  add(bridge,element("strong","","選択前の比較から、選択後の検証へ"),
   helpText(topic==="education"?"学習の目標・家計の予算枠・家族の負担を一緒に考えます。体験案は継続案と同一期間で比較しません。":"整備・買い替えの費用と資金余力を分けて判断します。点検は判断材料を増やす工程で、整備・購入した結果ではありません。"));
 }
 const ribbon=section.querySelector(".selection-ribbon");if(ribbon)ribbon.after(bridge);else section.querySelector("h1")?.after(bridge);
}
function patch(){
 const original=app.querySelector(".one-household:not(.v60-app)");
 if(original){
  if(typeof DATA.travel==="undefined")return;
  const dest=build();original.replaceWith(dest);
  if(!attached){attached=true;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.querySelector("#k56-panel")?.dataset.open==="true"){const n=document.querySelector("#k56-panel");n.dataset.open="false"}})}
  const p=document.querySelector("#k56-panel");if(p)p.dataset.open="false";
  sync();draw();
 }
 if(app.querySelector(".compact-debrief"))patch03();
}
let waiting=false;
const obs=new MutationObserver(()=>{if(waiting)return;waiting=true;requestAnimationFrame(()=>{waiting=false;patch()})});
obs.observe(app,{childList:true,subtree:false});
patch();
})();
