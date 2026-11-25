// FindOrFree ad v4 (approved 7-frame storyboard, 36 s, light theme). node ad4.js ru [stills|partK/N]
// needs: Montserrat.ttf, yuri.jpg, flat.jpg (bezrealitky 1092980 photo), site_ru/00.png + 02..19.png (cap.js), voice files placed by ad3_mix.py (events json 'voice')
const fs=require('fs');const {chromium}=require('playwright');
const DUR=36;
const SC=[[0,3],[3,7],[7,12],[12,16.4],[16.4,24.2],[24.2,30],[30,36]];
const BG=['#ffffff','#fff4ec','#ffffff','#f3f6fb','#ffffff','#eefaf4','#ffffff'];
// voice placements: [file, start in file, end in file, start on timeline]
const VO=[['v0.wav',0,5.06,0.3],['v0.wav',5.08,9.68,7.0],['v2.wav',0.78,5.08,12.2],['v6.wav',0,4.0,24.3],['v3.wav',0,4.68,30.2]];
const SUB=[
 [['Не',0],['переплачивайте',.12],['маклерам!',.78],['Агентство',1.38],['берёт',1.9],['за',2.18],['поиск',2.3],['квартиры',2.72],['1&nbsp;450&nbsp;€.',3.24],5.0],
 [['Мы',.04],['ищем',.14],['только',.4],['без',.56],['маклеров,',.82],['объявления',1.36],['хозяев.',1.92],['От',2.62],['$300,',2.76],['в',3.56],['5&nbsp;раз',3.74],['дешевле.',4.06],4.55],
 [['Мы',.08],['ищем',.26],['за',.74],['вас —',.94],['на',1.8],['местных',1.9],['сайтах,',2.3],['на',3.24],['местном',3.34],['языке.',3.76],4.25],
 [['Первый',.48],['вариант —',.74],['бесплатно.',1.6],['Не',2.46],['нашли —',2.64],['вернём',3.22],['деньги.',3.46],3.9],
 [['Всё',0],['просто:',.38],['откройте',1.24],['findorfree.com',1.76],['и',3.02],['напишите,',3.64],['что',4.12],['нужно.',4.34],4.65]];
function chunks(){const out=[];SUB.forEach((line,li)=>{const T=VO[li][3];const end=line[line.length-1];const w=line.slice(0,-1);let cur=[];
 const flush=()=>{if(cur.length){out.push(cur);cur=[]}};
 w.forEach((x,i)=>{cur.push({w:x[0],t:T+x[1],e:T+(i+1<w.length?w[i+1][1]:end)});if(cur.length>=4||/[.?:,!—]$/.test(x[0].replace(/&nbsp;/g,'')))flush();});flush();});
 return out.map((c,i)=>({a:c[0].t,b:(i+1<out.length&&out[i+1][0].t-c[c.length-1].e<0.6)?out[i+1][0].t:c[c.length-1].e+0.25,w:c}));}
