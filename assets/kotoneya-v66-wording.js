
(function(){
"use strict";
const app=document.getElementById("app");
if(!app)return;
function item(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function patchCompany(){
 const host=app.querySelector(".company-explanation.company-lean");
 if(!host||host.dataset.v66==="1")return;
 const ribbon=host.querySelector(".selection-ribbon"),name=ribbon?.querySelector("strong"),label=ribbon?.querySelector("small");
 if(!name||!name.textContent.includes("家族旅行")){host.dataset.v66="1";return;}
 name.textContent="家族旅行｜準備・予約・支払管理";
 if(label)label.textContent="家計で取り組んだこと";
 const lead=host.querySelector(".story-lead");
 if(lead)lead.textContent="家計で取り組んだことを、会社の仕事に置き換えてみましょう。";
 host.dataset.v66="1";
}
function patchFinal(){
 const host=app.querySelector(".final-section.final-lean");
 if(!host||host.dataset.v66==="1")return;
 const tree=host.querySelector(".final-tree"),
       ribbon=host.querySelector(":scope > .selection-ribbon"),
       note=host.querySelector(":scope > .final-note"),
       details=note?.querySelector(".final-review-details"),
       summary=details?.querySelector("summary"),
       footer=tree?.querySelector(":scope > .v50-footer");
 if(!tree||!ribbon||!note||!details||!summary||!footer)return;
 const selected=ribbon.querySelector("strong")?.textContent.trim()||"";
 const isTravel=selected.includes("家族旅行");
 const subject=isTravel?"家族旅行｜準備・予約・支払管理":selected;
 const content=item("span","v66-summary-copy");
 content.append(item("strong","","家計で考えたことと仮想結果を振り返る"));
 content.append(item("small","",subject));
 summary.replaceChildren(content);
 summary.setAttribute("aria-label","家計で考えたことと仮想結果を振り返る｜"+subject);
 details.querySelectorAll("thead th").forEach(th=>{
   if(th.textContent.trim()==="実績・結果")th.textContent="仮想結果";
 });
 if(isTravel){
   const flow=item("div","v66-trip-steps");
   const entries=[
     ["STEP 1｜準備","役割を分担し、残作業を確認"],
     ["STEP 2｜予約・購入","未予約の移動手段を発見し、条件を確認"],
     ["STEP 3｜支払管理","旅行費105,000円の見込み・予算超過5,000円"]
   ];
   entries.forEach(([head,body])=>{
     const tile=item("div","v66-trip-step");
     tile.append(item("small","",head),item("span","",body));
     flow.append(tile);
   });
   const firstTable=details.querySelector(".tablewrap");
   if(firstTable)firstTable.before(flow);
   const footnote=details.querySelector(".small-guide");
   if(footnote)footnote.textContent="数字・結果は架空の事例です。下の表はSTEP3の費用と資金の見込みです。";
 }
 note.classList.add("v66-final-recap");
 tree.insertBefore(note,footer);
 ribbon.remove();
 host.dataset.v66="1";
}
function update(){patchCompany();patchFinal();}
let pending=false;
const observer=new MutationObserver(()=>{
 if(pending)return;
 pending=true;
 requestAnimationFrame(()=>{pending=false;update();});
});
observer.observe(app,{childList:true,subtree:false});
update();
})();
