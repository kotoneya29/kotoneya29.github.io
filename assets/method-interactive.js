(function(){
  'use strict';
  var root=document.getElementById('kt-method');
  if(!root)return;
  var front=document.getElementById('kt-front');
  var back=document.getElementById('kt-back');
  var returned=document.getElementById('kt-return');
  var steps=Array.prototype.slice.call(root.querySelectorAll('[data-quiz-step]'));
  var dots=Array.prototype.slice.call(root.querySelectorAll('[data-step-dot]'));
  var state={scenario:null,reason:null,feeling:null,next:null,intuition:null};
  var examples={
    education:{label:'塾の費用',reasons:[['学ぶ機会を増やしたかった','将来の選択肢を広げるため'],['本人の希望を応援したかった','挑戦するきっかけがほしかった'],['安心して学べる環境がほしかった','続けられる環境を整えたかった']]},
    car:{label:'車の買い替え',reasons:[['家族の移動を楽にしたかった','時間や負担を減らすため'],['安全・安心を重視したかった','長く安心して乗るため'],['暮らしの時間を増やしたかった','外出や行動を広げるため']]},
    home:{label:'エアコンの購入',reasons:[['夏を快適に過ごしたかった','毎日の快適さのため'],['健康や安心を優先したかった','家族の暮らしを守るため'],['古い設備を見直したかった','手間や将来の費用を考えて']]}
  };
  function byId(id){return document.getElementById(id);}
  function txt(id,v){byId(id).textContent=v;}
  function setPhase(stage){
    var isBack=stage==='back';
    front.hidden=isBack; back.hidden=!isBack;
    byId('kt-status-front').removeAttribute('aria-current');
    byId('kt-status-back').removeAttribute('aria-current');
    byId('kt-status-return').removeAttribute('aria-current');
    var current=isBack?'kt-status-back':(returned.hidden?'kt-status-front':'kt-status-return');
    byId(current).setAttribute('aria-current','step');
    requestAnimationFrame(function(){(isBack?back:front).scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});(isBack?byId('kt-back-title'):byId('kt-front-title')).focus({preventScroll:true});});
  }
  function setStep(n){
    steps.forEach(function(el,i){el.hidden=i!==n;});
    dots.forEach(function(el,i){el.classList.toggle('kt-done',i<n);el.classList.toggle('kt-now',i===n);});
    if(n===4)dots.forEach(function(el){el.classList.add('kt-done');});
    var question=steps[n].querySelector('h3');
    if(question){question.setAttribute('tabindex','-1');requestAnimationFrame(function(){question.focus({preventScroll:true});});}
    var game=byId('kt-game');
    if(n>0)requestAnimationFrame(function(){game.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
  }
  function reset(){
    state={scenario:null,reason:null,feeling:null,next:null,intuition:null};
    byId('kt-intuition-feedback').hidden=true;
    root.querySelectorAll('[data-intuition]').forEach(function(el){el.setAttribute('aria-pressed','false');});
    byId('kt-memo').value='';
    setStep(0);
  }
  function renderReasonOptions(){
    var slot=byId('kt-reason-options'); slot.textContent='';
    examples[state.scenario].reasons.forEach(function(item,i){
      var button=document.createElement('button');button.type='button';button.className='kt-reason-choice';button.dataset.reason=item[0];
      var b=document.createElement('b');b.textContent=item[0];var sm=document.createElement('small');sm.textContent=item[1];
      button.appendChild(b);button.appendChild(sm);slot.appendChild(button);
    });
  }
  function result(){
    var ex=examples[state.scenario]; if(!ex||!state.reason||!state.feeling||!state.next)return;
    txt('kt-recap-item',ex.label);txt('kt-recap-reason',state.reason);txt('kt-recap-feeling',state.feeling);txt('kt-recap-next',state.next);
    var message=state.feeling==='満足した'?'満足は、支出だけではわからない「得られた価値」。その理由を確かめれば、次の選択にも活かせます。':(state.feeling==='後悔した'?'後悔したことにも意味がある。何を期待し、何が違ったのかを知れば、次は別の選び方ができます。':'迷っていることも大切な情報。すぐに結論を出さず、何が良くて何が気になったのかを確かめてみましょう。');
    txt('kt-insight-text',message+'　数字は「何が起きたか」、あなたの振り返りは「なぜ・どうだった・次は」を教えてくれます。');
    setStep(4);
  }
  root.addEventListener('click',function(ev){
    var target=ev.target.closest('button');if(!target||!root.contains(target))return;
    if(target.id==='kt-start'){reset();setPhase('back');return;}
    if(target.id==='kt-back-to-front'){setPhase('front');return;}
    if(target.id==='kt-play-again'||target.id==='kt-another'){reset();setPhase('back');return;}
    if(target.hasAttribute('data-intuition')){
      state.intuition=target.dataset.intuition;
      root.querySelectorAll('[data-intuition]').forEach(function(el){el.setAttribute('aria-pressed',el===target?'true':'false');});
      byId('kt-intuition-feedback').hidden=false;return;
    }
    if(target.hasAttribute('data-scenario')){state.scenario=target.dataset.scenario;state.reason=null;state.feeling=null;state.next=null;renderReasonOptions();setStep(1);return;}
    if(target.hasAttribute('data-reason')){state.reason=target.dataset.reason;state.feeling=null;state.next=null;setStep(2);return;}
    if(target.hasAttribute('data-feeling')){state.feeling=target.dataset.feeling;state.next=null;setStep(3);return;}
    if(target.hasAttribute('data-next')){state.next=target.dataset.next;result();return;}
    if(target.hasAttribute('data-prev')){var prev=Number(target.dataset.prev);if(prev>=1&&prev<=3)setStep(prev-1);return;}
    if(target.id==='kt-finish'){
      returned.hidden=false;
      var msg='あなたは「'+examples[state.scenario].label+'」にお金を使い、「'+state.feeling+'」と振り返りました。残ったお金だけでは、その意味はわかりません。';
      var memo=byId('kt-memo').value.trim();if(memo)msg+=' あなたのメモ：「'+memo+'」';
      txt('kt-return-message',msg);
      setPhase('front');return;
    }
  });
  if(location.hash==='#try'||location.hash==='#kakeibo'){reset();setPhase('back');}
})();