(function(){
 "use strict";
 const records=(Array.isArray(window.KOTONEYA_NEWS)?window.KOTONEYA_NEWS:[]).filter(x=>x.published===true).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;}
 function entry(n,compact){
  const article=element(compact?'a':'article',compact?'news-item':'news-article');
  if(compact)article.href='news/index.html#'+encodeURIComponent(n.id);
  else article.id=n.id;
  const meta=element('div','news-meta');const date=element('time','',String(n.date).replaceAll('-','.'));date.dateTime=n.date;meta.append(date);meta.append(element('span','news-tag',n.category));article.append(meta);
  article.append(element(compact?'h3':'h2','',n.title));
  article.append(element('p','',n.summary));
  if(!compact&&Array.isArray(n.body)&&n.body.length){const d=element('details');const s=element('summary','', '続きを読む');d.append(s);const body=element('div','article-body');n.body.forEach(p=>body.append(element('p','',p)));d.append(body);article.append(d);}
  if(!compact&&Array.isArray(n.links)){
    const links=n.links.filter(link=>link&&typeof link.label==='string'&&typeof link.url==='string'&&/^https:\/\//i.test(link.url));
    if(links.length){const wrap=element('div','news-links');for(const link of links){
       const a=element('a','news-related-link',link.label+' ↗');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';wrap.append(a);
    }article.append(wrap);}
  }return article;
 }
 const latest=document.getElementById('news-latest');if(latest){latest.replaceChildren();if(!records.length)latest.append(element('p','', 'お知らせは準備中です。'));else records.slice(0,2).forEach(n=>latest.append(entry(n,true)));}
 const all=document.getElementById('news-all');if(all){all.replaceChildren();if(!records.length)all.append(element('p','', '現在、掲載中のお知らせはありません。'));else records.forEach(n=>all.append(entry(n,false)));if(location.hash){const id=decodeURIComponent(location.hash.slice(1));const node=document.getElementById(id);if(node){const d=node.querySelector('details');if(d)d.open=true;requestAnimationFrame(()=>node.scrollIntoView({block:'start'}));}}}
})();
