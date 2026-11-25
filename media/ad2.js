// FindOrFree bright ad v2 (40 s, 1080x1920). node ad2.js en|ru [stills] -> fb_<lang>/%04d.jpg + events_ad2_<lang>.json
const fs=require('fs');const {chromium}=require('playwright');
const L={
en:{s1a:'STOP paying agencies',s1n:'€1,450',s1b:'for one apartment search',s1src:'relocation agency in Spain · movingtospain.com · checked 24 Nov 2026',
 s2a:'We do it cheaper.',hum:'✓ every result checked by a human',s2b:'We search local sites<br>in the local language',ch:['🇪🇸 Español','🇵🇹 Português','🇨🇿 Čeština','🇩🇪 Deutsch','🇮🇹 Italiano','🇬🇧 English'],
 s3a:'Full apartment search',b1:'Agency',b1v:'€1,450',b2:'FindOrFree',b2v:'from $300',x5:'5× CHEAPER',s3b:'Small searches: $19 · $39 · $89',
 s4a:'Your first option',s4b:'FREE',s4c:'We send you 1 real flat for free.<br>Like it? Only then you pay.',
 s5a:'Not found?',s5b:'Full refund.',
 s6a:'Try it now',st:['Open findorfree.com','Write what you need','Get your free option'],cta:'findorfree.com'},
ru:{s1a:'ХВАТИТ платить агентствам',s1n:'1&nbsp;450&nbsp;€',s1b:'за поиск одной квартиры',s1src:'агентство по переезду в Испании · movingtospain.com · 24.11.2026',
 s2a:'Мы делаем дешевле.',hum:'✓ каждый результат проверяет человек',s2b:'Ищем на местных сайтах<br>на местном языке',ch:['🇪🇸 Español','🇵🇹 Português','🇨🇿 Čeština','🇩🇪 Deutsch','🇮🇹 Italiano','🇬🇧 English'],
 s3a:'Полный поиск квартиры',b1:'Агентство',b1v:'1&nbsp;450&nbsp;€',b2:'FindOrFree',b2v:'от&nbsp;$300',x5:'В 5 РАЗ ДЕШЕВЛЕ',s3b:'Поиски поменьше: $19 · $39 · $89',
 s4a:'Первый вариант',s4b:'БЕСПЛАТНО',s4c:'Пришлём 1 настоящую квартиру даром.<br>Понравилась? Только тогда платите.',
 s5a:'Не нашли?',s5b:'Вернём деньги.',
 s6a:'Попробуйте сейчас',st:['Откройте findorfree.com','Напишите, что нужно','Получите вариант бесплатно'],cta:'findorfree.com'}};
