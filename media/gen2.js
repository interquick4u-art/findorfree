const {chromium}=require('playwright');const fs=require('fs');
const V={
berlin:{bg1:'empty.jpg',bg2:'free.jpg',num:5385,pre:'',
 chip:'Kleinanzeigen · Zu verschenken · Berlin',
 cards:[['Schlafsofa zu verschenken','€0'],['Matratze 1,40x2m zu verschenken','€0'],['Vitrine Holz','€0'],['Stabiles Holzregal aus Kiefernholz','€0']],
 en:{a:['Just moved to Berlin?','Your flat is <b>EMPTY.</b>','<i>Your wallet is next.</i>'],b:['Meanwhile, Berliners','give furniture away.','<u>FREE.</u>'],
  lab:'free listings right now',sub:['Sofa bed · Prenzlauer Berg','Mattress · Hellersdorf','Wooden cabinet · Neukölln','Pine shelf · Lichtenberg'],
  src:'Source: kleinanzeigen.de, 18 Nov 2026 · photo: illustration',d:['But only if you search<br><b>in German.</b>','We search in the local language.<br>For you.'],offer:'First 10 searches are free'},
 ru:{a:['Переехали в Берлин?','Квартира <b>ПУСТАЯ.</b>','<i>Кошелёк — следующий.</i>'],b:['А берлинцы тем временем','отдают мебель','<u>ДАРОМ.</u>'],
  lab:'бесплатных объявлений прямо сейчас',sub:['Диван-кровать · Пренцлауэр-Берг','Матрас · Хеллерсдорф','Деревянная витрина · Нойкёльн','Сосновый стеллаж · Лихтенберг'],
  src:'Источник: kleinanzeigen.de, 18.11.2026 · фото: иллюстрация',d:['Но только если искать<br><b>по-немецки.</b>','Мы ищем на местном языке.<br>За вас.'],offer:'Первые 10 поисков — бесплатно'}},
japan:{bg1:'phone.png',bg2:'jp_house.png',num:1500000,pre:'¥',
 chip:'長崎市 空き家バンク · Nagasaki City',
 cards:[['小菅修船場跡の徒歩圏内にある家','¥1.5M'],null,['浦上天主堂が望める空き地','¥0']],
 en:{a:["Can't afford a house?",'Maybe you search','<i>in the wrong language.</i>'],b:['This one is for sale','in Nagasaki, Japan.','<u>Price of a used car.</u>'],
  lab:'≈ $9,400 · 5 rooms · 75 m² · built 1962',sub:['House near the historic Kosuge dock','','Land with a cathedral view · 257 m²'],note:['Honest note: old house, needs work,','no car access'],
  src:'Source: city.nagasaki.lg.jp/akiya, listings 36108 and 76728 · photo: illustration',d:['Listed only<br><b>in Japanese.</b>','We search in the local language.<br>For you.'],offer:'First 10 searches are free'},
 ru:{a:['Не хватает на свой дом?','Может, вы ищете','<i>не на том языке.</i>'],b:['Этот продаётся','в Нагасаки, Япония.','<u>По цене б/у машины.</u>'],
  lab:'≈ $9 400 · 5 комнат · 75 м² · 1962 год',sub:['Дом рядом с историческим доком Косугэ','','Участок с видом на собор · 257 м²'],note:['Честно: дом старый, нужен ремонт,','подъезда для машины нет'],
  src:'Источник: city.nagasaki.lg.jp/akiya, объявления 36108 и 76728 · фото: иллюстрация',d:['Объявление только<br><b>на японском.</b>','Мы ищем на местном языке.<br>За вас.'],offer:'Первые 10 поисков — бесплатно'}}};
