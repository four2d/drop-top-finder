const $=s=>document.querySelector(s),f=n=>Number(n||0).toLocaleString('en-GB'),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G={mx5:{n:'Mazda MX-5',roof:'Soft-top',fun:9,tips:['Rust: sills, rear arches, front chassis rails','NC: check hood drain holes and rear-window crease','Clutch & diff whine on high milers','Cheap parts, huge club scene']},
boxster:{n:'Porsche Boxster',roof:'Soft-top',fun:9,tips:['986/987 2.7/3.2: ask about IMS bearing & bore scoring','Coolant radiators rot behind front bumper','Hood frame/plastic window wear','Specialist service history is gold']},
z4:{n:'BMW Z4',roof:'Soft-top',fun:8,tips:['E85: check electric power steering & hood pump','Run-flat tyres ride hard — budget for swaps','Straight-six (2.5/3.0) is the one','E89 has a folding hard-top']},
slk:{n:'Mercedes SLK',roof:'Folding hard-top',fun:6,tips:['Vario roof hydraulics: test several cycles','Rust on boot lid & wheel arches (R170)','Kompressor whine is normal; rattles aren\'t','Great all-year cruiser']},
tt:{n:'Audi TT Roadster',roof:'Soft-top',fun:7,tips:['Mk2: check DSG/S-tronic history','Coil packs & water pumps on 1.8T/2.0T','quattro = all-weather grip','Hood mechanism on electric cars']},
mr2:{n:'Toyota MR2 Roadster',roof:'Soft-top',fun:9,tips:['Pre-cat failure can kill the engine — check','Oil consumption on early cars','Light, mid-engined, brilliant','Tiny boot — truly a toy']}};
const gk=c=>G[c.model_key]||{n:c.make_model,roof:'Convertible',fun:7,tips:[]};
const make=c=>(c.make_model||'').split(' ')[0];
function rate(c,all){ // optional extra fields win: rating, verdict, roof
 const g=gk(c),age=2026-(c.year||2005),ppm=c.price/Math.max(1,c.mileage||1);
 let s=g.fun*0.45+(10-Math.min(10,(c.mileage||100000)/15000))*0.25+(c.service_history&&/full/i.test(c.service_history)?1.2:0)+(c.owners&&c.owners<=3?.8:0)+(10-c.price/1000)*0.15+(c.distance_from_poole_miles<40?.5:0);
 c.score=c.rating!=null?+c.rating:Math.max(4,Math.min(9.6,Math.round(s*10)/10));
 c.roof=c.roof||g.roof;
 if(!c.verdict){const m=c.mileage<50000?'low-mile':c.mileage>110000?'well-used but':'honest';
  c.verdict=c.score>=8?`A ${m} ${g.n} that nails the brief — go and see it.`:c.score>=7?`Solid ${g.n}; ${c.service_history?c.service_history.toLowerCase()+' history':'ask for history'} seals it.`:`Cheap thrills, but check the paperwork twice.`;}
}
const card=c=>`<article class="card"><a class="ph" href="${E(c.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${E(c.image)}" alt="${E(c.year+' '+c.make_model)}"><span class="price">£${f(c.price)}</span><span class="score">${c.score.toFixed(1)}</span></a><div class="cb"><h4>${E(c.year)} ${E(c.make_model)}</h4><p class="vd">“${E(c.verdict)}”</p><div class="meta">${f(c.mileage)} mi · ${E(c.engine)} ${E(c.gearbox)} · ${E(c.roof)}<br>📍 ${E(c.location)} · ${E(c.distance_from_poole_miles)} mi from Poole · ${E(c.seller)}</div><a class="go" href="${E(c.url)}" target="_blank" rel="noopener">View advert →</a></div></article>`;
let D=[],F={};
fetch('listings.json?'+Date.now()).then(r=>r.json()).then(d=>{D=d.cars||[];D.forEach(c=>rate(c,D));
 $('#issue').textContent=`Issue of ${d.updated||''} · ${D.length} cars · ${d.search||''}`;
 const by=(a,b)=>b.score-a.score,top=[...D].sort(by),p=top[0];
 if(p)$('#pick').innerHTML=`<a href="${E(p.url)}" target="_blank" rel="noopener"><img src="${E(p.image)}" alt=""></a><div><span class="tag">Pick of the week</span><h1>${E(p.year)} ${E(p.make_model)}, £${f(p.price)}</h1><p class="vd">“${E(p.verdict)}”</p><p class="meta">Rated <b>${p.score.toFixed(1)}/10</b> · ${f(p.mileage)} miles · ${E(p.engine)} ${E(p.gearbox)} · ${E(p.owners)} owners · ${E(p.service_history)} history · ${E(p.location)} (${E(p.distance_from_poole_miles)} mi)</p><p><a class="chip on" href="${E(p.url)}" target="_blank" rel="noopener" style="text-decoration:none">See the advert →</a></p></div>`;
 const NI=new Set(d.new_ids||[]),NW=D.filter(c=>c.new_today===true||NI.has(c.url)).sort(by);
 const why=c=>{const r=[];if(c.mileage<50000)r.push('low miles');if(/full/i.test(c.service_history||''))r.push('full history');if(c.owners&&c.owners<=2)r.push(c.owners+' owner'+(c.owners>1?'s':''));if(c.distance_from_poole_miles<40)r.push('close to Poole');if(c.price<5000)r.push('bargain price');return (r.length?r.slice(0,3).join(', ').replace(/^./,x=>x.toUpperCase())+'. ':'')+c.verdict};
 $('#new').innerHTML=`<h2 class="kicker">New today${NW.length?' <small>('+NW.length+')</small>':''}</h2>`+(NW.length?`<div class="newrow">${NW.map(c=>`<a class="nc" href="${E(c.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${E(c.image)}" alt=""><div><b>${E(c.year)} ${E(c.make_model)}</b> <span class="np">£${f(c.price)}</span><div class="meta">${f(c.mileage)} mi · 📍 ${E(c.location)}, ${E(c.distance_from_poole_miles)} mi from Poole · ${c.score.toFixed(1)}/10</div><div class="why">${E(why(c))}</div><span class="go">View advert →</span></div></a>`).join('')}</div>`:'<p class="sd empty">No new arrivals today. Check back after tomorrow\'s 12pm refresh.</p>');
 const u3=D.filter(c=>c.price<3000),cheap=u3.length?u3:[...D].sort((a,b)=>a.price-b.price).slice(0,4);
 const S=[[u3.length?'Under £3k heroes':'Bargain heroes',u3.length?'Proper fun for pocket money.':'Nothing under £3k in this search (it starts at £4k) — so here are the cheapest gems.',cheap],
  ['Best MX-5s','The answer is always Miata. Our top-rated examples.',D.filter(c=>c.model_key=='mx5')],
  ['Posh for less','Boxster, Z4, SLK and TT badges for Fiesta money.',D.filter(c=>['boxster','z4','slk','tt'].includes(c.model_key))],
  ['Weekend toys','Mid-engined, manual, maximum grin.',D.filter(c=>c.model_key=='mr2'||c.model_key=='boxster'||(/manual/i.test(c.gearbox)&&gk(c).fun>=9))]];
 $('#sections').innerHTML=S.map(([t,d,L])=>L.length?`<h2 class="kicker">${t}</h2><p class="sd">${d}</p><div class="row">${[...L].sort(by).slice(0,4).map(card).join('')}</div>`:'').join('');
 $('#guideGrid').innerHTML=Object.entries(G).filter(([k])=>D.some(c=>c.model_key==k)).map(([k,g])=>{const L=D.filter(c=>c.model_key==k),pr=L.map(c=>c.price);return `<div class="guide"><h3>${g.n}</h3><div class="gm">${g.roof} · Fun ${g.fun}/10 · ${L.length} for sale £${f(Math.min(...pr))}–£${f(Math.max(...pr))}</div><ul>${g.tips.map(t=>`<li>${E(t)}</li>`).join('')}</ul><button data-k="${k}">Show all ${L.length} →</button></div>`}).join('');
 document.querySelectorAll('.guide button').forEach(b=>b.onclick=()=>{F={model:b.dataset.k};chips();draw();location.hash='all'});
 chips();draw();$('#sort').onchange=draw;
}).catch(e=>$('#issue').textContent='Could not load listings.json: '+e);
const bands=[['u5','Under £5k',c=>c.price<5000],['5-7','£5–7k',c=>c.price>=5000&&c.price<7000],['7-10','£7–10k',c=>c.price>=7000]];
function chips(){const mk=[...new Set(D.map(make))].sort(),rf=[...new Set(D.map(c=>c.roof))];
 const ch=(g,v,l)=>`<button class="chip${F[g]==v?' on':''}" data-g="${g}" data-v="${E(v)}">${E(l)}</button>`;
 $('#chips').innerHTML='<span>Price</span>'+bands.map(b=>ch('band',b[0],b[1])).join('')+'<span>Make</span>'+mk.map(m=>ch('make',m,m)).join('')+'<span>Roof</span>'+rf.map(r=>ch('roof',r,r)).join('')+(Object.keys(F).length?'<button class="chip" data-g="x">✕ Clear</button>':'');
 document.querySelectorAll('#chips .chip').forEach(b=>b.onclick=()=>{const g=b.dataset.g,v=b.dataset.v;if(g=='x')F={};else if(F[g]==v)delete F[g];else F[g]=v;chips();draw()});}
function draw(){let L=D.filter(c=>(!F.band||bands.find(b=>b[0]==F.band)[2](c))&&(!F.make||make(c)==F.make)&&(!F.roof||c.roof==F.roof)&&(!F.model||c.model_key==F.model));
 const s=$('#sort').value;L.sort(s=='score'?(a,b)=>b.score-a.score:s=='price'?(a,b)=>a.price-b.price:s=='-price'?(a,b)=>b.price-a.price:s=='mileage'?(a,b)=>a.mileage-b.mileage:(a,b)=>a.distance_from_poole_miles-b.distance_from_poole_miles);
 $('#cnt').textContent=L.length+' cars';$('#grid').innerHTML=L.map(card).join('')||'<p>No cars match — loosen the filters.</p>';}