function html(l){const site=['00',...Array.from({length:18},(_,i)=>String(i+2).padStart(2,'0'))];
return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(Montserrat.ttf)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:M,Montserrat,'Noto Color Emoji',sans-serif;color:#0f1d3a;background:#fff}
.sc{position:absolute;inset:0;overflow:hidden;display:none}
.dots{position:absolute;inset:-200px;background-image:radial-gradient(#0f1d3a0d 4px,transparent 5px);background-size:70px 70px}
.a{position:absolute;left:60px;right:60px;opacity:0;text-align:center}
.o{color:#f97316}.n{color:#0f1d3a}.g{color:#0b7a55}.m{color:#55627d}
.h1{font-size:96px;font-weight:900;line-height:1.05}
.h2{font-size:64px;font-weight:800;line-height:1.18}
.p{font-size:48px;font-weight:700;line-height:1.3}
.s{font-size:28px;font-weight:700;color:#8792a8}
.row{display:flex;align-items:center;justify-content:space-between;background:#fff;border:4px solid #e3e8f0;border-radius:36px;padding:34px 46px;box-shadow:0 18px 44px #0f1d3a14;text-align:left}
.row b{font-size:62px;font-weight:900}.row span{font-size:70px;font-weight:900;white-space:nowrap}
.row.us{border-color:#f97316;background:#fff7f0}
.strike{position:absolute;left:-4%;top:50%;height:14px;background:#e11d48;border-radius:7px;width:0;transform:rotate(-6deg)}
.pill{display:inline-block;border-radius:40px;padding:20px 50px;font-weight:900;white-space:nowrap}
.chk{display:flex;align-items:center;gap:30px;font-size:56px;font-weight:800;text-align:left;justify-content:flex-start}
.chk i{flex:none;width:96px;height:96px;border-radius:50%;background:#0b7a55;color:#fff;font-style:normal;font-size:56px;display:flex;align-items:center;justify-content:center}
.chk.x i{background:#e11d48}
.badge{display:inline-block;background:#f97316;color:#fff;border-radius:40px;padding:26px 54px;font-size:86px;font-weight:900;box-shadow:0 20px 50px #f9731655;transform:rotate(-3deg);white-space:nowrap}
.photo{position:absolute;left:250px;top:200px;width:580px;height:725px;border-radius:44px;overflow:hidden;border:10px solid #fff;box-shadow:0 30px 80px #0f1d3a40;opacity:0;background:url(yuri.jpg) center/cover}
.capt{position:absolute;left:150px;right:150px;top:870px;background:#f97316;color:#fff;border-radius:30px;padding:18px 20px;text-align:center;opacity:0;box-shadow:0 16px 40px #f9731655}
.capt b{display:block;font-size:64px;font-weight:900;line-height:1.05}.capt span{font-size:38px;font-weight:800}
.chip{position:absolute;width:300px;height:100px;border-radius:28px;background:#fff;color:#0f1d3a;font-size:38px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 12px 30px #0f1d3a1f;border:3px solid #e3e8f0;white-space:nowrap}
.card{position:absolute;left:90px;right:90px;top:330px;background:#fff;border-radius:44px;box-shadow:0 30px 80px #0f1d3a2a;overflow:hidden;opacity:0;border:3px solid #e3e8f0}
.card .im{height:640px;background:url(vespa.png) center/cover}
.card .bd{padding:30px 40px 36px;text-align:left}
.found{position:absolute;right:40px;top:40px;background:#0b7a55;color:#fff;font-size:60px;font-weight:900;border-radius:24px;padding:10px 30px;transform:rotate(4deg);opacity:0}
.free{display:inline-block;background:#fff;color:#0b7a55;border-radius:40px;padding:14px 50px;font-size:118px;font-weight:900;box-shadow:0 20px 60px #0b7a5533;white-space:nowrap;border:10px dashed #0b7a55}
.phone{position:absolute;left:300px;top:150px;width:480px;height:960px;border-radius:54px;background:#0f1d3a;padding:16px;box-shadow:0 30px 70px #0f1d3a44;opacity:0}
.scr{position:relative;width:100%;height:100%;border-radius:40px;overflow:hidden;background:#fff}
.scr img{position:absolute;left:0;top:0;width:100%;display:none}
.tap{position:absolute;width:110px;height:110px;border-radius:50%;border:10px solid #f97316;opacity:0;left:150px;top:860px}
.cta{display:inline-block;background:#f97316;color:#fff;border-radius:40px;padding:26px 70px;font-size:84px;font-weight:900;box-shadow:0 18px 50px #f9731666;white-space:nowrap}
#sub{position:absolute;left:60px;right:60px;top:1590px;text-align:center;z-index:20}
#sub div{display:inline-block;background:#0f1d3aE6;color:#fff;font-size:58px;font-weight:900;line-height:1.2;border-radius:28px;padding:16px 30px;max-width:960px}
#sub span{opacity:.55}#sub span.on{opacity:1;color:#ffb347}#sub span.done{opacity:1}
#like{position:absolute;left:70px;top:1400px;width:150px;height:150px;border-radius:50%;background:#f43f5e;color:#fff;font-size:86px;display:flex;align-items:center;justify-content:center;opacity:0;z-index:21;box-shadow:0 14px 40px #f43f5e88}
#pb{position:absolute;left:0;bottom:0;height:14px;background:#f97316;width:0;z-index:30}
.logo{font-size:56px;font-weight:900}.logo span{color:#f97316}
</style></head><body>
<!-- 1. punch -->
<div class="sc" id="s0" style="background:${BG[0]}"><div class="dots"></div>
 <div class="a logo n" data-in="0" style="top:150px">Find<span>Or</span>Free</div>
 <div class="a row" data-in="0" data-pop="1" style="top:320px;border-color:#e11d48;background:#fff1f3"><b>Маклер</b><span style="color:#e11d48;font-size:64px">≈ месяц аренды</span></div>
 <div class="a row us" data-in="0.45" data-pop="1" style="top:560px"><b>Мы</b><span class="o">от&nbsp;$300</span></div>
 <div class="a" data-in="0.9" data-pop="1" style="top:820px"><span class="pill" style="background:#0b7a55;color:#fff;font-size:60px;white-space:normal">🎁 Первый вариант — бесплатно</span></div>
 <div class="a h2 n" data-in="1.4" style="top:1080px;font-weight:900">Не переплачивайте маклерам!</div>
</div>
<!-- 2. why so expensive -->
<div class="sc" id="s1" style="background:${BG[1]}"><div class="dots"></div>
 <div class="a h1 n" data-in="0.05" style="top:200px;font-size:88px">Маклер берёт деньги<br>за то, что вы можете<br><span class="o">найти сами</span></div>
 <div class="a row" data-in="1.2" data-pop="1" style="top:720px"><b style="font-size:50px">Квартира</b><span style="font-size:62px">1&nbsp;500&nbsp;€/мес</span></div>
 <div class="a row" data-in="1.9" data-pop="1" style="top:920px;border-color:#e11d48;background:#fff1f3"><b style="font-size:50px">+ маклеру</b><span style="font-size:62px;color:#e11d48">≈ 1&nbsp;500&nbsp;€</span></div>
 <div class="a s" data-in="2.4" style="top:1140px">часто комиссия = месячная аренда · пример</div>
</div>
<!-- 3. why we are cheaper -->
<div class="sc" id="s2" style="background:${BG[2]}"><div class="dots"></div>
 <div class="a h1 n" data-in="0.05" style="top:190px;font-size:86px">Почему мы дешевле?</div>
 <div class="a chk" data-in="0.5" style="top:420px;left:120px"><i>✓</i><span>Ищем онлайн<br>объявления хозяев</span></div>
 <div class="a chk x" data-in="1.4" style="top:640px;left:120px"><i>✕</i><span>Без маклеров</span></div>
 <div class="a chk x" data-in="2.0" style="top:800px;left:120px"><i>✕</i><span>Без офиса и выездов</span></div>
 <div class="a" data-in="3.4" data-pop="1" style="top:1080px"><span class="badge">В 5 РАЗ ДЕШЕВЛЕ</span></div>
 <div class="a s" data-in="3.8" style="top:1290px">агентство в Испании: 1&nbsp;450&nbsp;€ (movingtospain.com, 24.11.2026) · мы: от $300</div>
</div>
<!-- 4. who we are -->
<div class="sc" id="s3" style="background:${BG[3]}"><div class="dots"></div>
 <div class="photo" data-in="0.05" data-pop="1"></div>
 <div class="capt" data-in="0.45" data-pop="1"><b>Юрий</b><span>основатель FindOrFree</span></div>
 ${['🇪🇸 Español','🇵🇹 Português','🇨🇿 Čeština','🇩🇪 Deutsch','🇮🇹 Italiano','🇮🇱 עברית'].map((c,i)=>`<div class="chip" data-in="${1.8+i*0.25}" data-pop="1" style="left:${60+(i%3)*330}px;top:${1110+Math.floor(i/3)*125}px">${c}</div>`).join('')}
</div>
<!-- 5. proof: real owner listing -->
<div class="sc" id="s4" style="background:${BG[4]}"><div class="dots"></div>
 <div class="a" data-in="0.05" data-pop="1" style="top:120px"><span class="pill" style="background:#f97316;color:#fff;font-size:44px">НАШ ПОИСК · ПРАГА · 24.11.2026</span></div>
 <div class="card" data-in="0.3" data-pop="1" style="top:250px"><div class="im" style="height:560px;background-image:url(flat.jpg)"></div><div class="found" data-in="2.2" data-pop="1">✓ НАЙДЕНО</div>
  <div class="bd"><div style="font-size:50px;font-weight:900">3+kk · 71 м² · Карлин</div>
  <div style="font-size:72px;font-weight:900;color:#0f1d3a;line-height:1.15">34&nbsp;400&nbsp;Kč<span style="font-size:40px;color:#55627d"> /мес (≈&nbsp;1&nbsp;370&nbsp;€)</span></div>
  <div style="display:inline-block;margin-top:10px;background:#eefaf4;color:#0b7a55;font-size:40px;font-weight:900;border-radius:20px;padding:8px 22px">✓ от хозяина · без комиссии маклера</div></div></div>
 <div class="a" data-in="3.4" data-pop="1" style="top:1180px"><div class="row us" style="display:block;text-align:center;padding:26px 30px"><div style="font-size:46px;font-weight:800">Без маклера вы сэкономили</div><div style="font-size:96px;font-weight:900;color:#0b7a55;line-height:1.1" id="sv">0&nbsp;Kč</div><div style="font-size:40px;font-weight:800;color:#55627d">≈ месяц аренды (≈&nbsp;1&nbsp;370&nbsp;€)</div></div></div>
 <div class="a s" data-in="1.0" style="top:1525px">bezrealitky.cz · объявление хозяина №1092980 · фото из объявления · обычная комиссия маклера в Праге ≈ месяц аренды</div>
</div>
<!-- 6. no risk -->
<div class="sc" id="s5" style="background:${BG[5]}"><div class="dots"></div>
 <div class="a" data-in="0.05" data-pop="1" style="top:170px;font-size:190px;line-height:1">🎁</div>
 <div class="a h1 g" data-in="0.3" style="top:410px">Первый вариант</div>
 <div class="a" data-in="1.4" data-stamp="1" style="top:560px"><span class="free">БЕСПЛАТНО</span></div>
 <div class="a h2 n" data-in="2.0" style="top:820px;font-weight:900">Понравился — тогда платите</div>
 <div class="a" data-in="2.8" data-pop="1" style="top:1050px"><span class="pill" style="background:#0b7a55;color:#fff;font-size:54px">Не нашли? Вернём деньги</span></div>
</div>
<!-- 7. action -->
<div class="sc" id="s6" style="background:${BG[6]}"><div class="dots"></div>
 <div class="phone" data-in="0.05" data-pop="1"><div class="scr">${site.map(s=>`<img src="site_${l}/${s}.png" data-site>`).join('')}<div class="tap"></div></div></div>
 <div class="a h1 n" data-in="1.2" data-pop="1" style="top:1150px;font-size:80px">Какую квартиру<br>вам найти? 👇</div>
 <div class="a" data-in="1.8" data-pop="1" style="top:1390px"><span class="cta">findorfree.com</span></div>
</div>
<div id="like">♥</div><div id="sub"></div><div id="pb"></div>
<script>
const SC=${JSON.stringify(SC)},DUR=${DUR},CH=${JSON.stringify(chunks())};
const cl=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-x,3);
const back=x=>{const c=1.7;x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const imgs=[...document.querySelectorAll('[data-site]')];
window.setT=function(t){
 SC.forEach(([a,b],i)=>{const s=document.getElementById('s'+i);const last=i===SC.length-1;
  const vis=t>=a-0.001&&(last||t<b+0.35);s.style.display=vis?'block':'none';if(!vis)return;
  const pin=i?cl((t-a)/0.35):1;s.style.transform='translateX('+((1-ease(pin))*100)+'%)';s.style.zIndex=i;const lt=t-a;
  const d=s.querySelector('.dots');if(d)d.style.transform='translateY('+(-(lt*30)%70)+'px)';
  s.querySelectorAll('[data-in]').forEach(e=>{const p=cl((lt-parseFloat(e.dataset.in))/0.4);
   if(e.dataset.stamp){const q=cl((lt-parseFloat(e.dataset.in))/0.25);e.style.opacity=q>0?1:0;e.style.transform='scale('+(2.4-1.4*ease(q))+') rotate('+(-8*ease(q))+'deg)';}
   else if(e.dataset.pop){e.style.opacity=cl(p*2);e.style.transform='scale('+(0.5+0.5*back(p))+')';}
   else{e.style.opacity=p;e.style.transform='translateY('+((1-ease(p))*60)+'px)';}});
  s.querySelectorAll('[data-strike]').forEach(e=>{e.style.width=(108*ease(cl((lt-parseFloat(e.dataset.strike))/0.4)))+'%';});
  if(i===3){s.querySelector('.photo').style.backgroundSize=(100+lt*2)+'% auto';}
  if(i===4){const q=ease(cl((lt-3.6)/1.4));document.getElementById('sv').innerHTML=Math.round(34400*q).toLocaleString('ru-RU').replace(/\\s/g,'&nbsp;')+'&nbsp;Kč';}
  if(i===6){let k=lt<1.3?0:Math.min(imgs.length-1,1+Math.floor((lt-1.3)/0.16));imgs.forEach((im,j)=>im.style.display=j===k?'block':'none');
   const tp=s.querySelector('.tap');const q=cl((lt-0.6)/0.6);tp.style.opacity=lt>0.6&&lt<1.3?1-q:0;tp.style.transform='scale('+(0.6+q*0.8)+')';}
 });
 const c=CH.find(c=>t>=c.a&&t<c.b);const sb=document.getElementById('sub');
 sb.innerHTML=c?'<div>'+c.w.map(w=>'<span class="'+(t>=w.t&&t<w.e?'on':(t>=w.e?'done':''))+'">'+w.w+'</span>').join(' ')+'</div>':'';
 const lk=document.getElementById('like');const lq=(t-22.4)/2;lk.style.opacity=lq>0&&lq<1?Math.min(1,lq*6,(1-lq)*6):0;
 lk.style.transform='translateY('+(-lq*120)+'px) scale('+(lq>0?0.6+0.4*back(cl(lq*3)):0)+')';
 document.getElementById('pb').style.width=(100*t/DUR)+'%';
};window.setT(0);
</script></body></html>`;}
function events(){const ev=[];SC.forEach(([a],i)=>{if(i)ev.push({t:a,k:'whoosh'})});
 ev.push({t:0.0,k:'pop'},{t:0.45,k:'pop'},{t:0.9,k:'found'},{t:1.2,k:'tick'});
 ev.push({t:4.2,k:'pop'},{t:4.9,k:'pop'},{t:5.4,k:'tick'});
 ev.push({t:7.5,k:'tick'},{t:8.4,k:'tick'},{t:9.0,k:'tick'},{t:10.4,k:'rise'},{t:10.4,k:'pop'});
 ev.push({t:12.05,k:'pop'},{t:12.45,k:'pop'});for(let i=0;i<6;i++)ev.push({t:12+1.8+i*0.25,k:'tick'});
 ev.push({t:16.45,k:'pop'},{t:16.7,k:'pop'},{t:16.4+2.2,k:'found'},{t:16.4+3.2,k:'rise'},{t:16.4+3.4,k:'pop'},{t:16.4+5.0,k:'found'},{t:22.5,k:'pop'});
 ev.push({t:24.25,k:'pop'},{t:24.2+1.4,k:'pop'},{t:24.2+1.45,k:'found'},{t:24.2+2.8,k:'pop'});
 ev.push({t:30.05,k:'pop'},{t:30.6,k:'tick'});for(let i=0;i<18;i++)ev.push({t:30+1.3+i*0.16,k:'key'});ev.push({t:31.2,k:'pop'},{t:31.8,k:'pop'});
 return {dur:DUR,ev,vo:VO};}
(async()=>{const l=process.argv[2]||'ru',mode=process.argv[3]||'';
 fs.writeFileSync('ad4_'+l+'.html',html(l));fs.writeFileSync('events_ad4_'+l+'.json',JSON.stringify(events()));
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
 await pg.goto('file://'+process.cwd()+'/ad4_'+l+'.html');await pg.waitForTimeout(800);
 const dir='f4_'+l;fs.mkdirSync(dir,{recursive:true});
 let fr=[...Array(DUR*30).keys()];
 if(mode==='stills')fr=[20,75,150,200,300,345,440,560,620,700,760,830,880,1000,1060];
 else if(mode.startsWith('part')){const [k,n]=mode.slice(4).split('/').map(Number);fr=fr.filter(i=>i%n===k);}
 for(const i of fr){await pg.evaluate(t=>window.setT(t),i/30);await pg.screenshot({path:dir+'/'+String(i).padStart(4,'0')+'.jpg',type:'jpeg',quality:88});}
 await b.close();})();
