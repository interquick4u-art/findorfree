// FindOrFree ad v3 "slingshot" (40 s, 1080x1920, voice + subtitles). node ad3.js ru [stills]
// needs: Montserrat.ttf, yuri.jpg, vespa.png, site_ru/00.png + 02..19.png (cap.js), voice v1..v7.wav (placed by ad3_mix.py)
const fs=require('fs');const {chromium}=require('playwright');
const DUR=40;
const V=[0.0,5.9,11.3,16.4,23.3,29.0,33.3]; // voice line starts
const SC=[[0,5.9],[5.9,11.3],[11.3,16.4],[16.4,23.3],[23.3,29.0],[29.0,33.3],[33.3,40]];
const BG=['#f97316','#0f1d3a','#eef2f8','#ffffff','#ffffff','#0b7a55','#ffffff'];
// subtitles: [word, local start] per voice line, last item = end
const SUB={ru:[
 [['1&nbsp;450&nbsp;€',.25],['агентству?',2.44],['Только',3.12],['за',3.92],['поиск',4.18],['квартиры?',4.64],5.3],
 [['Стоп.',.25],['Мы',.86],['ищем',1.04],['за',1.52],['вас —',1.72],['на',2.58],['местных',2.68],['сайтах,',3.08],['на',4.02],['местном',4.12],['языке.',4.54],5.05],
 [['Всё',0],['просто:',.38],['откройте',1.24],['findorfree.com',1.76],['и',3.02],['напишите,',3.64],['что',4.12],['нужно.',4.34],4.65],
 [['Вот',.06],['наш',.22],['поиск:',.48],['Vespa',1.38],['в',1.78],['Лиссабоне',1.92],['за',2.46],['3&nbsp;600&nbsp;€',2.94],['вместо',4.38],['5&nbsp;390&nbsp;€.',4.68],6.3],
 [['Полный',0],['поиск',.5],['квартиры —',.92],['от',1.56],['$300.',2.12],['В',3.12],['5&nbsp;раз',3.76],['дешевле',4.24],['агентства.',4.74],5.35],
 [['Первый',.48],['вариант —',.74],['бесплатно.',1.6],['Не',2.46],['нашли —',2.64],['вернём',3.22],['деньги.',3.46],3.9],
 [['Какую',0],['квартиру',.8],['вам',1.42],['найти?',1.62],['Напишите',2.66],['город',3.2],['и',3.56],['бюджет',4.12],['в',4.64],['комментариях.',5.08],5.8]]};
function chunks(l){const out=[];SUB[l].forEach((line,li)=>{const end=line[line.length-1];const w=line.slice(0,-1);let cur=[];
 const flush=()=>{if(cur.length){out.push(cur);cur=[]}};
 w.forEach((x,i)=>{cur.push({w:x[0],t:V[li]+x[1],e:V[li]+(i+1<w.length?w[i+1][1]:end)});if(cur.length>=4||/[.?:,—]$/.test(x[0].replace(/&nbsp;/g,'')))flush();});flush();
 });out.forEach((c,i)=>{c.a=c[0].t;c.b=(i+1<out.length&&out[i+1][0].t-c[c.length-1].e<0.6)?out[i+1][0].t:c[c.length-1].e+0.25});return out;}
const L={ru:{
 s0a:'ХВАТИТ<br>переплачивать!',s0n:'1&nbsp;450&nbsp;€',s0b:'агентству за поиск квартиры',s0src:'агентство по переезду в Испании · movingtospain.com · 24.11.2026',s0c:'Мы делаем дешевле',
 cap1:'Юрий',cap2:'основатель FindOrFree',ch:['🇪🇸 Español','🇵🇹 Português','🇨🇿 Čeština','🇩🇪 Deutsch','🇮🇹 Italiano','🇮🇱 עברית'],hum:'✓ каждый результат проверяет человек',
 s2a:'Это настоящий сайт',
 s3tag:'НАШ ПОИСК · НОЯБРЬ 2026',s3t:'Vespa Primavera · Лиссабон',s3new:'Новая: 5&nbsp;390&nbsp;€',s3f:'НАШЛИ',s3sub:'2023 · 11&nbsp;087&nbsp;км · частный продавец',s3src:'standvirtual.com · 24.11.2026 · фото: иллюстрация',
 s4a:'Полный поиск квартиры',b1:'Агентство',b1v:'1&nbsp;450&nbsp;€',b2:'FindOrFree',x5:'В 5 РАЗ ДЕШЕВЛЕ',s4b:'Поиски поменьше: $19 · $39 · $89',
 s5a:'Первый вариант',s5b:'БЕСПЛАТНО',s5c:'Понравился? Только тогда платите.',s5d:'Не нашли?',s5e:'Вернём деньги.',
 s6q:'Какую квартиру<br>вам найти? 👇',s6c:'Город и бюджет — в комментарии',url:'findorfree.com'}};
