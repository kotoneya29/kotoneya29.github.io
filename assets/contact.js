(function(){
 "use strict";const cfg=window.KOTONEYA_SITE_CONFIG||{};
 const url=String(cfg.googleFormUrl||'').trim(), embed=String(cfg.googleFormEmbedUrl||'').trim();
 const formOK=/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(url);
 const embedOK=/^https:\/\/docs\.google\.com\/forms\//.test(embed);
 if(!formOK&&!embedOK)return;
 const pending=document.getElementById('form-pending'), active=document.getElementById('form-active');
 pending.hidden=true;active.hidden=false;
 if(embedOK){const frame=document.createElement('iframe');frame.src=embed;frame.title='ことねやお問い合わせフォーム';frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';document.getElementById('form-embed').append(frame);}
 if(formOK){document.getElementById('form-link-box').hidden=false;document.getElementById('form-link').href=url;}
})();