function html(v,l){const d=v[l];const n=v.cards.length;const step=n===4?0.72:0.95;
const cards=v.cards.map((c,i)=>{const dl=(4.15+step*i).toFixed(2);
 if(!c)return `<div class="card note" style="animation-delay:${dl}s"><div class="ct"><div class="c2">${d.note[0]}<br>${d.note[1]}</div></div><div class="bd warn">!</div></div>`;
 return `<div class="card" style="animation-delay:${dl}s"><div class="ct"><div class="c1">${c[0]}</div><div class="c2">${d.sub[i]}</div></div><div class="bd" style="animation-delay:${(+dl+.25).toFixed(2)}s">${c[1]}</div></div>`}).join('');
return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'M';src:url('Montserrat.ttf');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000;font-family:'M','WenQuanYi Zen Hei',sans-serif;color:#fff}
.bg{position:absolute;inset:-40px;background-size:cover;background-position:center}
#b1{background-image:url('${v.bg1}');animation:z1 3.3s linear both}
#b2{background-image:url('${v.bg2}');opacity:0;animation:fin .18s linear 3.2s both,z2 7s linear 3.2s both}
@keyframes z1{from{transform:scale(1)}to{transform:scale(1.14)}}
@keyframes z2{from{transform:scale(1.16)}to{transform:scale(1)}}
@keyframes fin{from{opacity:0}to{opacity:1}}
@keyframes fout{from{opacity:1}to{opacity:0}}
.sh{position:absolute;inset:0}
#sh1{background:linear-gradient(180deg,#0009 0%,#0005 35%,#0001 60%,#0006 100%);animation:fout .15s linear 3.2s both}
#shB{background:#0006;opacity:0;animation:fin .2s linear 1.75s both,fout .15s linear 3.2s forwards}
#sh2{background:linear-gradient(180deg,#000b 0%,#0005 22%,#0000 40%,#0005 60%,#0008 100%);opacity:0;animation:fin .18s linear 3.2s both}
#shD{background:#000000b0;opacity:0;animation:fin .3s linear 7.55s both}
.flash{position:absolute;inset:0;background:#fff;opacity:0;animation:fl .35s ease-out 3.15s both}
@keyframes fl{0%{opacity:0}30%{opacity:.9}100%{opacity:0}}
.sc{position:absolute;left:60px;right:60px}
.ln{display:block;font-weight:900;line-height:1.08;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 6px 30px #000,0 0 14px #000,0 0 4px #000;opacity:0;animation:pop .28s cubic-bezier(.2,1.5,.4,1) both}
@keyframes pop{from{opacity:0;transform:translateY(40px) scale(.9)}to{opacity:1;transform:none}}
b{background:#ffd60a;color:#111;padding:0 18px;border-radius:14px;text-shadow:none;-webkit-text-stroke:0;font-weight:900}
i{font-style:normal;color:#ff4d4d}
u{text-decoration:none;color:#ffd60a}
#A{top:300px;animation:fout .12s linear 1.7s both}
#A .ln{font-size:118px;margin-bottom:30px}
#A .ln:nth-child(1){animation:none;opacity:1}
#A .ln:nth-child(2){animation-delay:.45s}#A .ln:nth-child(3){animation-delay:.95s;font-size:124px}
#B{top:480px;text-align:center;animation:fout .12s linear 3.17s both}
#B .ln{font-size:100px;margin-bottom:20px}
#B .ln:nth-child(1){animation-delay:1.8s}#B .ln:nth-child(2){animation-delay:2.1s}#B .ln:nth-child(3){animation-delay:2.5s;font-size:${v.pre?112:190}px;margin-top:20px}
#C{top:120px;animation:fout .15s linear 7.5s both}
.chip{display:inline-block;font-size:36px;font-weight:700;background:#fff;color:#111;border-radius:50px;padding:14px 34px;opacity:0;animation:pop .25s ease 3.3s both}
.num{font-size:${v.pre?150:230}px;font-weight:900;line-height:1;margin-top:26px;color:#ffd60a;text-shadow:0 8px 40px #000,0 0 10px #000;opacity:0;animation:pop .25s ease 3.4s both;font-variant-numeric:tabular-nums}
.lab{font-size:44px;font-weight:800;margin-top:10px;text-shadow:0 4px 20px #000,0 0 8px #000;opacity:0;animation:pop .25s ease 3.55s both}
#cards{position:absolute;left:50px;right:50px;top:${n===4?860:960}px;animation:fout .15s linear 7.5s both}
.card{display:flex;align-items:center;gap:20px;background:#fffffff2;color:#111;border-radius:30px;padding:24px 28px;margin-bottom:20px;box-shadow:0 14px 40px #0009;opacity:0;animation:cin .3s cubic-bezier(.2,1.4,.4,1) both}
@keyframes cin{from{opacity:0;transform:translateX(-120px)}to{opacity:1;transform:none}}
.ct{flex:1;min-width:0}.c1{font-size:45px;font-weight:800;line-height:1.15}.c2{font-size:35px;font-weight:600;color:#555;margin-top:6px;line-height:1.2}
.note{background:#fff3cdf5}.note .c2{color:#4a3b00;font-size:38px;font-weight:700;margin:0}
.bd{font-size:56px;font-weight:900;background:#16a34a;color:#fff;border-radius:22px;padding:14px 24px;white-space:nowrap;opacity:0;animation:stamp .25s cubic-bezier(.2,1.8,.4,1) both}
.warn{background:#d97706;animation-delay:5.3s}
@keyframes stamp{from{opacity:0;transform:scale(2.2) rotate(-12deg)}to{opacity:1;transform:rotate(-4deg)}}
.src{position:absolute;left:50px;right:50px;bottom:150px;font-size:26px;font-weight:700;color:#fff;text-shadow:0 2px 8px #000,0 0 4px #000;opacity:0;animation:fin .3s linear 3.6s both,fout .15s linear 7.5s forwards}
#D{top:520px;text-align:center}
#D .ln{font-size:96px;margin-bottom:60px;line-height:1.2}
#D .ln:nth-child(1){animation-delay:7.65s}#D .ln:nth-child(2){animation-delay:8.3s;font-size:68px;font-weight:800}
.cta{display:inline-block;margin-top:30px;font-size:84px;font-weight:900;background:#ffd60a;color:#111;border-radius:40px;padding:26px 50px;opacity:0;animation:pop .3s cubic-bezier(.2,1.6,.4,1) 8.8s both}
.offer{font-size:46px;font-weight:800;margin-top:44px;color:#fff;opacity:0;animation:pop .3s ease 9.15s both}
</style></head><body>
<div class="bg" id="b1"></div><div class="sh" id="sh1"></div><div class="sh" id="shB"></div>
<div class="bg" id="b2"></div><div class="sh" id="sh2"></div><div class="flash"></div>
<div class="sc" id="A">${d.a.map(x=>`<span class="ln">${x}</span>`).join('')}</div>
<div class="sc" id="B">${d.b.map(x=>`<span class="ln">${x}</span>`).join('')}</div>
<div class="sc" id="C"><div class="chip">${v.chip}</div><div class="num" id="num"></div><div class="lab">${d.lab}</div></div>
<div id="cards">${cards}</div><div class="src">${d.src}</div>
<div class="sh" id="shD"></div>
<div class="sc" id="D">${d.d.map(x=>`<span class="ln">${x}</span>`).join('')}<div class="cta">findorfree.com</div><div class="offer">${d.offer}</div></div>
<script>const N=${v.num},P='${v.pre}',RU=${l==='ru'};window.setT=t=>{let k=Math.min(1,Math.max(0,(t-3.4)/0.9));k=1-Math.pow(1-k,3);const s=Math.round(N*k).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,RU?' ':',');document.getElementById('num').textContent=P+s;}</script>
</body></html>`;}
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
const want=process.argv[2];const stills=process.argv[3]==='stills';
for(const k of Object.keys(V))for(const l of ['en','ru']){const name=k+'_'+l;if(want&&want!==name)continue;
fs.writeFileSync(name+'.html',html(V[k],l));fs.rmSync('f_'+name,{recursive:true,force:true});fs.mkdirSync('f_'+name);
await pg.goto('file://'+process.cwd()+'/'+name+'.html');await pg.waitForTimeout(600);
await pg.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
const frames=stills?[0,36,66,96,117,180,222,246,285,299]:[...Array(300).keys()];
for(const i of frames){await pg.evaluate(t=>{document.getAnimations().forEach(a=>a.currentTime=t*1000);window.setT(t)},i/30);
await pg.screenshot({path:`f_${name}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:stills?70:92});}
console.log('done',name);}
await b.close();})();