const SC=[[0,6],[6,12],[12,20],[20,27.5],[27.5,32],[32,40]];const DUR=40;
const BG=['#f97316','#0f1d3a','#ffffff','#0b7a55','#f97316','#ffffff'];
function html(l){const v=L[l];return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(Montserrat.ttf)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:M,Montserrat,'Noto Color Emoji',sans-serif;color:#0f1d3a;background:#fff}
.sc{position:absolute;inset:0;opacity:0;overflow:hidden}
.dots{position:absolute;inset:-200px;background-image:radial-gradient(#ffffff22 4px,transparent 5px);background-size:70px 70px}
.dk .dots{background-image:radial-gradient(#0f1d3a10 4px,transparent 5px)}
.a{position:absolute;left:70px;right:70px;opacity:0;text-align:center}
.w{color:#fff}.o{color:#f97316}.n{color:#0f1d3a}.g{color:#0b7a55}
.h1{font-size:92px;font-weight:900;line-height:1.08}
.h2{font-size:66px;font-weight:800;line-height:1.2}
.p{font-size:50px;font-weight:700;line-height:1.3}
.s{font-size:28px;font-weight:700}
.huge{font-size:250px;font-weight:900;letter-spacing:-6px;line-height:1}
.strike{position:absolute;left:-4%;top:52%;height:26px;background:#0f1d3a;border-radius:13px;width:0;transform:rotate(-8deg)}
.chip{position:absolute;width:440px;height:120px;border-radius:30px;background:#fff;color:#0f1d3a;font-size:46px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 18px 40px #0006}
.brow{text-align:left}.lab{font-size:50px;font-weight:900;display:flex;justify-content:space-between;margin-bottom:16px}
.track{height:110px;border-radius:30px;background:#eef0f4;overflow:hidden}.fill{height:100%;width:0;border-radius:30px}
.badge{display:inline-block;background:#0b7a55;color:#fff;border-radius:40px;padding:26px 60px;font-size:96px;font-weight:900;box-shadow:0 20px 50px #0b7a5566;transform:rotate(-3deg)}
.gift{font-size:210px;line-height:1}
.free{display:inline-block;background:#fff;color:#0b7a55;border-radius:40px;padding:10px 60px;font-size:150px;font-weight:900;box-shadow:0 20px 60px #0005}
.step{display:flex;align-items:center;gap:34px;font-size:56px;font-weight:800;text-align:left}
.step b{flex:none;width:120px;height:120px;border-radius:50%;background:#f97316;color:#fff;display:flex;align-items:center;justify-content:center;font-size:62px}
.cta{display:inline-block;background:#f97316;color:#fff;border-radius:40px;padding:30px 80px;font-size:96px;font-weight:900;box-shadow:0 18px 50px #f9731677}
.logo{font-size:70px;font-weight:900}.logo span{color:#f97316}
.wl .logo span{color:#0f1d3a}
.badge,.free{white-space:nowrap}
${l==='ru'?'.free{font-size:112px;padding:14px 46px}.badge{font-size:80px}':''}
#pb{position:absolute;left:0;bottom:0;height:14px;background:#0f1d3a;width:0;z-index:9}
</style></head><body>
<div class="sc" id="s0" style="background:${BG[0]}"><div class="dots"></div>
 <div class="a h1 w" data-in="0" data-pop="1" style="top:300px">${v.s1a}</div>
 <div class="a" data-in="0.5" style="top:640px"><span class="huge w" style="position:relative;display:inline-block">${v.s1n}<i class="strike" data-strike="1.6"></i></span></div>
 <div class="a h2 w" data-in="1.0" style="top:980px">${v.s1b}</div>
 <div class="a h1 n" data-in="2.6" data-pop="1" style="top:1250px">${v.s2a}</div>
 <div class="a s w" data-in="1.2" style="top:1700px;opacity:.85">${v.s1src}</div>
</div>
<div class="sc" id="s1" style="background:${BG[1]}"><div class="dots"></div>
 <div class="a logo w" data-in="0.1" style="top:240px">Find<span>Or</span>Free</div>
 <div class="a h2 w" data-in="0.5" style="top:400px">${v.s2b}</div>
 ${v.ch.map((c,i)=>`<div class="chip" data-in="${1.2+i*0.35}" data-pop="1" style="left:${i%2?570:70}px;top:${720+Math.floor(i/2)*170}px">${c}</div>`).join('')}
 <div class="a p o" data-in="3.6" style="top:1300px;font-weight:900;font-size:42px">${v.hum}</div>
</div>
<div class="sc" id="s2" style="background:${BG[2]}">
 <div class="a h1 n" data-in="0.1" style="top:260px">${v.s3a}</div>
 <div class="a brow" data-in="0.6" style="top:520px"><div class="lab"><span>${v.b1}</span><span>${v.b1v}</span></div><div class="track"><div class="fill" data-bar="100" data-bin="0.9" style="background:#9aa3b5"></div></div></div>
 <div class="a brow" data-in="1.6" style="top:800px"><div class="lab"><span>${v.b2}</span><span class="o">${v.b2v}</span></div><div class="track"><div class="fill" data-bar="19" data-bin="1.9" style="background:#f97316"></div></div></div>
 <div class="a" data-in="3.0" data-pop="1" style="top:1120px"><span class="badge">${v.x5}</span></div>
 <div class="a p" data-in="4.2" style="top:1420px;color:#55627d">${v.s3b}</div>
</div>
<div class="sc" id="s3" style="background:${BG[3]}"><div class="dots"></div>
 <div class="a gift" data-in="0.1" data-pop="1" style="top:250px">🎁</div>
 <div class="a h1 w" data-in="0.6" style="top:540px">${v.s4a}</div>
 <div class="a" data-in="1.1" data-pop="1" style="top:700px"><span class="free">${v.s4b}</span></div>
 <div class="a p w" data-in="2.2" style="top:1050px">${v.s4c}</div>
</div>
<div class="sc" id="s4" style="background:${BG[4]}"><div class="dots"></div>
 <div class="a h1 w" data-in="0.1" style="top:640px;font-size:120px">${v.s5a}</div>
 <div class="a h1 n" data-in="0.7" data-pop="1" style="top:820px;font-size:130px">${v.s5b}</div>
</div>
<div class="sc dk" id="s5" style="background:${BG[5]}"><div class="dots"></div>
 <div class="a h1 n" data-in="0.1" style="top:240px">${v.s6a}</div>
 ${v.st.map((s,i)=>`<div class="a step n" data-in="${0.6+i*0.6}" style="top:${450+i*190}px"><b>${i+1}</b><span>${s}</span></div>`).join('')}
 <div class="a" data-in="2.8" data-pop="1" style="top:1110px"><span class="cta">${v.cta}</span></div>
 <div class="a logo n" data-in="3.4" style="top:1400px">Find<span>Or</span>Free</div>
</div>
<div id="pb"></div>
<script>
const SC=${JSON.stringify(SC)},DUR=${DUR};
const cl=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-x,3);
const back=x=>{const c=1.7;x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
window.setT=function(t){
 SC.forEach(([a,b],i)=>{const s=document.getElementById('s'+i);const last=i===SC.length-1;
  // slide transition: new scene wipes in from right
  const pin=cl((t-a)/0.35),pout=last?1:cl((b-t)/0.35);const op=Math.min(pin,pout);
  s.style.display=(t>=a-0.01&&(last||t<=b+0.01))?'block':'none';s.style.opacity=op>0?1:0;
  s.style.transform='translateX('+((1-ease(pin))*100)+'%)';s.style.zIndex=i;
  if(s.style.display==='none')return;const lt=t-a;
  s.querySelector('.dots')&&(s.querySelector('.dots').style.transform='translateY('+(-lt*30%70)+'px)');
  s.querySelectorAll('[data-in]').forEach(e=>{const p=cl((lt-parseFloat(e.dataset.in))/0.45);
   const base=e.classList.contains('chip')?'':'';
   if(e.dataset.pop){e.style.opacity=cl(p*2);e.style.transform='scale('+(0.5+0.5*back(p))+')';}
   else{e.style.opacity=p;e.style.transform='translateY('+((1-ease(p))*60)+'px)';}});
  s.querySelectorAll('[data-strike]').forEach(e=>{e.style.width=(108*ease(cl((lt-parseFloat(e.dataset.strike))/0.5)))+'%';});
  s.querySelectorAll('[data-bar]').forEach(e=>{e.style.width=(parseFloat(e.dataset.bar)*ease(cl((lt-parseFloat(e.dataset.bin))/0.9)))+'%';});
  if(i===0){const k=cl((lt-0.5)/0.3);const big=s.querySelector('.huge');big.style.transform='scale('+(1+0.06*Math.sin(Math.min(lt,1.6)*12)*(lt<1.6?1:0))+')';}
 });
 document.getElementById('pb').style.width=(100*t/DUR)+'%';
};window.setT(0);
</script></body></html>`;}
function events(l){const ev=[];SC.forEach(([a])=>ev.push({t:a,k:'whoosh'}));
 ev.push({t:0.05,k:'pop'},{t:1.6,k:'rise'},{t:2.1,k:'pop'},{t:2.6,k:'found'});
 for(let i=0;i<6;i++)ev.push({t:6+1.2+i*0.35,k:'tick'});ev.push({t:9.6,k:'tick'});
 ev.push({t:12.9,k:'rise'},{t:13.9,k:'tick'},{t:15.0,k:'pop'},{t:20.1,k:'pop'},{t:21.1,k:'found'},{t:28.2,k:'pop'});
 [0.6,1.2,1.8].forEach(d=>ev.push({t:32+d,k:'tick'}));ev.push({t:34.8,k:'found'});
 return {dur:DUR,ev};}
(async()=>{const l=process.argv[2]||'en',stills=process.argv[3]==='stills';
 fs.writeFileSync('ad2_'+l+'.html',html(l));fs.writeFileSync('events_ad2_'+l+'.json',JSON.stringify(events(l)));
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
 await pg.goto('file://'+process.cwd()+'/ad2_'+l+'.html');await pg.waitForTimeout(500);
 const dir='fb_'+l;fs.mkdirSync(dir,{recursive:true});
 const fr=stills?[20,110,170,300,500,700,760,900,1000,1100,1190,1199]:[...Array(DUR*30).keys()];
 for(const i of fr){await pg.evaluate(t=>window.setT(t),i/30);await pg.screenshot({path:dir+'/'+String(i).padStart(4,'0')+'.jpg',type:'jpeg',quality:90});}
 await b.close();})();