function html(l){const v=L[l];const site=['00',...Array.from({length:18},(_,i)=>String(i+2).padStart(2,'0'))];
return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(Montserrat.ttf)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:M,Montserrat,'Noto Color Emoji',sans-serif;color:#0f1d3a;background:#fff}
.sc{position:absolute;inset:0;overflow:hidden;display:none}
.dots{position:absolute;inset:-200px;background-image:radial-gradient(#ffffff22 4px,transparent 5px);background-size:70px 70px}
.dk .dots{background-image:radial-gradient(#0f1d3a12 4px,transparent 5px)}
.a{position:absolute;left:60px;right:60px;opacity:0;text-align:center}
.w{color:#fff}.o{color:#f97316}.n{color:#0f1d3a}.g{color:#0b7a55}
.h1{font-size:96px;font-weight:900;line-height:1.05}
.h2{font-size:62px;font-weight:800;line-height:1.2}
.p{font-size:48px;font-weight:700;line-height:1.3}
.s{font-size:28px;font-weight:700}
.huge{font-size:240px;font-weight:900;letter-spacing:-6px;line-height:1;white-space:nowrap}
.strike{position:absolute;left:-4%;top:50%;height:28px;background:#0f1d3a;border-radius:14px;width:0;transform:rotate(-8deg)}
.pill{display:inline-block;border-radius:40px;padding:20px 50px;font-weight:900;white-space:nowrap}
.photo{position:absolute;left:250px;top:170px;width:580px;height:725px;border-radius:44px;overflow:hidden;border:10px solid #fff;box-shadow:0 30px 80px #0008;opacity:0;background:url(yuri.jpg) center/cover}
.capt{position:absolute;left:150px;right:150px;top:840px;background:#f97316;color:#fff;border-radius:30px;padding:18px 20px;text-align:center;opacity:0;box-shadow:0 16px 40px #0006}
.capt b{display:block;font-size:64px;font-weight:900;line-height:1.05}.capt span{font-size:38px;font-weight:800}
.chip{position:absolute;width:300px;height:104px;border-radius:28px;background:#fff;color:#0f1d3a;font-size:38px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 14px 34px #0006;white-space:nowrap}
.phone{position:absolute;left:190px;top:250px;width:700px;height:1400px;border-radius:70px;background:#0f1d3a;padding:22px;box-shadow:0 40px 90px #0f1d3a55;opacity:0}
.scr{position:relative;width:100%;height:100%;border-radius:50px;overflow:hidden;background:#fff}
.scr img{position:absolute;left:0;top:0;width:100%;display:none}
.tap{position:absolute;width:150px;height:150px;border-radius:50%;border:12px solid #f97316;opacity:0;left:240px;top:1280px}
.card{position:absolute;left:90px;right:90px;top:330px;background:#fff;border-radius:44px;box-shadow:0 30px 80px #0f1d3a33;overflow:hidden;opacity:0}
.card .im{height:640px;background:url(vespa.png) center/cover}
.card .bd{padding:30px 40px 36px;text-align:left}
.found{position:absolute;right:40px;top:40px;background:#0b7a55;color:#fff;font-size:56px;font-weight:900;border-radius:24px;padding:10px 30px;transform:rotate(4deg);opacity:0}
.brow{text-align:left}.lab{font-size:50px;font-weight:900;display:flex;justify-content:space-between;margin-bottom:16px}
.track{height:110px;border-radius:30px;background:#eef0f4;overflow:hidden}.fill{height:100%;width:0;border-radius:30px}
.badge{display:inline-block;background:#0b7a55;color:#fff;border-radius:40px;padding:26px 54px;font-size:86px;font-weight:900;box-shadow:0 20px 50px #0b7a5566;transform:rotate(-3deg);white-space:nowrap}
.free{display:inline-block;background:#fff;color:#0b7a55;border-radius:40px;padding:14px 50px;font-size:118px;font-weight:900;box-shadow:0 20px 60px #0005;white-space:nowrap;border:10px dashed #0b7a55}
.bar{display:flex;align-items:center;gap:24px;background:#fff;border:6px solid #0f1d3a;border-radius:60px;padding:26px 40px;font-size:64px;font-weight:800;text-align:left;box-shadow:0 20px 50px #0f1d3a22}
.bar i{font-style:normal;font-size:64px}
.cur{display:inline-block;width:6px;height:70px;background:#f97316;vertical-align:middle;margin-left:4px}
.logo{font-size:64px;font-weight:900}.logo span{color:#f97316}
#sub{position:absolute;left:60px;right:60px;top:1560px;text-align:center;z-index:20}
#sub div{display:inline-block;background:#0f1d3aE6;color:#fff;font-size:60px;font-weight:900;line-height:1.2;border-radius:28px;padding:16px 30px;max-width:960px}
#sub span{opacity:.55}#sub span.on{opacity:1;color:#ffb347}#sub span.done{opacity:1}
#like{position:absolute;left:70px;top:1380px;width:150px;height:150px;border-radius:50%;background:#f43f5e;color:#fff;font-size:86px;display:flex;align-items:center;justify-content:center;opacity:0;z-index:21;box-shadow:0 14px 40px #f43f5e88}
#pb{position:absolute;left:0;bottom:0;height:14px;background:#f97316;width:0;z-index:30}
</style></head><body>
<div class="sc" id="s0" style="background:${BG[0]}"><div class="dots"></div>
 <div class="a h1 w" data-in="0" data-pop="1" style="top:170px">${v.s0a}</div>
 <div class="a" data-in="0.35" data-pop="1" style="top:470px"><span class="huge w" style="position:relative;display:inline-block">${v.s0n}<i class="strike" data-strike="2.1"></i></span></div>
 <div class="a h2 w" data-in="1.0" style="top:760px">${v.s0b}</div>
 <div class="a" data-in="3.9" data-pop="1" style="top:1000px"><span class="pill" style="background:#0f1d3a;color:#fff;font-size:80px">${v.s0c}</span></div>
 <div class="a s w" data-in="1.4" style="top:1820px;opacity:.85">${v.s0src}</div>
</div>
<div class="sc" id="s1" style="background:${BG[1]}"><div class="dots"></div>
 <div class="photo" data-in="0.05" data-pop="1"></div>
 <div class="capt" data-in="0.5" data-pop="1"><b>${v.cap1}</b><span>${v.cap2}</span></div>
 ${v.ch.map((c,i)=>`<div class="chip" data-in="${2.6+i*0.28}" data-pop="1" style="left:${60+(i%3)*330}px;top:${1110+Math.floor(i/3)*130}px">${c}</div>`).join('')}
 <div class="a o" data-in="4.0" style="top:1390px;font-size:40px;font-weight:900">${v.hum}</div>
</div>
<div class="sc dk" id="s2" style="background:${BG[2]}"><div class="dots"></div>
 <div class="a h2 n" data-in="0.1" style="top:120px;font-weight:900">${v.s2a} 👇</div>
 <div class="phone" data-in="0.15" data-pop="1"><div class="scr">${site.map(s=>`<img src="site_${l}/${s}.png" data-site>`).join('')}<div class="tap"></div></div></div>
</div>
<div class="sc dk" id="s3" style="background:${BG[3]}"><div class="dots"></div>
 <div class="a" data-in="0.05" data-pop="1" style="top:170px"><span class="pill" style="background:#f97316;color:#fff;font-size:46px">${v.s3tag}</span></div>
 <div class="card" data-in="0.3" data-pop="1"><div class="im"></div><div class="found" data-in="3.0" data-pop="1">✓ ${v.s3f}</div>
  <div class="bd"><div style="font-size:52px;font-weight:900">${v.s3t}</div>
  <div style="font-size:46px;font-weight:800;color:#8792a8;margin-top:14px;position:relative;display:inline-block">${v.s3new}<i class="strike" data-strike="4.6" style="height:10px;background:#e11d48"></i></div>
  <div style="font-size:130px;font-weight:900;color:#0b7a55;line-height:1.05" id="vp">3&nbsp;600&nbsp;€</div>
  <div style="font-size:36px;font-weight:700;color:#55627d">${v.s3sub}</div></div></div>
 <div class="a s" data-in="1.0" style="top:1500px;color:#8792a8">${v.s3src}</div>
</div>
<div class="sc dk" id="s4" style="background:${BG[4]}"><div class="dots"></div>
 <div class="a h1 n" data-in="0.05" style="top:200px;font-size:84px">${v.s4a}</div>
 <div class="a brow" data-in="0.4" style="top:440px"><div class="lab"><span>${v.b1}</span><span>${v.b1v}</span></div><div class="track"><div class="fill" data-bar="100" data-bin="0.6" style="background:#9aa3b5"></div></div></div>
 <div class="a brow" data-in="1.4" style="top:720px"><div class="lab"><span>${v.b2}</span><span class="o">от <span id="cnt">$1&nbsp;680</span></span></div><div class="track"><div class="fill" data-bar="18" data-bin="1.7" style="background:#f97316"></div></div></div>
 <div class="a" data-in="3.6" data-pop="1" style="top:1010px"><span class="badge">${v.x5}</span></div>
 <div class="a p" data-in="4.3" style="top:1260px;color:#55627d;font-size:42px">${v.s4b}</div>
</div>
<div class="sc" id="s5" style="background:${BG[5]}"><div class="dots"></div>
 <div class="a" data-in="0.05" data-pop="1" style="top:150px;font-size:190px;line-height:1">🎁</div>
 <div class="a h1 w" data-in="0.3" style="top:390px">${v.s5a}</div>
 <div class="a" data-in="1.5" data-stamp="1" style="top:540px"><span class="free">${v.s5b}</span></div>
 <div class="a p w" data-in="2.0" style="top:790px">${v.s5c}</div>
 <div class="a h1 w" data-in="2.45" style="top:1050px;font-size:84px">${v.s5d}</div>
 <div class="a" data-in="3.1" data-pop="1" style="top:1170px"><span class="pill" style="background:#fff;color:#0b7a55;font-size:84px">${v.s5e}</span></div>
</div>
<div class="sc dk" id="s6" style="background:${BG[6]}"><div class="dots"></div>
 <div class="a logo n" data-in="0.05" style="top:230px">Find<span>Or</span>Free</div>
 <div class="a" data-in="0.15" data-pop="1" style="top:400px"><div class="bar"><i>🔍</i><span id="typed"></span><span class="cur"></span></div></div>
 <div class="a h1 n" data-in="1.6" data-pop="1" style="top:690px;font-size:92px">${v.s6q}</div>
 <div class="a p o" data-in="2.7" style="top:960px;font-weight:900">${v.s6c}</div>
 <div class="a s" data-in="3.2" style="top:1120px;color:#55627d;font-size:36px">первый вариант бесплатно · не нашли — вернём деньги</div>
</div>
<div id="like">♥</div>
<div id="sub"></div>
<div id="pb"></div>
<script>
const SC=${JSON.stringify(SC)},DUR=${DUR},CH=${JSON.stringify(chunks(l))},URL='${v.url}';
const cl=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-x,3);
const back=x=>{const c=1.7;x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const imgs=[...document.querySelectorAll('[data-site]')];
window.setT=function(t){
 SC.forEach(([a,b],i)=>{const s=document.getElementById('s'+i);const last=i===SC.length-1;
  const vis=t>=a-0.001&&(last||t<b+0.35);s.style.display=vis?'block':'none';if(!vis)return;
  const pin=cl((t-a)/0.35);s.style.transform='translateX('+((1-ease(pin))*100)+'%)';s.style.zIndex=i;const lt=t-a;
  const d=s.querySelector('.dots');if(d)d.style.transform='translateY('+(-(lt*30)%70)+'px)';
  s.querySelectorAll('[data-in]').forEach(e=>{const p=cl((lt-parseFloat(e.dataset.in))/0.45);
   if(e.dataset.stamp){const q=cl((lt-parseFloat(e.dataset.in))/0.25);e.style.opacity=q>0?1:0;e.style.transform='scale('+(2.4-1.4*ease(q))+') rotate('+(-8*ease(q))+'deg)';}
   else if(e.dataset.pop){e.style.opacity=cl(p*2);e.style.transform='scale('+(0.5+0.5*back(p))+')';}
   else{e.style.opacity=p;e.style.transform='translateY('+((1-ease(p))*60)+'px)';}});
  s.querySelectorAll('[data-strike]').forEach(e=>{e.style.width=(108*ease(cl((lt-parseFloat(e.dataset.strike))/0.4)))+'%';});
  s.querySelectorAll('[data-bar]').forEach(e=>{e.style.width=(parseFloat(e.dataset.bar)*ease(cl((lt-parseFloat(e.dataset.bin))/0.9)))+'%';});
  if(i===0){const big=s.querySelector('.huge');big.style.transform=lt<2.1?'scale('+(1+0.05*Math.sin(lt*14))+')':'scale(0.92)';}
  if(i===1){const ph=s.querySelector('.photo');ph.style.backgroundSize=(100+lt*2)+'% auto';}
  if(i===2){let k=lt<1.6?0:Math.min(imgs.length-1,1+Math.floor((lt-1.6)/0.17));imgs.forEach((im,j)=>im.style.display=j===k?'block':'none');
   const tp=s.querySelector('.tap');const q=cl((lt-0.9)/0.5);tp.style.opacity=lt>0.9&&lt<1.6?(1-q)*1:0;tp.style.transform='scale('+(0.6+q*0.8)+')';}
  if(i===3){const q=ease(cl((lt-2.9)/1.0));document.getElementById('vp').innerHTML=Math.round(5390-(5390-3600)*q).toLocaleString('ru-RU').replace(/\\s/g,'&nbsp;')+'&nbsp;€';}
  if(i===4){const q=ease(cl((lt-1.7)/1.2));document.getElementById('cnt').innerHTML='$'+Math.round(1680-(1680-300)*q).toLocaleString('ru-RU').replace(/\\s/g,'&nbsp;');}
  if(i===6){const n=Math.max(0,Math.min(URL.length,Math.floor((lt-0.5)/0.09)));document.getElementById('typed').textContent=URL.slice(0,n);
   s.querySelector('.cur').style.opacity=(Math.floor(lt*2.5)%2)?1:0.15;}
 });
 // subtitles
 const c=CH.find(c=>t>=c.a&&t<c.b);const sb=document.getElementById('sub');
 sb.innerHTML=c?'<div>'+c.map(w=>'<span class="'+(t>=w.t&&t<w.e?'on':(t>=w.e?'done':''))+'">'+w.w+'</span>').join(' ')+'</div>':'';
 // like at 2/3
 const lk=document.getElementById('like');const lq=(t-25.9)/2;lk.style.opacity=lq>0&&lq<1?Math.min(1,lq*6,(1-lq)*6):0;
 lk.style.transform='translateY('+(-lq*120)+'px) scale('+(lq>0?0.6+0.4*back(cl(lq*3)):0)+')';
 document.getElementById('pb').style.width=(100*t/DUR)+'%';
};window.setT(0);
</script></body></html>`;}
function events(){const ev=[];SC.forEach(([a],i)=>{if(i)ev.push({t:a,k:'whoosh'})});
 ev.push({t:0.0,k:'pop'},{t:0.35,k:'pop'},{t:2.1,k:'rise'},{t:4.3,k:'pop'});
 ev.push({t:5.95,k:'pop'},{t:6.4,k:'tick'});for(let i=0;i<6;i++)ev.push({t:5.9+2.6+i*0.28,k:'tick'});
 ev.push({t:11.3+0.9,k:'tick'});for(let i=0;i<18;i++)ev.push({t:11.3+1.6+i*0.17,k:'key'});
 ev.push({t:16.45,k:'pop'},{t:16.4+2.9,k:'rise'},{t:16.4+3.0,k:'found'},{t:16.4+4.6,k:'tick'});
 ev.push({t:23.3+0.6,k:'tick'},{t:23.3+1.7,k:'rise'},{t:23.3+3.6,k:'found'},{t:23.3+3.65,k:'pop'},{t:26.0,k:'pop'});
 ev.push({t:29.05,k:'pop'},{t:29.0+1.5,k:'pop'},{t:29.0+1.55,k:'found'},{t:29.0+3.1,k:'pop'});
 for(let i=0;i<14;i++)ev.push({t:33.3+0.5+i*0.09,k:'key'});ev.push({t:33.3+1.6,k:'pop'},{t:33.3+2.7,k:'tick'});
 return {dur:DUR,ev,voice:V};}
(async()=>{const l=process.argv[2]||'ru',mode=process.argv[3]||'';
 fs.writeFileSync('ad3_'+l+'.html',html(l));fs.writeFileSync('events_ad3_'+l+'.json',JSON.stringify(events()));
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
 await pg.goto('file://'+process.cwd()+'/ad3_'+l+'.html');await pg.waitForTimeout(800);
 const dir='f3_'+l;fs.mkdirSync(dir,{recursive:true});
 let fr=[...Array(DUR*30).keys()];
 if(mode==='stills')fr=[12,90,150,220,280,380,420,520,590,640,760,800,880,960,990,1120,1200];
 else if(mode.startsWith('part')){const [k,n]=mode.slice(4).split('/').map(Number);fr=fr.filter(i=>i%n===k);}
 for(const i of fr){await pg.evaluate(t=>window.setT(t),i/30);await pg.screenshot({path:dir+'/'+String(i).padStart(4,'0')+'.jpg',type:'jpeg',quality:88});}
 await b.close();})();
