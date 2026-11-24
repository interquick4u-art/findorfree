// Format v3 (19.11.2026): typed request -> first-person search -> FOUND -> loop. ASMR sounds, no music.
// node gen4.js <key_lang> [stills]   -> frames f_<name>/%04d.jpg + events_<name>.json (for audio4.py)
const {chromium}=require('playwright');const fs=require('fs');
const V={
volvo:{img:'seat.png',price:'€120',title:'Fahrersitz Volvo 940',
 wins:[['SE','Svenska','förarstol Volvo 940'],['PL','Polski','fotel kierowcy Volvo 940'],['FR','Français','siège conducteur Volvo 940'],['DE','Deutsch','Fahrersitz Volvo 940']],
 en:{pain:'Dealer: <i>“Discontinued.”</i>',find:'FIND ME',q:'Driver seat for my 1994 Volvo 940',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'Dortmund, Germany · listed in German',
  src:'kleinanzeigen.de, 19 Nov 2026 · 56 listings for Volvo 940 seats · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'Taxi from Antalya airport at 3 am',fs:94},
 ru:{pain:'В сервисе: <i>«Снято с производства»</i>',find:'НАЙДИТЕ МНЕ',q:'Сиденье водителя для Volvo 940 1994 года',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Дортмунд · объявление на немецком',
  src:'kleinanzeigen.de, 19.11.2026 · 56 объявлений с сиденьями Volvo 940 · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'Такси из аэропорта Анталии в 3 ночи',fs:82}},
taxi:{img:'taxi.png',price:'€75',title:'Havalimanı → Kemer, 7/24',
 wins:[['TR','Türkçe','gece transfer Antalya Kemer'],['DE','Deutsch','Nachttransfer Antalya Kemer'],['RU','Русский','трансфер Анталья Кемер ночью'],['GB','English','Antalya airport night transfer']],
 en:{pain:'Landing at 3 am. <i>No taxi price.</i>',find:'FIND ME',q:'Taxi from Antalya airport to Kemer at 3 am',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking prices…',found:'FOUND',sub:'Per car, up to 6 · no night extra',
  src:'kingsworldtransfer.com, 20 Nov 2026 · Mercedes Vito, 45–55 min · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'LEGO Millennium Falcon 10179, retired',fs:86},
 ru:{pain:'Прилёт в 3 ночи. <i>Цену такси никто не знает.</i>',find:'НАЙДИТЕ МНЕ',q:'Такси из аэропорта Анталии в Кемер в 3 ночи',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Сверяем цены…',found:'НАЙДЕНО',sub:'За машину · без ночной доплаты',
  src:'kingsworldtransfer.com, 20.11.2026 · Mercedes Vito, 45–55 мин · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'LEGO Millennium Falcon 10179, снят с продажи',fs:78}},
lego:{img:'lego.png',price:'$1,349',title:'LEGO 10179 · Sakai, Japan',
 wins:[['DE','Deutsch','LEGO 10179 gebraucht'],['IT','Italiano','LEGO 10179 usato'],['PL','Polski','LEGO 10179 używany'],['GB','English','LEGO 10179 used']],
 en:{pain:'Store: <i>“Retired in 2009.”</i>',find:'FIND ME',q:'LEGO Millennium Falcon 10179, the big one',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'Used, no box · seller in Japan',
  src:'ebay.de, 20 Nov 2026 · retail price €549.99 in 2007 · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'Taxi from Antalya airport at 3 am',fs:86},
 ru:{pain:'В магазине: <i>«Сняли с продажи в 2009-м»</i>',find:'НАЙДИТЕ МНЕ',q:'LEGO Millennium Falcon 10179, большой',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Б/у, без коробки · из Японии',
  src:'ebay.de, 20.11.2026 · в 2007 году стоил €549,99 · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'Такси из аэропорта Анталии в 3 ночи',fs:80}},
pharm:{img:'pharm.png',price:'24/7',title:'Dubai · 208 pharmacies',
 wins:[['GB','English','24 hour pharmacy Dubai'],['DE','Deutsch','Apotheke 24 Stunden Dubai'],['RU','Русский','круглосуточная аптека Дубай'],['FR','Français','pharmacie 24h/24 Dubaï']],
 en:{pain:'3 am in Dubai. <i>Kid has a fever.</i>',find:'FIND ME',q:'Pharmacy open right now in Dubai',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking opening hours…',found:'FOUND',sub:'Most 24/7 spots: Al Barsha, Deira',
  src:'zavis.ai after-hours index, 10 Nov 2026 · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'Driver seat for my 1994 Volvo 940',fs:94},
 ru:{pain:'3 ночи в Дубае. <i>У ребёнка температура.</i>',find:'НАЙДИТЕ МНЕ',q:'Аптека, открытая прямо сейчас, Дубай',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Проверяем часы работы…',found:'НАЙДЕНО',sub:'Больше всего: Аль-Барша, Дейра',
  src:'zavis.ai, индекс от 10.11.2026 · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'Сиденье водителя для Volvo 940 1994 года',fs:82}},
w124:{img:'w124.png',price:'38 zł',title:'Kierunkowskaz W124 · Żory',
 wins:[['PL','Polski','kierunkowskaz W124 przedni'],['DE','Deutsch','Blinker vorne W124'],['NL','Nederlands','knipperlicht W124 voor'],['GB','English','W124 front indicator']],
 en:{pain:'Dealer: <i>“A 1980s Mercedes? No parts.”</i>',find:'FIND ME',q:'Front right indicator for my Mercedes W124',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'New part · seller in Poland',
  src:'otomoto.pl, listed 17 Nov 2026 · about €9 · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'2-room flat in Valencia old town',fs:86},
 ru:{pain:'В сервисе: <i>«На Mercedes 80-х деталей нет»</i>',find:'НАЙДИТЕ МНЕ',q:'Передний правый поворотник на Mercedes W124',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Новая деталь · продавец в Польше',
  src:'otomoto.pl, объявление от 17.11.2026 · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'Двушка в старом городе Валенсии',fs:78}},
valencia:{img:'valencia.png',price:'€1,650',title:'El Pilar · 71 m² · balcony',
 wins:[['ES','Español','piso 2 habitaciones Ciutat Vella'],['GB','English','2 room flat Valencia old town'],['RU','Русский','квартира Валенсия старый город'],['DE','Deutsch','Wohnung Valencia Altstadt']],
 en:{pain:'Moving to Valencia? <i>Rents are a maze.</i>',find:'FIND ME',q:'2-room flat in Valencia old town, monthly',btn:'SEARCH',
  hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'2 rooms · per month · old town',
  src:'habitaclia.com, checked 20 Nov 2026 · photo: illustration',
  g1:'Not found?',g2:'Full refund.',q2:'Front right indicator for my Mercedes W124',fs:86},
 ru:{pain:'Переезд в Валенсию? <i>С арендой запутаться легко.</i>',find:'НАЙДИТЕ МНЕ',q:'Двушка в старом городе Валенсии, помесячно',btn:'ИСКАТЬ',
  hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'2 комнаты · в месяц · старый город',
  src:'habitaclia.com, 20.11.2026 · фото: иллюстрация',
  g1:'Не нашли?',g2:'Вернём деньги.',q2:'Передний поворотник на Mercedes W124',fs:78}},
brompton:{img:'brompton.png',price:'€800',title:'Brompton C Line · Belém',
 wins:[['PT','Português','Brompton usada Lisboa'],['GB','English','used Brompton Lisbon'],['ES','Español','Brompton segunda mano Lisboa'],['FR','Français','Brompton occasion Lisbonne']],
 en:{pain:'New Brompton in the shop: <i>“€2,000+”</i>',find:'FIND ME',q:'Used Brompton folding bike in Lisbon',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'Used · 2 gears · black/coral',src:'olx.pt, listed 17 Nov 2026 · Belém, Lisbon · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'Front right indicator for my Mercedes W124',fs:86},
 ru:{pain:'Новый Brompton в магазине: <i>«от €2 000»</i>',find:'НАЙДИТЕ МНЕ',q:'Б/у складной Brompton в Лиссабоне',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Б/у · 2 скорости · чёрный/коралл',src:'olx.pt, объявление от 17.11.2026 · Белен, Лиссабон · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'Передний поворотник на Mercedes W124',fs:78}},
akiya:{img:'akiya.png',price:'¥500,000',title:'4LDK house · Odate, Akita',
 wins:[['JP','Nihongo (romaji)','akiya Odate 4LDK'],['GB','English','cheap house Japan Akita'],['RU','Русский','дом в Японии дёшево'],['DE','Deutsch','Haus Japan günstig']],
 en:{pain:'A house abroad? <i>“Only for millionaires.”</i>',find:'FIND ME',q:'A whole house in Japan, cheaper than a car',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'109 m² · 261 m² land · needs repair',src:'Odate City akiya bank via akiyajapan.com, checked 22 Nov 2026 · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'Used Thermomix TM6 in Poland',fs:86},
 ru:{pain:'Дом за границей? <i>«Это для миллионеров»</i>',find:'НАЙДИТЕ МНЕ',q:'Целый дом в Японии дешевле машины',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'109 м² · участок 261 м² · нужен ремонт',src:'банк пустых домов г. Одате (akiyajapan.com), 22.11.2026 · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'Б/у Thermomix TM6 в Польше',fs:78}},
thermo:{img:'thermo.png',price:'1,300 zł',title:'Thermomix TM6 · Bydgoszcz',
 wins:[['PL','Polski','Thermomix TM6 używany'],['DE','Deutsch','Thermomix TM6 gebraucht'],['RU','Русский','Thermomix TM6 б/у'],['UA','Українська','Thermomix TM6 вживаний']],
 en:{pain:'New Thermomix: <i>“4,600 zł”</i>',find:'FIND ME',q:'Used Thermomix TM6, good condition',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'Used · very good · original parts',src:'olx.pl, listed 19 Nov 2026 · about €300 · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'500 printed cotton tote bags',fs:86},
 ru:{pain:'Новый Thermomix: <i>«4 600 злотых»</i>',find:'НАЙДИТЕ МНЕ',q:'Б/у Thermomix TM6 в хорошем состоянии',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Б/у · очень хороший · родные насадки',src:'olx.pl, объявление от 19.11.2026 · около 300 € · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'500 хлопковых сумок с логотипом',fs:78}},
tote:{img:'tote.png',price:'$1.35',title:'Cotton canvas tote · India',
 wins:[['IN','English','cotton tote bag manufacturer India'],['DE','Deutsch','Baumwolltasche Hersteller'],['ES','Español','bolsa de algodón fabricante'],['RU','Русский','хлопковая сумка оптом']],
 en:{pain:'Branded bags for your shop? <i>Local prices bite.</i>',find:'FIND ME',q:'500 printed cotton tote bags for my shop',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking suppliers…',found:'FOUND',sub:'From $1.35 · min. 500 · 12 oz canvas',src:'alibaba.com, supplier price range $1.35–3.50, checked 22 Nov 2026 · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'A whole house in Japan, cheaper than a car',fs:86},
 ru:{pain:'Сумки с логотипом? <i>У местных дорого.</i>',find:'НАЙДИТЕ МНЕ',q:'500 хлопковых сумок с логотипом',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем поставщиков…',found:'НАЙДЕНО',sub:'От $1.35 · от 500 шт · канвас 12 oz',src:'alibaba.com, цена поставщика $1.35–3.50, 22.11.2026 · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'Целый дом в Японии дешевле машины',fs:78}},
caravan:{img:'caravan.png',price:'10,683 lei',title:'Used Lord caravan · Romania',
 wins:[['RO','Română','rulotă second hand ieftină'],['DE','Deutsch','Wohnwagen gebraucht günstig'],['PL','Polski','przyczepa kempingowa używana'],['GB','English','cheap used caravan Europe']],
 en:{pain:'A caravan? <i>“Too expensive.”</i>',find:'FIND ME',q:'A cheap used caravan in Europe',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'Used · whole caravan · about €2,100',src:'olx.ro, listed 24 Nov 2026 · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'Used Vespa Primavera in Lisbon',fs:86},
 ru:{pain:'Дом на колёсах? <i>«Дорого»</i>',find:'НАЙДИТЕ МНЕ',q:'Недорогой б/у жилой прицеп в Европе',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'Б/у · целый прицеп · около 2 100 €',src:'olx.ro, объявление от 24.11.2026 · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'Б/у Vespa Primavera в Лиссабоне',fs:78}},
vespa:{img:'vespa.png',price:'€3,600',title:'Vespa Primavera 2023 · Lisbon',
 wins:[['PT','Português','Vespa Primavera usada Lisboa'],['ES','Español','Vespa Primavera segunda mano'],['IT','Italiano','Vespa Primavera usata'],['GB','English','used Vespa Lisbon']],
 en:{pain:'New Vespa Primavera: <i>“€5,390”</i>',find:'FIND ME',q:'Used Vespa Primavera in Lisbon',btn:'SEARCH',hdr:'Searching in 4 languages',chk:'Checking listings…',found:'FOUND',sub:'2023 · 11,087 km · private seller',src:'standvirtual.com, checked 24 Nov 2026 · photo: illustration',g1:'Not found?',g2:'Full refund.',q2:'A cheap used caravan in Europe',fs:86},
 ru:{pain:'Новая Vespa Primavera: <i>«5 390 €»</i>',find:'НАЙДИТЕ МНЕ',q:'Б/у Vespa Primavera в Лиссабоне',btn:'ИСКАТЬ',hdr:'Ищем на 4 языках',chk:'Проверяем объявления…',found:'НАЙДЕНО',sub:'2023 · 11 087 км · частный продавец',src:'standvirtual.com, проверено 24.11.2026 · фото: иллюстрация',g1:'Не нашли?',g2:'Вернём деньги.',q2:'Недорогой б/у жилой прицеп в Европе',fs:78}},};
// ---- timeline (seconds) ----
const TL={typ0:0.12,typ1:1.38,enter:1.52,B:1.7,win:0.75,C:4.7,D:5.8,stamp:6.35,E:8.4,box2:8.85,typ2:9.2,end:10};
function events(v,l){const d=v[l];const ev=[];const n=d.q.length;
 for(let i=0;i<n;i++)if(d.q[i]!==' ')ev.push(['key',TL.typ0+(TL.typ1-TL.typ0)*i/(n-1)]);else ev.push(['space',TL.typ0+(TL.typ1-TL.typ0)*i/(n-1)]);
 ev.push(['enter',TL.enter]);
 v.wins.forEach((w,i)=>{const t=TL.B+TL.win*i;ev.push(['whoosh',t]);
  for(let k=0;k<6;k++)ev.push(['tick',t+0.14+k*0.045]);ev.push(['click',t+0.56]);});
 ev.push(['riser',TL.C]);ev.push(['hit',TL.D]);ev.push(['stamp',TL.stamp]);ev.push(['slam',0.0]);[0.75,0.95,1.12].forEach(x=>ev.push(['pop',TL.D+x]));ev.push(['shim',TL.D+1.35]);ev.push(['whoosh',TL.E]);ev.push(['pop',TL.E+0.2]);ev.push(['whoosh2',TL.box2]);
 const step=0.05;for(let i=0;TL.typ2+i*step<TL.end-0.03&&i<d.q2.length;i++)if(d.q2[i]!==' ')ev.push(['key',TL.typ2+i*step]);
 return ev;}
function html(v,l){const d=v[l];
const wins=v.wins.map((w,i)=>`<div class="win" id="w${i}"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="tab"><span class="cc">${w[0]}</span>${w[1]}</span></div>
 <div class="sf"><span class="mag"></span><span class="wq" id="wq${i}"></span></div>
 ${[0,1,2,3].map(r=>`<div class="row" id="r${i}_${r}"><span class="th"></span><span class="ls"><span class="l1" style="width:${[78,64,86,58][(r+i)%4]}%"></span><span class="l2" style="width:${[52,70,44,62][(r+i)%4]}%"></span></span></div>`).join('')}</div>`).join('');
return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'M';src:url('Montserrat.ttf');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:'M',sans-serif;color:#fff;background:#0b1020}
body{background:radial-gradient(1200px 900px at 50% 38%,#1b2a66 0%,#0e1530 55%,#070b1a 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff0a 2px,transparent 2px),linear-gradient(90deg,#ffffff0a 2px,transparent 2px);background-size:90px 90px}
.abs{position:absolute}
i{font-style:normal;color:#ff5a4d}
#pain{transform-origin:0 50%;left:60px;right:60px;top:${l==='ru'?200:250}px;font-size:${l==='ru'?84:104}px;font-weight:900;line-height:1.12;text-shadow:0 6px 30px #000}
#box{left:60px;width:960px;top:560px;min-height:470px;background:#fff;border-radius:52px;border:9px solid #ff7a59;padding:44px 50px;box-shadow:0 0 0 14px #ff7a5933,0 30px 80px #000a}
.find{font-size:36px;font-weight:900;letter-spacing:6px;color:#ff7a59;margin-bottom:18px}
.q{font-size:${d.fs}px;font-weight:800;color:#0b1020;line-height:1.13;word-break:break-word}
.car{display:inline-block;width:10px;height:${Math.round(d.fs*0.95)}px;background:#ff7a59;vertical-align:-12%;margin-left:6px;border-radius:4px}
#btn{right:60px;top:${l==='ru'?1140:1085}px;font-size:58px;font-weight:900;background:#ff7a59;color:#fff;border-radius:60px;padding:26px 64px;box-shadow:0 16px 40px #ff7a5966}
#hdr{left:60px;right:60px;top:220px;font-size:62px;font-weight:900;text-align:center}
#cnt{left:0;right:0;top:310px;text-align:center;font-size:46px;font-weight:800;color:#ffb347}
.win{position:absolute;left:70px;width:940px;top:420px;height:900px;background:#f4f6fb;border-radius:40px;overflow:hidden;box-shadow:0 30px 90px #000c;opacity:0}
.bar{height:96px;background:#1a2244;display:flex;align-items:center;padding:0 30px;gap:14px}
.dot{width:22px;height:22px;border-radius:50%;background:#ff7a59}.dot:nth-child(2){background:#ffb347}.dot:nth-child(3){background:#4ade80}
.tab{margin-left:24px;background:#f4f6fb;color:#0b1020;font-size:36px;font-weight:800;padding:14px 30px;border-radius:22px 22px 0 0;align-self:flex-end;display:flex;gap:14px;align-items:center}
.cc{background:#0b1020;color:#fff;font-size:26px;border-radius:10px;padding:4px 10px}
.sf{margin:34px 36px 26px;height:110px;border-radius:55px;border:6px solid #ff7a59;background:#fff;display:flex;align-items:center;padding:0 34px;gap:20px}
.mag{width:38px;height:38px;border:7px solid #0b1020;border-radius:50%;flex:none}
.wq{font-size:50px;font-weight:800;color:#0b1020;white-space:nowrap}
.row{display:flex;gap:28px;align-items:center;margin:0 36px 24px;padding:20px;border-radius:26px;background:#fff;border:6px solid transparent}
.th{width:120px;height:120px;border-radius:18px;background:#cfd6e6;flex:none}
.ls{flex:1}.l1,.l2{display:block;height:26px;border-radius:13px;background:#b9c2d8;margin-bottom:18px}.l2{background:#d9deea;margin:0}
#cur{width:70px;height:70px;left:0;top:0;opacity:0;z-index:5}
#rip{width:120px;height:120px;border-radius:50%;border:10px solid #ff7a59;opacity:0;z-index:4}
#pb{left:70px;width:940px;top:1392px;height:44px;border-radius:22px;background:#ffffff22;overflow:hidden}
#pf{height:100%;width:0;background:linear-gradient(90deg,#ff7a59,#ffb347);border-radius:22px}
#pt{left:70px;right:70px;top:1452px;font-size:44px;font-weight:800;display:flex;justify-content:space-between}
#big{left:0;right:0;top:640px;text-align:center;font-size:330px;font-weight:900;color:#ffb347;opacity:0;font-variant-numeric:tabular-nums;text-shadow:0 0 80px #ff7a5988}
#flash{inset:0;background:#fff;opacity:0;z-index:9}
#found{left:0;right:0;top:170px;text-align:center;opacity:0}
#found span{display:inline-flex;align-items:center;gap:26px;font-size:${l==='ru'?128:150}px;font-weight:900;background:#16a34a;color:#fff;border-radius:44px;padding:14px 50px;box-shadow:0 20px 60px #16a34a88}
.chk{width:${l==='ru'?104:120}px;height:${l==='ru'?104:120}px;border-radius:50%;background:#fff;position:relative;flex:none}
.chk:after{content:'';position:absolute;left:34%;top:14%;width:26%;height:52%;border:solid #16a34a;border-width:0 16px 16px 0;transform:rotate(42deg)}
#ph{left:150px;top:440px;width:780px;height:780px;border-radius:44px;border:12px solid #fff;background:#222 url('${v.img}') center/cover;box-shadow:0 30px 90px #000d;opacity:0}
#price{right:70px;top:1050px;font-size:170px;font-weight:900;background:#ff7a59;color:#fff;border-radius:40px;padding:6px 44px;box-shadow:0 20px 60px #000b;opacity:0;z-index:3}
#ttl{left:60px;right:60px;top:1262px;font-size:60px;font-weight:900;opacity:0}
#sub{left:60px;right:60px;top:1344px;font-size:40px;font-weight:700;color:#e8ecf7;opacity:0}
#src{left:60px;right:140px;top:1410px;font-size:30px;font-weight:700;color:#c3cbe0;opacity:0;line-height:1.3}
#g{left:60px;right:60px;top:150px;text-align:center;font-size:${l==='ru'?84:92}px;font-weight:900;opacity:0;line-height:1.1}
#g u{text-decoration:none;color:#ffb347}
#cta{left:0;right:0;top:385px;text-align:center;opacity:0}
#cta span{display:inline-block;font-size:76px;font-weight:900;background:#ff7a59;color:#fff;border-radius:44px;padding:18px 54px;box-shadow:0 16px 50px #ff7a5977}
${process.env.DARK==='1'?'':`
/* light theme = site palette «A · Доверие» (24.11.2026) */
html,body{color:#0f1d3a;background:#ffffff}
body{background:radial-gradient(1200px 900px at 50% 38%,#ffffff 0%,#fbfaf7 60%,#f3f4f6 100%)}
.grid{background-image:linear-gradient(#0f1d3a08 2px,transparent 2px),linear-gradient(90deg,#0f1d3a08 2px,transparent 2px)}
i{color:#f97316}
#pain{text-shadow:none}
#box{border-color:#f97316;box-shadow:0 0 0 14px #f9731622,0 24px 60px rgba(15,29,58,.12)}
.find{color:#c76a00}.q{color:#0f1d3a}.car{background:#f97316}
#btn{background:#f97316;box-shadow:0 16px 40px #f9731655}
#cnt{color:#c76a00}
.win{background:#ffffff;border:4px solid #e5e7eb;box-shadow:0 24px 70px rgba(15,29,58,.14)}
.bar{background:#0f1d3a}.tab{background:#ffffff;color:#0f1d3a}.cc{background:#0f1d3a}
.sf{border-color:#f97316}.mag{border-color:#0f1d3a}.wq{color:#0f1d3a}
.row{background:#f9fafb;border-color:transparent}.th{background:#e5e7eb}.l1{background:#d1d5db!important}.l2{background:#e5e7eb!important}
#rip{border-color:#f97316}
#pb{background:#e5e7eb}#pf{background:linear-gradient(90deg,#f59e0b,#f97316)}
#big{color:#f97316;text-shadow:none}
#found span{background:#0b7a55;box-shadow:0 20px 50px #0b7a5555}
.chk:after{border-color:#0b7a55}
#ph{border-color:#ffffff;box-shadow:0 0 0 4px #e5e7eb,0 24px 70px rgba(15,29,58,.18)}
#price{background:#f97316;box-shadow:0 16px 44px rgba(15,29,58,.25);top:1005px;font-size:150px}
#ttl{color:#0f1d3a}#sub{color:#55627d}#src{color:#55627d}
#g u{color:#f97316}
#cta span{background:#f97316;box-shadow:0 16px 44px #f9731655}
`}
</style></head><body><div class="grid"></div>
<div class="abs" id="pain">${d.pain}</div>
<div class="abs" id="box"><div class="find">${d.find}</div><div class="q"><span id="qt"></span><span class="car" id="car"></span></div></div>
<div class="abs" id="btn">${d.btn}</div>
<div class="abs" id="hdr">${d.hdr}</div><div class="abs" id="cnt"></div>
${wins}
<svg class="abs" id="cur" viewBox="0 0 24 24"><path d="M4 2l15 11-7 1 4 8-3 1.5-4-8-5 5z" fill="#fff" stroke="#0b1020" stroke-width="1.6" stroke-linejoin="round"/></svg><div class="abs" id="rip"></div>
<div class="abs" id="pb"><div id="pf"></div></div><div class="abs" id="pt"><span id="pl"></span><span id="pp"></span></div>
<div class="abs" id="big"></div>
<div class="abs" id="found"><span><em class="chk"></em>${d.found}</span></div>
<div class="abs" id="ph"></div><div class="abs" id="price">${v.price}</div>
<div class="abs" id="ttl">${v.title}</div><div class="abs" id="sub">${d.sub}</div><div class="abs" id="src">${d.src}</div>
<div class="abs" id="g">${d.g1}<br><u>${d.g2}</u></div><div class="abs" id="cta"><span>findorfree.com</span></div>
<div class="abs" id="flash"></div>
<script>
const TL=${JSON.stringify(TL)},Q=${JSON.stringify(d.q)},Q2=${JSON.stringify(d.q2)},W=${JSON.stringify(v.wins)},HD=${JSON.stringify(d.hdr)},CHK=${JSON.stringify(d.chk)};
const $=id=>document.getElementById(id);const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));const k=(t,a,b)=>cl((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);const back=x=>{const c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
function S(id,o,tr){const e=$(id);e.style.opacity=o;if(tr!==undefined)e.style.transform=tr;}
window.setT=t=>{
 // --- A: pain + box typing
 const inA=t<TL.B, inE2=t>=TL.box2;
 const sl=k(t,0,0.2);S('pain',inA?1-k(t,TL.B-0.12,TL.B):0,'scale('+(1.06-0.06*eo(sl))+')');
 let boxO=0,boxT='none',txt='';
 if(inA){boxO=1-k(t,TL.B-0.12,TL.B);const n=Math.floor(cl((t-TL.typ0)/(TL.typ1-TL.typ0))*(Q.length-1))+(t>=TL.typ0?1:0);txt=Q.slice(0,n);
  const p=k(t,TL.enter,TL.enter+0.16);boxT='scale('+(1-0.03*Math.sin(p*Math.PI))+')';}
 else if(inE2){const p=back(k(t,TL.box2,TL.box2+0.3));boxO=k(t,TL.box2,TL.box2+0.12);boxT='translateY('+(1-p)*500+'px)';
  const n=t>=TL.typ2?Math.floor((t-TL.typ2)/0.05)+1:0;txt=Q2.slice(0,n);}
 S('box',boxO,boxT);$('qt').textContent=txt;$('car').style.opacity=(Math.floor(t*4)%2===0||txt.length>0&&t<TL.typ1+0.1||t>=TL.typ2)?1:0.15;
 const bp=k(t,TL.enter,TL.enter+0.18);S('btn',inA?1-k(t,TL.B-0.12,TL.B):0,'scale('+(1-0.12*Math.sin(bp*Math.PI))+')');
 $('btn').style.background=bp>0&&bp<1?'#f59e0b':'#f97316';
 // --- B: windows
 const inB=t>=TL.B&&t<TL.D;
 const hO=inB?k(t,TL.B,TL.B+0.15)*(1-k(t,TL.D-0.12,TL.D)):0;
 S('hdr',hO);$('hdr').textContent=t<TL.C?HD:CHK;
 const wi=cl(Math.floor((t-TL.B)/TL.win),0,W.length-1);S('cnt',t<TL.C?hO:0);$('cnt').textContent=(wi+1)+' / '+W.length+' · '+W[wi][1];
 let cx=900,cy=1500,co=0,ro=0,rs=1;
 W.forEach((w,i)=>{const t0=TL.B+TL.win*i,last=i===W.length-1;const p=k(t,t0,t0+0.2),q=last?k(t,TL.C+0.05,TL.C+0.4):k(t,t0+TL.win-0.02,t0+TL.win+0.16);
  let o=0,tr='none';
  if(t>=t0&&q<1){o=1;const x=(1-back(p))*1100, r=(1-p)*8;
   if(last)tr='translateX('+x+'px) rotate('+r+'deg) scale('+(1-0.55*eo(q))+') translateY('+(-200*eo(q))+'px)';else tr='translateX('+(x-eo(q)*1200)+'px) rotate('+(r-eo(q)*8)+'deg)';
   if(last)o=1-q;}
  S('w'+i,o,tr);
  const n=Math.floor(cl((t-t0-0.12)/0.3)*w[2].length);$('wq'+i).textContent=t>=t0?w[2].slice(0,n):'';
  for(let r=0;r<4;r++){const e=$('r'+i+'_'+r);const rp=k(t,t0+0.3+r*0.05,t0+0.42+r*0.05);e.style.opacity=rp;e.style.transform='translateY('+(1-rp)*40+'px)';
   const hit=r===1&&t>=t0+0.56;e.style.borderColor=hit?'#f97316':'transparent';e.style.background=hit?'#fff4e6':'#f9fafb';}
  if(t>=t0&&t<t0+TL.win+(last?0.3:0)){const m=eo(k(t,t0+0.2,t0+0.54));cx=880-m*420;cy=1420-m*(1420-915);co=k(t,t0+0.15,t0+0.25)*(last?1-k(t,TL.C,TL.C+0.2):1);
   const c=k(t,t0+0.56,t0+0.8);if(c>0&&c<1){ro=1-c;rs=0.4+c*1.3;}}
 });
 S('cur',co,'translate('+cx+'px,'+cy+'px)');S('rip',ro,'translate('+(cx-52)+'px,'+(cy-55)+'px) scale('+rs+')');
 // progress
 let pct=0;if(t>=TL.B)pct=t<TL.C?70*eo(k(t,TL.B,TL.C)):70+30*Math.pow(k(t,TL.C,TL.D-0.05),2);
 const pO=inB?k(t,TL.B,TL.B+0.15)*(1-k(t,TL.D-0.08,TL.D)):0;S('pb',pO*(t<TL.C+0.3?1:1));S('pt',t<TL.C?pO:pO*(1-k(t,TL.C,TL.C+0.2)));
 $('pf').style.width=pct+'%';$('pp').textContent=Math.round(pct)+'%';$('pl').textContent='●'.repeat(1+Math.floor(t*6)%3);
 const bg=k(t,TL.C+0.1,TL.C+0.35);const pulse=1+0.05*Math.sin(t*38)*k(t,TL.C+0.4,TL.D);S('big',t<TL.D?bg:0,'scale('+(0.6+0.4*eo(bg))*pulse+')');$('big').textContent=Math.round(pct)+'%';
 // --- D: found
 const inD=t>=TL.D&&t<TL.E+0.25;const out=1-k(t,TL.E,TL.E+0.2);const up='translateY('+(-140*eo(k(t,TL.E,TL.E+0.2)))+'px)';
 const fl=k(t,TL.D-0.04,TL.D+0.3);S('flash',fl>0&&fl<1?(fl<0.15?fl/0.15:1-(fl-0.15)/0.85)*0.95:0);
 const f=k(t,TL.D,TL.D+0.28);S('found',inD?cl(f*3)*out:0,'scale('+(f<1?2.2-1.2*back(f):1+0.025*Math.sin((t-TL.D)*7))+') rotate(-3deg) '+up);
 const ph=k(t,TL.D+0.1,TL.D+0.42);S('ph',inD?cl(ph*3)*out:0,'scale('+(0.5+0.5*back(ph))*(1+0.045*k(t,TL.D+0.4,TL.E))+') rotate('+(1.5-1.5*ph)+'deg) '+up);
 const st=k(t,TL.stamp,TL.stamp+0.22);S('price',inD?cl(st*4)*out:0,'scale('+(st<1?2.6-1.6*back(st):1)+') rotate(-6deg) '+up);
 const a=k(t,TL.D+0.75,TL.D+0.95),b=k(t,TL.D+0.95,TL.D+1.15),c2=k(t,TL.D+1.1,TL.D+1.3);
 S('ttl',inD?a*out:0,'translateY('+(1-eo(a))*40+'px)');S('sub',inD?b*out:0,'translateY('+(1-eo(b))*40+'px)');S('src',inD?c2*out:0);
 // --- E: guarantee + cta + box again (loop)
 const g=k(t,TL.E+0.1,TL.E+0.35),c=k(t,TL.E+0.3,TL.E+0.58);
 S('g',g,'translateY('+(1-back(g))*60+'px)');S('cta',cl(c*3),'scale('+(c<1?0.5+0.5*back(c):1+0.03*Math.sin((t-TL.E)*8))+')');
};
</script></body></html>`;}
(async()=>{const want=process.argv[2];const stills=process.argv[3]==='stills';
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const key of Object.keys(V))for(const l of ['en','ru']){const name=key+'_'+l;if(want&&want!==name)continue;
 fs.writeFileSync('events_'+name+'.json',JSON.stringify(events(V[key],l)));
 fs.writeFileSync(name+'.html',html(V[key],l));fs.rmSync('f_'+name,{recursive:true,force:true});fs.mkdirSync('f_'+name);
 await pg.goto('file://'+process.cwd()+'/'+name+'.html');await pg.waitForTimeout(700);
 const frames=stills?[0,20,42,48,60,70,84,115,132,150,165,176,186,200,240,256,268,285,299]:[...Array(300).keys()];
 for(const i of frames){await pg.evaluate(t=>window.setT(t),i/30);
  await pg.screenshot({path:`f_${name}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:stills?72:93});}
 console.log('done',name);}
await b.close();})();
