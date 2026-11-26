
/* V12 detailed experience: persistent navigation, without rewriting existing decision logic. */
(function(){
"use strict";
const app=document.getElementById("app");
if(!app||document.getElementById("km12-appbar"))return;
const bar=document.createElement("div");bar.id="km12-appbar";bar.hidden=true;
bar.setAttribute("role","navigation");bar.setAttribute("aria-label","体験の戻る／次へ");
app.insertAdjacentElement("afterend",bar);
const q=selector=>app.querySelector(selector);
function detect(){
 if(app.hidden)return null;
 if(q("[data-final-back]"))return {name:"05 総括",prev:"[data-final-back]",next:"[data-new-case]",nextText:"別のテーマ ›"};
 if(q("[data-company-finish]"))return {name:"04 会社",prev:"[data-company-back]",next:"[data-company-finish]",nextText:"次へ ›"};
 if(q("[data-go-company]"))return {name:"03 解説",prev:"[data-back-comparison]",next:"[data-go-company]",nextText:"会社へ ›"};
 if(q(".one-household"))return {name:"02 家計簿",prev:'[data-journey="0"]',next:"[data-to-debrief]",nextText:"結果の解説へ ›",hint:"A／B／保留を選ぶ"};
 if(q("[data-enter-experience]"))return {name:"01 理念",prev:"returnSales",next:"[data-enter-experience]",nextText:"家計へ ›"};
 return {name:"体験",prev:"returnSales",next:null,nextText:"次へ ›"};
}
let stage=null;
function fit(){
 if(app.hidden||bar.hidden)return;
 const top=app.getBoundingClientRect().top;
 const navH=bar.getBoundingClientRect().height;
 app.style.height=Math.max(300,Math.floor(window.innerHeight-top-navH-7))+"px";
}
function draw(){
 stage=detect();
 if(!stage){bar.hidden=true;app.style.height="";return;}
 const nativeNext=stage.next?q(stage.next):null;
 const disabled=!nativeNext||nativeNext.disabled;
 bar.innerHTML='<button class="prev" type="button" data-km12-app-prev>‹ 戻る</button>'+
 '<span class="status">'+stage.name+'<br>'+(!nativeNext&&stage.hint?stage.hint:"画面内で進む")+'</span>'+
 '<button class="next" type="button" data-km12-app-next '+(disabled?'disabled':'')+'>'+stage.nextText+'</button>';
 bar.hidden=false;
 requestAnimationFrame(fit);
}
bar.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b||!stage)return;
 if(b.hasAttribute("data-km12-app-prev")){
  if(stage.prev==="returnSales"){if(typeof returnSales==="function")returnSales();}
  else{const target=q(stage.prev);if(target)target.click();}
 }else if(b.hasAttribute("data-km12-app-next")&&!b.disabled&&stage.next){
  const target=q(stage.next);if(target)target.click();
 }
});
new MutationObserver(draw).observe(app,{childList:true,subtree:false,attributes:true,attributeFilter:["hidden"]});
window.addEventListener("resize",fit);
draw();
window.kotoneyaV12AppAudit=()=>({visible:!bar.hidden,stage:stage?.name||null,disabled:!!bar.querySelector(".next[disabled]"),
 footerBottom:bar.hidden?null:Math.round(bar.getBoundingClientRect().bottom),
 height:app.hidden?null:Math.round(app.getBoundingClientRect().height)});
})();
