// FindOrFree long ad (42 s, 1080x1920, light site palette «A · Доверие»)
// node ad1.js en|ru [stills]  -> frames fa_<lang>/%04d.jpg + events_ad_<lang>.json
const fs=require('fs');const {chromium}=require('playwright');
const L={
en:{
 s1a:'Moving abroad?',s1n:'€1,450',s1b:'is what a relocation agency in Spain charges just to find you a rental.',s1src:'movingtospain.com, full rental search · checked 24 Nov 2026',
 s2a:'And you still scroll local sites…',c1:['idealista.com','Español'],c2:['sreality.cz','Čeština'],c3:['olx.pt','Português'],s2b:'…in a language you don’t speak.',
 s3a:'FindOrFree searches for you',s3b:'on local sites, in the local language',q:'2-room flat in Valencia, up to €1,200',langs:['ES Español','EN English','DE Deutsch','RU Русский'],found:'FOUND',
 s4a:'Full apartment search',b1:'Relocation agency, Spain',b1v:'€1,450',b2:'FindOrFree Project',b2v:'from $300',x5:'about 5× cheaper',s4b:'Smaller searches: $19 · $39 · $89',
 s5a:'Not found?',s5b:'Full refund.',s5c:'Your first find is free.',
 s6a:'How to start',st:['Open findorfree.com','Write what you need, any country','Get real options, checked'],cta:'findorfree.com',tag:'Search like a local'},
ru:{
 s1a:'Переезжаете за границу?',s1n:'1&nbsp;450&nbsp;€',s1b:'берёт агентство по переезду в Испании только за поиск квартиры.',s1src:'movingtospain.com, полный поиск аренды · проверено 24.11.2026',
 s2a:'А вы всё листаете местные сайты…',c1:['idealista.com','Español'],c2:['sreality.cz','Čeština'],c3:['olx.pt','Português'],s2b:'…на языке, которого не знаете.',
 s3a:'FindOrFree ищет за вас',s3b:'на местных сайтах, на местном языке',q:'Двушка в Валенсии до 1&nbsp;200&nbsp;€',langs:['ES Español','EN English','DE Deutsch','RU Русский'],found:'НАЙДЕНО',
 s4a:'Полный поиск квартиры',b1:'Агентство по переезду, Испания',b1v:'1&nbsp;450&nbsp;€',b2:'FindOrFree, Проект',b2v:'от&nbsp;$300',x5:'в 5 раз дешевле',s4b:'Поиски поменьше: $19 · $39 · $89',
 s5a:'Не нашли?',s5b:'Вернём деньги.',s5c:'Первая находка — бесплатно.',
 s6a:'Как начать',st:['Откройте findorfree.com','Напишите, что нужно, любая страна','Получите настоящие варианты'],cta:'findorfree.com',tag:'Ищем как местные'}
};
const SC=[[0,6],[6,12],[12,20.5],[20.5,29],[29,35],[35,42]];const DUR=42;
function html(l){const v=L[l];return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(Montserrat.ttf)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:M,Montserrat,sans-serif;color:#0f1d3a;background:#fff}
body{background:radial-gradient(1200px 900px at 50% 38%,#ffffff 0%,#fbfaf7 60%,#f3f4f6 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(#0f1d3a08 2px,transparent 2px),linear-gradient(90deg,#0f1d3a08 2px,transparent 2px);background-size:60px 60px}
.sc{position:absolute;inset:0;opacity:0;padding:0 80px}
.a{position:absolute;left:80px;right:80px;opacity:0}
.c{text-align:center}
.o{color:#f97316}.g{color:#0b7a55}.m{color:#55627d}
.h1{font-size:76px;font-weight:900;line-height:1.12}
.h2{font-size:58px;font-weight:800;line-height:1.2}
.big{font-size:230px;font-weight:900;letter-spacing:-6px;color:#f97316}
.p{font-size:50px;font-weight:700;line-height:1.3}
.s{font-size:30px;font-weight:700;color:#55627d}
.card{position:absolute;left:150px;width:780px;height:360px;background:#fff;border:4px solid #e5e7eb;border-radius:34px;box-shadow:0 24px 70px rgba(15,29,58,.14);overflow:hidden;opacity:0}
.card .bar{height:84px;background:#0f1d3a;color:#fff;font-size:34px;font-weight:800;display:flex;align-items:center;justify-content:space-between;padding:0 30px}
.card .bar b{background:#f97316;border-radius:14px;padding:4px 16px;font-size:28px}
.ln{height:30px;border-radius:15px;background:#e5e7eb;margin:28px 30px 0}
.box{left:80px;right:80px;height:190px;border:6px solid #f97316;border-radius:40px;background:#fff;box-shadow:0 0 0 14px #f9731622;padding:34px 40px}
.box small{font-size:28px;font-weight:800;letter-spacing:4px;color:#c76a00}
.box div{font-size:40px;font-weight:800;margin-top:14px;white-space:nowrap}
.car{display:inline-block;width:5px;height:50px;background:#f97316;vertical-align:-8px;margin-left:4px}
.chip{position:absolute;width:430px;height:110px;border-radius:26px;background:#fff;border:4px solid #e5e7eb;font-size:40px;font-weight:800;display:flex;align-items:center;padding:0 28px;gap:18px;opacity:0;box-shadow:0 14px 40px rgba(15,29,58,.10)}
.chip i{font-style:normal;width:54px;height:54px;border-radius:50%;background:#0b7a55;color:#fff;font-size:34px;display:flex;align-items:center;justify-content:center}
.pill{display:inline-block;background:#0b7a55;color:#fff;border-radius:30px;padding:16px 60px;font-size:84px;font-weight:900;box-shadow:0 20px 50px #0b7a5555}
.brow{left:80px;right:80px}
.brow .lab{font-size:40px;font-weight:800;margin-bottom:16px;display:flex;justify-content:space-between}
.track{height:84px;border-radius:24px;background:#f3f4f6;overflow:hidden}
.fill{height:100%;width:0;border-radius:24px}
.badge{display:inline-block;background:#f97316;color:#fff;border-radius:34px;padding:22px 54px;font-size:70px;font-weight:900;box-shadow:0 16px 44px #f9731655;transform:rotate(-3deg)}
.step{left:80px;right:80px;display:flex;align-items:center;gap:34px;font-size:50px;font-weight:800}
.step b{flex:none;width:110px;height:110px;border-radius:50%;background:#0f1d3a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:56px}
.cta{display:inline-block;background:#f97316;color:#fff;border-radius:36px;padding:26px 70px;font-size:84px;font-weight:900;box-shadow:0 16px 44px #f9731655}
.logo{font-size:64px;font-weight:900}.logo span{color:#f97316}
#pb{position:absolute;left:0;bottom:0;height:12px;background:#f97316;width:0}
</style></head><body><div class="grid"></div>
<div class="sc" id="s0">
 <div class="a c h1" data-in="0.1" style="top:330px">${v.s1a}</div>
 <div class="a c big" data-in="0.7" data-count="1450" style="top:560px">${v.s1n}</div>
 <div class="a c p" data-in="1.8" style="top:900px">${v.s1b}</div>
 <div class="a c s" data-in="2.6" style="top:1320px">${v.s1src}</div>
</div>
<div class="sc" id="s1">
 <div class="a c h2" data-in="0.1" style="top:250px">${v.s2a}</div>
 <div class="card" data-in="0.7" style="top:520px;transform:rotate(-4deg)"><div class="bar">${v.c1[0]}<b>${v.c1[1]}</b></div><div class="ln" style="width:80%"></div><div class="ln" style="width:60%"></div><div class="ln" style="width:70%"></div></div>
 <div class="card" data-in="1.3" style="top:760px;transform:rotate(3deg)"><div class="bar">${v.c2[0]}<b>${v.c2[1]}</b></div><div class="ln" style="width:75%"></div><div class="ln" style="width:55%"></div><div class="ln" style="width:65%"></div></div>
 <div class="card" data-in="1.9" style="top:1000px;transform:rotate(-2deg)"><div class="bar">${v.c3[0]}<b>${v.c3[1]}</b></div><div class="ln" style="width:70%"></div><div class="ln" style="width:85%"></div><div class="ln" style="width:50%"></div></div>
 <div class="a c h2" data-in="2.8" style="top:1500px">${v.s2b}</div>
</div>
<div class="sc" id="s2">
 <div class="a c logo" data-in="0.1" style="top:200px">Find<span>Or</span>Free</div>
 <div class="a c h2" data-in="0.5" style="top:320px">${v.s3a}</div>
 <div class="a c p m" data-in="0.9" style="top:410px">${v.s3b}</div>
 <div class="a box" data-in="1.3" style="top:620px"><small>FIND ME</small><div id="typ"></div></div>
 <div class="chip" data-in="3.6" style="left:80px;top:900px"><i>✓</i>${v.langs[0]}</div>
 <div class="chip" data-in="3.9" style="left:570px;top:900px"><i>✓</i>${v.langs[1]}</div>
 <div class="chip" data-in="4.2" style="left:80px;top:1050px"><i>✓</i>${v.langs[2]}</div>
 <div class="chip" data-in="4.5" style="left:570px;top:1050px"><i>✓</i>${v.langs[3]}</div>
 <div class="a c" data-in="5.4" data-pop="1" style="top:1280px"><span class="pill">✓ ${v.found}</span></div>
</div>
<div class="sc" id="s3">
 <div class="a c h1" data-in="0.1" style="top:300px">${v.s4a}</div>
 <div class="a brow" data-in="0.7" style="top:560px"><div class="lab"><span>${v.b1}</span><span>${v.b1v}</span></div><div class="track"><div class="fill" data-bar="100" data-bin="1.0" style="background:#9aa3b5"></div></div></div>
 <div class="a brow" data-in="1.8" style="top:820px"><div class="lab"><span>${v.b2}</span><span class="o">${v.b2v}</span></div><div class="track"><div class="fill" data-bar="19" data-bin="2.1" style="background:#f97316"></div></div></div>
 <div class="a c" data-in="3.4" data-pop="1" style="top:1110px"><span class="badge">${v.x5}</span></div>
 <div class="a c p m" data-in="4.6" style="top:1400px">${v.s4b}</div>
</div>
<div class="sc" id="s4">
 <div class="a c h1" data-in="0.1" style="top:520px;font-size:110px">${v.s5a}</div>
 <div class="a c h1 o" data-in="0.8" data-pop="1" style="top:680px;font-size:130px">${v.s5b}</div>
 <div class="a c h2 g" data-in="2.0" style="top:1000px">${v.s5c}</div>
</div>
<div class="sc" id="s5">
 <div class="a c h1" data-in="0.1" style="top:260px">${v.s6a}</div>
 <div class="a step" data-in="0.7" style="top:470px"><b>1</b><span>${v.st[0]}</span></div>
 <div class="a step" data-in="1.4" style="top:650px"><b>2</b><span>${v.st[1]}</span></div>
 <div class="a step" data-in="2.1" style="top:830px"><b>3</b><span>${v.st[2]}</span></div>
 <div class="a c" data-in="3.2" data-pop="1" style="top:1130px"><span class="cta">${v.cta}</span></div>
 <div class="a c p m" data-in="3.8" style="top:1330px">${v.tag}</div>
 <div class="a c logo" data-in="4.2" style="top:1560px">Find<span>Or</span>Free</div>
</div>
<div id="pb"></div>
<script>
const SC=${JSON.stringify(SC)},DUR=${DUR},Q=${JSON.stringify(v.q)};
const cl=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-x,3);
const back=x=>{const c=1.7;x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const tmp=document.createElement('div');tmp.innerHTML=Q;const QT=tmp.textContent;
window.setT=function(t){
 SC.forEach(([a,b],i)=>{const s=document.getElementById('s'+i);const last=i===SC.length-1;
  const op=Math.min(cl((t-a)/0.35),last?1:cl((b-t)/0.35));s.style.opacity=op;s.style.display=op>0?'block':'none';
  if(op<=0)return;const lt=t-a;
  s.querySelectorAll('[data-in]').forEach(e=>{const p=cl((lt-parseFloat(e.dataset.in))/0.5);
   const base=e.classList.contains('card')?e.style.transform.replace(/translateY\\([^)]*\\)|scale\\([^)]*\\)/g,''):'';
   if(e.dataset.pop){e.style.opacity=cl(p*2);e.style.transform='scale('+(0.6+0.4*back(p))+')';}
   else{e.style.opacity=p;e.style.transform=base+' translateY('+((1-ease(p))*50)+'px)';}
   if(e.dataset.count){const n=Math.round(1450*ease(cl((lt-parseFloat(e.dataset.in))/1.2)));if(!e.dataset.tpl)e.dataset.tpl=e.innerHTML;
    e.innerHTML=e.dataset.tpl.replace(/1(,|&nbsp;|\\u00a0)?450/,m=>{const s=String(n);const sep=m.length>4?m.slice(1,m.length-3):'';return n>=1000?s.slice(0,-3)+sep+s.slice(-3):s;});}
  });
  s.querySelectorAll('[data-bar]').forEach(e=>{const p=ease(cl((lt-parseFloat(e.dataset.bin))/1.0));e.style.width=(parseFloat(e.dataset.bar)*p)+'%';});
  if(i===2){const tp=cl((lt-1.7)/1.7);const n=Math.round(QT.length*tp);document.getElementById('typ').innerHTML=QT.slice(0,n).replace(/ /g,' ')+'<span class="car" style="opacity:'+((Math.floor(lt*2.5)%2||tp<1)?1:0)+'"></span>';}
 });
 document.getElementById('pb').style.width=(100*t/DUR)+'%';
};window.setT(0);
</script></body></html>`;}
function events(l){const v=L[l];const tmp=v.q.replace(/&nbsp;/g,' ');const ev=[];
 SC.forEach(([a],i)=>ev.push({t:a,k:'whoosh'}));
 ev.push({t:0.7,k:'pop'},{t:6.7,k:'tick'},{t:7.3,k:'tick'},{t:7.9,k:'tick'});
 for(let j=0;j<tmp.length;j++)ev.push({t:12+1.7+1.7*j/tmp.length,k:'key'});
 [3.6,3.9,4.2,4.5].forEach(d=>ev.push({t:12+d,k:'tick'}));ev.push({t:17.4,k:'found'});
 ev.push({t:21.5,k:'rise'},{t:22.6,k:'tick'},{t:23.9,k:'pop'},{t:29.8,k:'found'});
 [0.7,1.4,2.1].forEach(d=>ev.push({t:35+d,k:'tick'}));ev.push({t:38.2,k:'pop'});
 return {dur:DUR,ev};}
(async()=>{const l=process.argv[2]||'en',stills=process.argv[3]==='stills';
 fs.writeFileSync('ad_'+l+'.html',html(l));fs.writeFileSync('events_ad_'+l+'.json',JSON.stringify(events(l)));
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
 await pg.goto('file://'+process.cwd()+'/ad_'+l+'.html');await pg.waitForTimeout(400);
 const dir='fa_'+l;fs.mkdirSync(dir,{recursive:true});
 const fr=stills?[60,170,330,420,560,610,720,800,960,1130,1200,1259]:[...Array(DUR*30).keys()];
 for(const i of fr){await pg.evaluate(t=>window.setT(t),i/30);await pg.screenshot({path:dir+'/'+String(i).padStart(4,'0')+'.jpg',type:'jpeg',quality:90});}
 await b.close();})();
