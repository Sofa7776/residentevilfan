/* Логика сайта: переключение разделов, окна, карусель, микроскоп, фильмы */
/* =====================================================================
   УТИЛИТЫ
   ===================================================================== */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000}}
const rgba=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
function galleryHTML(list){return `<div class="gallery">${list.map(([k,c,cr])=>`<button class="gal-item" data-lb="${k}" data-cap="${esc(c+(cr?' · '+cr:''))}"><img src="${IMG[k]}" alt="${esc(c)}" loading="lazy"><span><b>${c}</b>${cr?cr:''}</span></button>`).join('')}</div>`}
function stag(el){[...el.children].forEach((c,i)=>c.style.setProperty('--i',i))}

const lb=document.getElementById('lightbox');
document.addEventListener('click',e=>{const t=e.target.closest('[data-lb]');if(!t)return;e.stopPropagation();document.getElementById('lbImg').src=IMG[t.dataset.lb];document.getElementById('lbImg').alt=t.dataset.cap;document.getElementById('lbCap').textContent=t.dataset.cap;lb.hidden=false},true);
lb.addEventListener('click',()=>{lb.hidden=true});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden){lb.hidden=true;e.stopImmediatePropagation()}},true);
/* =====================================================================
   НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
   ===================================================================== */
const VIEWS=['home','timeline','games','people','films','viruses','places','orgs','favs'];
const nav=$('.nav'), burger=$('#burger');
let current=null;
function go(v,push=true){
  if(!VIEWS.includes(v))v='home';
  if(v===current)return;
  $$('.view').forEach(s=>{const on=s.dataset.view===v;s.hidden=!on;s.classList.toggle('enter',on)});
  $$('.tabs button').forEach(b=>{if(b.dataset.go===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  current=v;
  const tb=document.querySelector(`.tabs button[data-go="${v}"]`);document.title=v==='home'?'Досье Resident Evil':`${tb?tb.textContent:''} · Досье Resident Evil`;
  nav.classList.remove('open');burger.setAttribute('aria-expanded','false');
  if(push){try{history.replaceState(null,'','#'+v)}catch(e){}}
  window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  if(v==='viruses')startScope();else stopScope();
  if(v==='places')drawSlides();
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go]');if(t){e.preventDefault();go(t.dataset.go)}});
burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Закрыть меню':'Открыть меню')});
addEventListener('hashchange',()=>go(location.hash.slice(1),false));

/* =====================================================================
   ГЛАВНАЯ
   ===================================================================== */
const FOLDERS=[['timeline','01','Хронология','21 событие от 1950-х до 2026 года'],['games','02','Части серии','13 дел: что раскрыла каждая игра'],['people','03','Персонажи','12 личных дел, подробнее всех — Леон'],['films','04','Фильмы','14 экранизаций: канон и кино'],['viruses','05','Вирусы','7 образцов под живым микроскопом'],['places','06','Места','7 мест катастроф в карусели'],['orgs','07','Организации','8 сил — от «Амбреллы» до «Связей»'],['favs','08','Любимчики','8 героев и монстров, которых обожает фандом']];
$('#folders').innerHTML=FOLDERS.map(([v,n,t,p])=>`<button class="folder" data-go="${v}"><span class="num">ПАПКА ${n}</span><h3>${t}</h3><p>${p}</p><span class="go">Открыть →</span></button>`).join('');
$('#folders').classList.add('stagger');stag($('#folders'));

const PHRASES=['Как исследование одного африканского цветка превратилось в шестьдесят лет биологических катастроф.','От особняка в горах Арклей до руин Раккун-Сити, куда герои вернулись спустя 28 лет.','Откройте папку — и узнайте, что скрывала каждая часть серии.'];
(function typer(){
  const el=$('#typed');let p=0,i=0,del=false;
  if(reduce){el.textContent=PHRASES[0];return}
  function tick(){
    const s=PHRASES[p];
    el.innerHTML=esc(s.slice(0,i))+'<span class="cursor"></span>';
    if(!del){i++;if(i>s.length){del=true;return setTimeout(tick,2600)}}
    else{i-=3;if(i<=0){i=0;del=false;p=(p+1)%PHRASES.length}}
    setTimeout(tick,del?14:32);
  }
  el.innerHTML=esc(PHRASES[0])+'<span class="cursor"></span>';i=PHRASES[0].length;del=false;setTimeout(()=>{del=true;tick()},3200);
})();
if(!reduce)$$('[data-count]').forEach(el=>{const n=+el.dataset.count,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)});
let fi=Math.floor(Math.random()*FACTS.length);function showFact(){const p=$('#fact');p.textContent=FACTS[fi];$('#factN').textContent=`Файл ${String(fi+1).padStart(2,'0')} из ${FACTS.length}`;p.classList.remove('swap');void p.offsetWidth;p.classList.add('swap');fi=(fi+1+Math.floor(Math.random()*(FACTS.length-2)))%FACTS.length}
showFact();$('#factBtn').addEventListener('click',showFact);

document.getElementById('heroBg').style.backgroundImage=`url(${IMG.hero_rpd})`;
/* дождь */
const rc=$('#rain'),rx=rc.getContext('2d');let drops=[];
function sizeRain(){rc.width=rc.offsetWidth;rc.height=rc.offsetHeight;drops=Array.from({length:Math.round(rc.width/6)},()=>({x:Math.random()*rc.width,y:Math.random()*rc.height,l:8+Math.random()*18,v:6+Math.random()*8}))}
function rain(){if(current==='home'||!current){rx.clearRect(0,0,rc.width,rc.height);rx.strokeStyle='rgba(150,170,160,.35)';rx.beginPath();
  for(const d of drops){rx.moveTo(d.x,d.y);rx.lineTo(d.x-2,d.y+d.l);if(!reduce){d.y+=d.v;d.x-=.6;if(d.y>rc.height){d.y=-20;d.x=Math.random()*rc.width}}}rx.stroke()}
  if(!reduce)requestAnimationFrame(rain)}
sizeRain();rain();addEventListener('resize',sizeRain);

/* =====================================================================
   ХРОНОЛОГИЯ
   ===================================================================== */
let era='all';
$('#eraChips').innerHTML=ERAS.map(([k,t])=>`<button class="chip" data-era="${k}" aria-pressed="${k==='all'}">${t}</button>`).join('');
$('#eraChips').addEventListener('click',e=>{const b=e.target.closest('[data-era]');if(!b)return;era=b.dataset.era;$$('#eraChips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderTL()});
function renderTL(){
  const tl=$('#tl');
  tl.innerHTML=EVENTS.filter(e=>era==='all'||e.era===era).map((e,i)=>`
   <li class="ev${e.key?' key':''}">
     <button class="head" aria-expanded="false" aria-controls="ev${i}"><span class="yr">${e.y}</span><h3>${e.t}</h3><span class="plus" aria-hidden="true">+</span></button>
     <div class="more" id="ev${i}"><div><div class="in"><p>${e.d}</p>${e.g?`<div><button class="btn btn-ghost btn-sm" data-game="${e.g}">Открыть дело: ${GAME[e.g].title} →</button></div>`:''}</div></div></div>
   </li>`).join('');
  tl.classList.remove('stagger');void tl.offsetWidth;tl.classList.add('stagger');stag(tl);
  tl.style.animation='none';void tl.offsetWidth;tl.style.animation='';
}
$('#tl').addEventListener('click',e=>{const h=e.target.closest('.head');if(!h)return;const li=h.parentElement;const o=li.classList.toggle('open');h.setAttribute('aria-expanded',o)});
renderTL();

/* =====================================================================
   ОБЛОЖКИ ИГР
   ===================================================================== */
function drawCover(cv,g){
  const x=cv.getContext('2d'),W=cv.width,H=cv.height,R=rng(g.rel*7+g.ord);
  const gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,rgba(g.col.map(v=>v*.55),1));gr.addColorStop(1,'#07090a');x.fillStyle=gr;x.fillRect(0,0,W,H);
  // мотив: брызги и прожилки
  for(let i=0;i<40;i++){x.beginPath();x.arc(R()*W,R()*H,2+R()*30,0,7);x.fillStyle=rgba(g.col,.04+R()*.08);x.fill()}
  x.strokeStyle=rgba(g.col,.35);x.lineWidth=1;
  for(let i=0;i<7;i++){x.beginPath();let px=R()*W,py=H;x.moveTo(px,py);for(let k=0;k<12;k++){px+=(R()-.5)*50;py-=H/12;x.lineTo(px,py)}x.stroke()}
  // большой номер
  x.font=`${W*.62}px "Russo One", "Arial Black", sans-serif`;x.textAlign='right';x.textBaseline='bottom';
  x.fillStyle=rgba(g.col.map(v=>Math.min(255,v+40)),.92);x.fillText(g.n,W-W*.06,H*.98);
  x.globalCompositeOperation='overlay';x.fillStyle='rgba(255,255,255,.15)';for(let i=0;i<H;i+=4)x.fillRect(0,i,W,1);x.globalCompositeOperation='source-over';
  // маркировка
  x.textAlign='left';x.textBaseline='top';x.font='bold 15px "PT Mono", monospace';x.fillStyle='rgba(230,230,220,.85)';
  x.fillText('ДЕЛО №'+String(g.ord).padStart(3,'0'),18,18);x.fillStyle=rgba(g.col.map(v=>Math.min(255,v+60)),1);x.fillText(String(g.rel),18,40);
  // значок биоугрозы
  x.save();x.translate(W-40,40);x.strokeStyle='rgba(230,230,220,.6)';x.lineWidth=3;[[0,-9],[-8,6],[8,6]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,10,0,7);x.stroke()});x.restore();
}

/* =====================================================================
   ИГРЫ И МОДАЛЬНОЕ ОКНО
   ===================================================================== */
let order='story';
$('#orderChips').innerHTML=[['story','По сюжету'],['release','По году выхода']].map(([k,t])=>`<button class="chip" data-order="${k}" aria-pressed="${k===order}">${t}</button>`).join('');
$('#orderChips').addEventListener('click',e=>{const b=e.target.closest('[data-order]');if(!b)return;order=b.dataset.order;$$('#orderChips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderGames()});
function sortedGames(){return [...GAMES].sort((a,b)=>order==='story'?a.ord-b.ord:a.rel-b.rel||a.ord-b.ord)}
function renderGames(){
  const el=$('#games');
  el.innerHTML=sortedGames().map(g=>`<button class="game" data-game="${g.id}" aria-label="Открыть дело ${esc(g.title)}"><div class="cover">${IMG['g_'+g.id]?`<img src="${IMG['g_'+g.id]}" alt="${esc(g.title)}" loading="lazy"><span class="tag-ov"><span>ДЕЛО №${String(g.ord).padStart(3,'0')}</span><span>${g.rel}</span></span>`:`<canvas width="300" height="400" data-cover="${g.id}"></canvas>`}<span class="open-hint">Открыть дело →</span></div><span class="t">${g.title}</span><span class="s">${g.rel} · ${g.when}</span></button>`).join('');
  el.querySelectorAll('.game').forEach(b=>{const id=b.dataset.game;const w=document.createElement('div');w.className='gwrap';b.replaceWith(w);w.appendChild(b);const r=document.createElement('button');r.className='btn btn-ghost btn-sm';r.dataset.game=id;r.dataset.tab='story';r.textContent='Подробный сюжет →';w.appendChild(r)});
  el.querySelectorAll('canvas[data-cover]').forEach(c=>drawCover(c,GAME[c.dataset.cover]));
  el.classList.remove('stagger');void el.offsetWidth;el.classList.add('stagger');stag(el);
}
renderGames();

const modal=$('#modal'),sheet=$('#sheet');let lastFocus=null;
function openModal(html,after){
  lastFocus=document.activeElement;sheet.innerHTML='<button class="close" data-close aria-label="Закрыть">×</button>'+html;
  modal.hidden=false;document.body.style.overflow='hidden';sheet.scrollTop=0;sheet.focus();after&&after();
}
function closeModal(){modal.hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus&&lastFocus.focus()}
modal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal()});
addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')closeModal()});

function castChip(id){const p=PERSON[id];if(!p)return'';return p.short?`<button class="chip" data-person="${id}">${p.name}</button>`:`<span class="chip" style="cursor:default">${p.name}</span>`}
function openGame(id,tab='plot'){
  const g=GAME[id],list=sortedGames(),i=list.findIndex(x=>x.id===id),prev=list[(i-1+list.length)%list.length],next=list[(i+1)%list.length];
  const nNotes=(STORY[g.id]||[]).reduce((a,c)=>a+c.notes.length,0);const TABS=[['plot','Кратко'],...(GAL[g.id]?[['gallery',`Кадры · ${GAL[g.id].length}`]]:[]),['story','Подробный сюжет'+(nNotes?` · ${nNotes} зап.`:'')],['reveals','Что раскрыто'],['cast','Персонажи']];
  openModal(`
   <div class="sheet-head">${IMG['g_'+g.id]?`<img class="head-img" src="${IMG['g_'+g.id]}" alt="${esc(g.title)}">`:`<canvas width="300" height="400" id="mCover"></canvas>`}
     <div><span class="label">Дело №${String(g.ord).padStart(3,'0')} · ${g.rel}</span><h2 id="mTitle">${g.title}</h2>
     <div class="meta"><span>Когда: <b>${g.when}</b></span><span>Где: <b>${g.where}</b></span><span>Герои: <b>${g.hero}</b></span></div></div></div>
   <div class="stabs" role="tablist">${TABS.map(([k,t])=>`<button role="tab" data-tab="${k}" aria-selected="${k===tab}">${t}</button>`).join('')}</div>
   <div class="spanel" id="spanel"></div>
   <div class="sheet-foot"><button class="btn btn-ghost btn-sm" data-game="${prev.id}">← ${prev.title}</button><button class="btn btn-ghost btn-sm" data-game="${next.id}">${next.title} →</button></div>`,
   ()=>{const c=$('#mCover');if(c)drawCover(c,g);fillTab(g,tab)});
  const switchTab=k=>{sheet.querySelectorAll('.stabs button').forEach(x=>x.setAttribute('aria-selected',x.dataset.tab===k));fillTab(g,k)};
  sheet.querySelector('.stabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)switchTab(b.dataset.tab)});
  sheet.querySelector('#spanel').addEventListener('click',e=>{const b=e.target.closest('[data-totab]');if(b){switchTab(b.dataset.totab);sheet.querySelector('.stabs').scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'})}});
}
function fillTab(g,tab){
  const p=$('#spanel');
  if(tab==='plot'){p.innerHTML=g.plot.map(t=>`<p>${t}</p>`).join('')+(STORY[g.id]?`<div><button class="btn btn-main btn-sm" data-totab="story">Читать подробный сюжет по главам →</button></div>`:'');}
  if(tab==='story')renderReader(g,0);
  if(tab==='gallery')p.innerHTML=`<p class="muted">Нажмите на кадр, чтобы открыть его крупно.</p>${galleryHTML(GAL[g.id])}`;
  if(tab==='reveals')p.innerHTML=`<p class="muted">Что эта часть впервые рассказала о мире серии:</p><ul class="reveal-list">${g.reveals.map((t,i)=>`<li style="animation-delay:${i*70}ms"><b>${String(i+1).padStart(2,'0')}</b><span>${t}</span></li>`).join('')}</ul>`;
  if(tab==='cast')p.innerHTML=`<p class="muted">Нажмите на имя, чтобы открыть личное дело.</p><div class="cast">${g.cast.map(castChip).join('')}</div>`;
}
const readSet={};
function renderReader(g,i){
  const ch=STORY[g.id],c=ch[i],p=$('#spanel');(readSet[g.id]=readSet[g.id]||new Set()).add(i);
  p.innerHTML=`<div class="reader">
   <div class="chapters" role="tablist" aria-label="Главы">${ch.map((x,k)=>`<button data-ch="${k}" aria-current="${k===i}" class="${readSet[g.id].has(k)?'read':''}">${k+1}. ${x.h}</button>`).join('')}</div>
   <div class="rprog" aria-hidden="true"><i style="transform:scaleX(${(i+1)/ch.length})"></i></div>
   <article class="chapter"><span class="cnum">Глава ${i+1} из ${ch.length}</span><h3>${c.h}</h3>${c.p.map(t=>`<p>${t}</p>`).join('')}
    ${c.notes.length?`<span class="label" style="margin-top:8px">Найдено в игре</span><div class="notes">${c.notes.map((n,k)=>`<div class="note" style="--r:${k%2?.7:-.6}deg"><div class="nt">${n.t}</div><div class="nw">${n.w}</div><p>${n.s}</p><div class="nsrc">пересказ записки</div></div>`).join('')}</div>`:''}
   </article>
   <div class="rnav"><button class="btn btn-ghost btn-sm" data-ch="${i-1}" ${i===0?'disabled style="visibility:hidden"':''}>← Предыдущая глава</button>
    ${i<ch.length-1?`<button class="btn btn-main btn-sm" data-ch="${i+1}">Следующая глава: ${ch[i+1].h} →</button>`:`<button class="btn btn-main btn-sm" data-totab="reveals">Что раскрыла эта часть →</button>`}</div></div>`;
  p.querySelectorAll('[data-ch]').forEach(b=>b.addEventListener('click',()=>{renderReader(g,+b.dataset.ch);sheet.querySelector('.stabs').scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'})}));
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-game]');if(t)openGame(t.dataset.game,t.dataset.tab||'plot');const pp=e.target.closest('[data-person]');if(pp)openPerson(pp.dataset.person)});

/* =====================================================================
   ПЕРСОНАЖИ: «отпечатки» вместо фото
   ===================================================================== */
function drawPrint(cv,seed,hue){
  const x=cv.getContext('2d'),W=cv.width,H=cv.height,R=rng(seed);
  x.fillStyle='#d9d3c2';x.fillRect(0,0,W,H);
  // бумага
  for(let i=0;i<1800;i++){x.fillStyle=`rgba(80,70,50,${R()*.06})`;x.fillRect(R()*W,R()*H,1.5,1.5)}
  // сетка картотеки
  x.strokeStyle='rgba(120,110,90,.25)';x.lineWidth=1;for(let i=0;i<W;i+=24){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}
  // отпечаток пальца
  const cx=W*(.38+R()*.1),cy=H*.52,a=R()*.5-.25,k=.7+R()*.2;
  x.save();x.translate(cx,cy);x.rotate(a);
  for(let r=6;r<H*.42;r+=5){
    x.beginPath();
    for(let t=0;t<=6.3;t+=.05){
      const w=1+Math.sin(t*3+seed+r*.07)*.05+Math.sin(t*7+r*.2)*.02;
      const px=Math.cos(t)*r*k*w,py=Math.sin(t)*r*1.25*w;
      if(Math.sin(t*5+r*.31+seed)>.82){x.moveTo(px,py);continue}
      t===0?x.moveTo(px,py):x.lineTo(px,py)}
    x.strokeStyle=`rgba(30,26,22,${.55+R()*.25})`;x.lineWidth=1.6;x.stroke();
  }
  x.restore();
  // штамп-пятно цвета дела
  x.globalCompositeOperation='multiply';
  x.fillStyle=`hsla(${hue},55%,55%,.35)`;x.beginPath();x.arc(W*.8,H*.3,40+R()*20,0,7);x.fill();
  x.globalCompositeOperation='source-over';
  // скрепка
  x.strokeStyle='rgba(120,125,130,.9)';x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(W-48,-10,18,60,9):x.rect(W-48,-10,18,60);x.stroke();
  // подпись
  x.fillStyle='rgba(40,34,28,.8)';x.font='12px "PT Mono", monospace';x.fillText('ОБРАЗЕЦ · Л/Д '+(1000+seed*37),14,H-14);
}
let side='all';
$('#sideChips').innerHTML=[['all','Все'],['hero','Герои'],['grey','Двойная игра'],['villain','Антагонисты']].map(([k,t])=>`<button class="chip" data-side="${k}" aria-pressed="${k==='all'}">${t}</button>`).join('');
$('#sideChips').addEventListener('click',e=>{const b=e.target.closest('[data-side]');if(!b)return;side=b.dataset.side;$$('#sideChips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderPeople()});
function renderPeople(){
  const el=$('#people');
  el.innerHTML=PEOPLE.filter(p=>side==='all'||p.side===side).map(p=>`<button class="card${p.featured?' featured':''}" data-person="${p.id}" aria-label="Открыть дело: ${esc(p.name)}">
    <div class="photo">${PHOTOS[p.id]?`<img src="${IMG[PHOTOS[p.id].main]}" alt="${esc(p.name)}" loading="lazy">`:`<canvas width="${p.featured?640:400}" height="${p.featured?480:300}" data-print="${p.id}"></canvas><span class="redact">ФОТО НЕТ</span><span class="initials">${p.ini}</span>`}</div>
    <div class="txt"><span class="r">${p.role}</span><h3>${p.name}</h3><p class="p">${p.short}</p></div></button>`).join('');
  el.querySelectorAll('canvas[data-print]').forEach(c=>{const p=PERSON[c.dataset.print];drawPrint(c,p.seed,p.side==='villain'?5:p.side==='grey'?300:40)});
  el.classList.remove('stagger');void el.offsetWidth;el.classList.add('stagger');stag(el);
}
renderPeople();
function openPerson(id){
  const p=PERSON[id];if(!p||!p.bio)return;
  openModal(`
   <div class="sheet-head">${PHOTOS[id]?`<img class="head-img" src="${IMG[PHOTOS[id].main]}" alt="${esc(p.name)}">`:`<canvas width="300" height="400" id="mPrint"></canvas>`}
    <div><span class="label">Личное дело · ${p.role}</span><h2 id="mTitle">${p.name}</h2><p class="muted" style="margin-top:10px">${p.short}</p></div></div>
   <div class="spanel person-body">
    <div class="factrow">${p.facts.map(([k,v])=>`<div><span>${k}</span>${v}</div>`).join('')}</div>
    <h3 style="font-size:20px">Биография</h3>
    <ol class="bio-tl">${p.bio.map(([y,t],i)=>`<li style="animation-delay:${i*80}ms"><span class="y">${y}</span><span>${t}</span></li>`).join('')}</ol>
    ${PHOTOS[id]?`<h3 style="font-size:20px">Фото из архива</h3><p class="muted" style="margin-top:-8px">Нажмите на фото, чтобы открыть его крупно.</p>${galleryHTML(PHOTOS[id].gal)}`:''}
    <h3 style="font-size:20px">Появляется в</h3>
    <div class="cast">${p.games.map(g=>`<button class="chip" data-game="${g}">${GAME[g].title}</button>`).join('')}</div>
   </div>`,()=>{const c=$('#mPrint');if(c)drawPrint(c,p.seed,p.side==='villain'?5:p.side==='grey'?300:40)});
}

/* =====================================================================
   ВИРУСЫ: живой микроскоп
   ===================================================================== */
let vSel=VIRUSES[1],scopeRAF=null,bgCache={};
const sc=$('#scope'),sx=sc.getContext('2d');
$('#vlist').innerHTML=VIRUSES.map(v=>`<button class="vbtn" role="tab" data-v="${v.id}" style="--c:${rgba(v.c,1)}" aria-selected="${v===vSel}"><i></i><span>${v.name}</span></button>`).join('');
$('#vlist').addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;vSel=VIRUSES.find(v=>v.id===b.dataset.v);$$('.vbtn').forEach(x=>x.setAttribute('aria-selected',x===b));renderVinfo();if(reduce)frame(0)});
function renderVinfo(){
  const v=vSel;
  $('#vinfo').innerHTML=`<div class="txt"><span class="label">${v.type} · ${v.year}</span><h3>${v.name}</h3>${v.txt.map(t=>`<p>${t}</p>`).join('')}</div>
   <dl class="spec"><dt>Автор</dt><dd>${v.by}</dd><dt>Передача</dt><dd>${v.vec}</dd><dt>Итог</dt><dd>${v.res}</dd><dt>Угроза</dt><dd class="meter"><i style="transform:scaleX(0)"></i></dd></dl>`;
  $('#vinfo').classList.remove('stagger');void $('#vinfo').offsetWidth;$('#vinfo').classList.add('stagger');stag($('#vinfo'));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const m=$('#vinfo .meter i');if(m)m.style.transform=`scaleX(${v.lvl})`}));
  $('#hudL').textContent='ОБРАЗЕЦ: '+v.name.replace(/[«»]/g,'').toUpperCase();$('#hudR').textContent=v.mag;
  buildParticles();
}
let parts=[];
function buildParticles(){const v=vSel,R=rng(v.year+v.id.length*13),W=sc.width,H=sc.height;parts=[];
  const n=v.count||0;for(let k=0;k<n;k++){const r=v.r?v.r[0]+R()*(v.r[1]-v.r[0]):0;parts.push({x:80+R()*(W-160),y:70+R()*(H-140),r,ph:R()*6.28,sp:.3+R()*.5,rot:R()*6.28,dots:Array.from({length:6},()=>[(R()-.5),(R()-.5),.08+R()*.12])})}
  if(v.style==='mold'){parts=[];const br=(px,py,a,len,w,d)=>{if(d>7||w<.4)return;const nx=px+Math.cos(a)*len,ny=py+Math.sin(a)*len;parts.push({x1:px,y1:py,x2:nx,y2:ny,w,d,knob:R()<.35});br(nx,ny,a+(R()-.5)*.9,len*.85,w*.78,d+1);if(R()<.6)br(nx,ny,a+(R()<.5?-1:1)*(.5+R()*.6),len*.75,w*.7,d+1)};for(let i=0;i<10;i++)br(W/2+(R()-.5)*80,H/2+(R()-.5)*60,R()*6.28,48+R()*30,6,0)}
}
function bg(v){if(bgCache[v.id])return bgCache[v.id];const c=document.createElement('canvas');c.width=sc.width;c.height=sc.height;const x=c.getContext('2d'),R=rng(v.year),W=c.width,H=c.height;
  const g=x.createRadialGradient(W/2,H/2,20,W/2,H/2,W*.65);g.addColorStop(0,rgba(v.c.map(q=>q*.22),1));g.addColorStop(1,rgba(v.c.map(q=>q*.06),1));x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let i=0;i<16;i++){x.beginPath();x.arc(R()*W,R()*H,30+R()*110,0,7);x.fillStyle=rgba(v.c,.03+R()*.05);x.fill()}
  const im=x.getImageData(0,0,W,H),d=im.data;for(let i=0;i<d.length;i+=4){const n=(R()-.5)*20;d[i]+=n;d[i+1]+=n;d[i+2]+=n}x.putImageData(im,0,0);
  return bgCache[v.id]=c}
function frame(t){
  const v=vSel,x=sx,W=sc.width,H=sc.height,T=t/1000;
  x.drawImage(bg(v),0,0);
  if(v.style==='mold'){
    const grow=reduce?1:Math.min(1,(T%9)/5);
    parts.forEach(p=>{if(p.d/7>grow)return;x.beginPath();x.moveTo(p.x1,p.y1);x.lineTo(p.x2,p.y2);x.strokeStyle=rgba([180,180,170],.25+p.d*.07);x.lineWidth=p.w;x.stroke();if(p.knob){x.beginPath();x.arc(p.x2,p.y2,p.w*2.2+Math.sin(T*2+p.d)*.6,0,7);x.fillStyle='rgba(225,215,195,.55)';x.fill()}});
  } else if(v.style==='worm'){
    parts.forEach((p,k)=>{let px=W*(.2+k*.3),py=H*.15,a=1.5;
      for(let s=0;s<80;s++){const tt=s/80,w=30*(1-tt*.8);a+=Math.sin(s*.16+k+T*1.4)*.11;px+=Math.cos(a)*5;py+=Math.sin(a)*5;
        x.beginPath();x.arc(px,py,w/2,0,7);x.fillStyle=rgba(v.c.map(q=>q*(.55+tt*.55)),.92);x.fill();if(s%5===0){x.strokeStyle='rgba(40,10,20,.5)';x.lineWidth=2;x.stroke()}}
      for(let j=0;j<6;j++){const bx=W*(.2+k*.3),by=H*.15;x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+Math.sin(T*2+j)*60,by-30,bx+(j-2.5)*28+Math.sin(T*3+j)*14,by-60);x.strokeStyle=rgba(v.c,.7);x.lineWidth=2;x.stroke()}});
  } else {
    parts.forEach(p=>{
      const cx=p.x+Math.sin(T*p.sp+p.ph)*14,cy=p.y+Math.cos(T*p.sp*.8+p.ph)*10,r=p.r*(1+Math.sin(T*2+p.ph)*.03),rot=p.rot+T*.25*p.sp;
      const halo=x.createRadialGradient(cx,cy,r*.6,cx,cy,r*1.9);halo.addColorStop(0,rgba(v.c,.25));halo.addColorStop(1,rgba(v.c,0));x.fillStyle=halo;x.beginPath();x.arc(cx,cy,r*1.9,0,7);x.fill();
      if(v.style==='tendril'){for(let s=0;s<9;s++){const a=rot+s/9*6.28;x.beginPath();x.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
        x.bezierCurveTo(cx+Math.cos(a+.5)*r*1.6,cy+Math.sin(a+.5)*r*1.6,cx+Math.cos(a-.4+Math.sin(T*2+s)*.3)*r*1.9,cy+Math.sin(a-.4)*r*1.9,cx+Math.cos(a+Math.sin(T+s)*.5)*r*2.3,cy+Math.sin(a+Math.sin(T+s)*.5)*r*2.3);x.strokeStyle='rgba(20,20,26,.95)';x.lineWidth=5;x.stroke()}}
      else if(v.spikes){for(let s=0;s<v.spikes;s++){const a=rot+s/v.spikes*6.283,len=v.style==='petal'?r*.55:r*.36;const sx1=cx+Math.cos(a)*r,sy1=cy+Math.sin(a)*r,ex=cx+Math.cos(a)*(r+len),ey=cy+Math.sin(a)*(r+len);
        x.strokeStyle=rgba(v.c,.85);x.lineWidth=v.style==='petal'?6:2;x.beginPath();x.moveTo(sx1,sy1);if(v.style==='flame')x.quadraticCurveTo(sx1+Math.cos(a+.6+Math.sin(T*3+s)*.3)*len,sy1+Math.sin(a+.6)*len,ex,ey);else x.lineTo(ex,ey);x.stroke();
        x.beginPath();x.arc(ex,ey,v.style==='petal'?6:3.2,0,7);x.fillStyle=rgba(v.c.map(q=>Math.min(255,q+50)),.95);x.fill()}}
      const body=x.createRadialGradient(cx-r*.35,cy-r*.35,r*.1,cx,cy,r);
      const base=v.style==='tendril'?[70,70,82]:v.c;
      body.addColorStop(0,rgba(base.map(q=>Math.min(255,q+70)),1));body.addColorStop(.7,rgba(base,.96));body.addColorStop(1,rgba(base.map(q=>q*.35),1));x.fillStyle=body;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();
      if(v.style==='eye'){const blink=Math.max(.08,Math.abs(Math.sin(T*.7+p.ph)));x.beginPath();x.ellipse(cx,cy,r*.45,r*.3*blink,p.rot,0,7);x.fillStyle='rgba(250,220,150,.95)';x.fill();
        x.beginPath();x.arc(cx+Math.sin(T+p.ph)*r*.12,cy,r*.15*Math.min(1,blink*2),0,7);x.fillStyle='rgba(30,5,0,.95)';x.fill()}
      else p.dots.forEach(([dx,dy,s])=>{x.beginPath();x.arc(cx+dx*r*Math.cos(rot*.3),cy+dy*r,r*s,0,7);x.fillStyle=rgba(base.map(q=>q*.4),.55);x.fill()});
    });
  }
  // сканирующая линия
  if(!reduce){const ly=(T*80)%H;const lg=x.createLinearGradient(0,ly-30,0,ly);lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(1,rgba(v.c,.18));x.fillStyle=lg;x.fillRect(0,ly-30,W,30)}
  x.fillStyle='rgba(230,230,220,.85)';x.fillRect(W-170,H-34,120,4);x.font='15px "PT Mono", monospace';x.fillText(v.style==='worm'?'100 мкм':v.style==='mold'?'10 мкм':'100 нм',W-170,H-44);
}
function loop(t){frame(t);scopeRAF=requestAnimationFrame(loop)}
function startScope(){if(scopeRAF)return;if(reduce){frame(0);return}scopeRAF=requestAnimationFrame(loop)}
function stopScope(){if(scopeRAF)cancelAnimationFrame(scopeRAF);scopeRAF=null}
renderVinfo();

/* =====================================================================
   МЕСТА: сцены и карусель
   ===================================================================== */
function sky(x,W,H,a,b){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,W,H)}
function stars(x,W,H,R,n){for(let i=0;i<n;i++){x.fillStyle=`rgba(230,230,220,${.2+R()*.6})`;x.fillRect(R()*W,R()*H*.55,1.4,1.4)}}
function moon(x,mx,my,r,c){const g=x.createRadialGradient(mx,my,r*.2,mx,my,r*4);g.addColorStop(0,c);g.addColorStop(.25,'rgba(220,220,200,.12)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(mx-r*4,my-r*4,r*8,r*8);x.beginPath();x.arc(mx,my,r,0,7);x.fillStyle=c;x.fill()}
function trees(x,W,H,R,base,c,n,a,b){x.fillStyle=c;for(let i=0;i<n;i++){const tx=R()*W,h=a+R()*(b-a),w=h*.32;x.beginPath();x.moveTo(tx,base-h);x.lineTo(tx-w,base);x.lineTo(tx+w,base);x.fill()}x.fillRect(0,base,W,H-base)}
function wins(x,R,bx,by,bw,bh,lit){for(let wy=by+12;wy<by+bh-10;wy+=18)for(let wx=bx+8;wx<bx+bw-10;wx+=16)if(R()<lit){x.fillStyle=`rgba(255,${170+R()*60|0},80,${.5+R()*.4})`;x.fillRect(wx,wy,7,9)}}
const SCENES={
 mansion(x,W,H){const R=rng(5);sky(x,W,H,'#0b1418','#1d2a2c');stars(x,W,H,R,120);moon(x,W*.78,H*.2,30,'#e8e4cf');trees(x,W,H,R,H*.78,'#0e1716',30,80,170);
  x.fillStyle='#090c0c';const mx=W*.24,my=H*.46,mw=W*.52,mh=H*.32;x.fillRect(mx,my,mw,mh);x.fillRect(mx+mw*.38,my-60,mw*.24,60);
  x.beginPath();x.moveTo(mx+mw*.34,my-60);x.lineTo(mx+mw*.5,my-110);x.lineTo(mx+mw*.66,my-60);x.fill();x.beginPath();x.moveTo(mx-10,my);x.lineTo(mx+mw*.2,my-40);x.lineTo(mx+mw*.38,my);x.fill();x.beginPath();x.moveTo(mx+mw*.62,my);x.lineTo(mx+mw*.8,my-40);x.lineTo(mx+mw+10,my);x.fill();
  wins(x,R,mx,my,mw,mh,.22);trees(x,W,H,R,H*.92,'#050808',22,90,200)},
 city(x,W,H){const R=rng(9);sky(x,W,H,'#120807','#5a2112');const g=x.createRadialGradient(W*.5,H*.85,10,W*.5,H*.85,W*.7);g.addColorStop(0,'rgba(255,120,40,.55)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let bx=0;bx<W;){const bw=30+R()*50,bh=80+R()*150;x.fillStyle='#24120d';x.fillRect(bx,H*.8-bh,bw,bh+H);bx+=bw+4}
  for(let bx=-10;bx<W;){const bw=40+R()*70,bh=60+R()*200;x.fillStyle='#0b0605';x.fillRect(bx,H*.9-bh,bw,bh+H);wins(x,R,bx,H*.9-bh,bw,bh,.12);bx+=bw+3}
  for(let i=0;i<40;i++){x.beginPath();x.arc(W*.3+R()*W*.5,H*.3+R()*H*.3,20+R()*50,0,7);x.fillStyle=`rgba(20,12,10,${.08+R()*.1})`;x.fill()}
  for(let i=0;i<90;i++){x.fillStyle=`rgba(255,${150+R()*80|0},60,${R()})`;x.fillRect(R()*W,H*.4+R()*H*.5,2,2)}},
 island(x,W,H){const R=rng(13);sky(x,W,H,'#0a1016','#2b3a44');stars(x,W,H,R,60);for(let i=0;i<12;i++){x.beginPath();x.ellipse(R()*W,H*.15+R()*H*.25,80+R()*120,14+R()*12,0,0,7);x.fillStyle='rgba(60,75,85,.35)';x.fill()}
  x.fillStyle='#0b1419';x.fillRect(0,H*.66,W,H);for(let i=0;i<80;i++){x.fillStyle=`rgba(140,170,180,${R()*.25})`;x.fillRect(R()*W,H*.66+R()*H*.34,10+R()*30,1.5)}
  x.fillStyle='#070b0d';x.beginPath();x.moveTo(W*.12,H*.68);x.lineTo(W*.22,H*.5);x.lineTo(W*.35,H*.46);x.lineTo(W*.6,H*.45);x.lineTo(W*.78,H*.52);x.lineTo(W*.9,H*.68);x.fill();
  x.fillRect(W*.3,H*.32,W*.32,H*.15);x.fillRect(W*.36,H*.22,W*.06,H*.12);x.fillRect(W*.5,H*.26,W*.05,H*.1);wins(x,R,W*.3,H*.32,W*.32,H*.14,.18);
  x.beginPath();x.moveTo(W*.39,H*.22);x.lineTo(W*.05,H*.02);x.lineTo(W*.12,-H*.05);x.closePath();x.fillStyle='rgba(230,230,200,.12)';x.fill()},
 spain(x,W,H){const R=rng(21);sky(x,W,H,'#1d1a22','#6b4a3a');moon(x,W*.2,H*.22,26,'#f0d9b0');
  x.fillStyle='#2a1f1c';x.beginPath();x.moveTo(0,H*.62);for(let i=0;i<=10;i++)x.lineTo(W*i/10,H*(.5+R()*.1));x.lineTo(W,H);x.lineTo(0,H);x.fill();
  // замок
  x.fillStyle='#120d0c';x.fillRect(W*.55,H*.28,W*.3,H*.26);[[.55,.18],[.66,.12],[.78,.2]].forEach(([a,b])=>{x.fillRect(W*a,H*b,W*.05,H*.14);for(let k=0;k<3;k++)x.fillRect(W*a+k*W*.02,H*b-8,W*.012,8)});wins(x,R,W*.55,H*.28,W*.3,H*.25,.15);
  // деревенские домики и вилы-силуэты
  for(let i=0;i<7;i++){const hx=R()*W*.5,hw=40+R()*40,hy=H*.8;x.fillStyle='#0c0908';x.fillRect(hx,hy-34,hw,44);x.beginPath();x.moveTo(hx-5,hy-34);x.lineTo(hx+hw/2,hy-52);x.lineTo(hx+hw+5,hy-34);x.fill();if(R()<.5){x.fillStyle='rgba(255,170,80,.75)';x.fillRect(hx+hw*.4,hy-20,7,9)}}
  x.fillStyle='#0c0908';x.fillRect(0,H*.86,W,H);
  const fg=x.createRadialGradient(W*.25,H*.85,5,W*.25,H*.85,120);fg.addColorStop(0,'rgba(255,140,50,.5)');fg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=fg;x.fillRect(0,H*.6,W*.6,H*.4)},
 desert(x,W,H){const R=rng(25);sky(x,W,H,'#e8a34a','#5a2a14');const s=x.createRadialGradient(W*.65,H*.55,10,W*.65,H*.55,200);s.addColorStop(0,'rgba(255,240,200,1)');s.addColorStop(.12,'rgba(255,200,120,.9)');s.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=s;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(60,25,10,.45)';x.beginPath();x.moveTo(0,H*.66);x.quadraticCurveTo(W*.3,H*.55,W*.6,H*.64);x.quadraticCurveTo(W*.85,H*.7,W,H*.6);x.lineTo(W,H);x.lineTo(0,H);x.fill();
  x.fillStyle='#2a1208';for(let bx=0;bx<W;){const bw=30+R()*60,bh=30+R()*70;x.fillRect(bx,H*.78-bh,bw,bh+H);bx+=bw+R()*30}
  // акации
  for(let i=0;i<3;i++){const tx=W*(.1+i*.35)+R()*40,ty=H*.72;x.strokeStyle='#1a0a04';x.lineWidth=5;x.beginPath();x.moveTo(tx,ty);x.lineTo(tx+6,ty-70);x.stroke();x.fillStyle='#1a0a04';x.beginPath();x.ellipse(tx+6,ty-74,60,12,0,0,7);x.fill()}
  for(let i=0;i<300;i++){x.fillStyle=`rgba(255,220,160,${R()*.2})`;x.fillRect(R()*W,R()*H,2,1)}},
 swamp(x,W,H){const R=rng(29);sky(x,W,H,'#0f1410','#3a4234');
  for(let i=0;i<5;i++){x.fillStyle=`rgba(180,190,170,${.05})`;x.fillRect(0,H*(.3+i*.08),W,H*.1)}
  trees(x,W,H,R,H*.62,'#151b14',18,90,180);
  // дом
  x.fillStyle='#0a0d09';const hx=W*.3,hy=H*.36,hw=W*.42,hh=H*.26;x.fillRect(hx,hy,hw,hh);x.beginPath();x.moveTo(hx-14,hy);x.lineTo(hx+hw/2,hy-60);x.lineTo(hx+hw+14,hy);x.fill();x.fillRect(hx-20,hy+hh-40,hw+40,8);
  for(let k=0;k<6;k++)x.fillRect(hx-18+k*(hw+36)/5,hy+hh-34,4,34);wins(x,R,hx,hy,hw,hh,.08);
  // вода и отражение
  x.fillStyle='#0b100c';x.fillRect(0,H*.64,W,H);for(let i=0;i<120;i++){x.fillStyle=`rgba(150,170,130,${R()*.18})`;x.fillRect(R()*W,H*.64+R()*H*.36,8+R()*40,1.2)}
  // мох
  for(let i=0;i<40;i++){x.strokeStyle='rgba(90,100,70,.4)';x.lineWidth=1;const mx=R()*W;x.beginPath();x.moveTo(mx,0);x.lineTo(mx+(R()-.5)*10,30+R()*80);x.stroke()}},
 village(x,W,H){const R=rng(17);sky(x,W,H,'#1c2026','#4a4f57');
  x.fillStyle='#262a30';x.beginPath();x.moveTo(W*.45,H*.55);x.lineTo(W*.58,H*.3);x.lineTo(W*.8,H*.28);x.lineTo(W*.95,H*.55);x.fill();x.fillStyle='#16191d';x.fillRect(W*.6,H*.12,W*.22,H*.18);
  [[.6,.05],[.67,0],[.74,.03],[.8,.07]].forEach(([a,b])=>{x.fillRect(W*a,H*b,W*.03,H*.15);x.beginPath();x.moveTo(W*a-4,H*b);x.lineTo(W*a+W*.015,H*b-30);x.lineTo(W*a+W*.03+4,H*b);x.fill()});wins(x,R,W*.6,H*.12,W*.22,H*.17,.25);
  trees(x,W,H,R,H*.72,'#1a1e21',26,60,120);
  for(let i=0;i<9;i++){const hx=R()*W,hw=40+R()*40,hy=H*.78;x.fillStyle='#0d0f11';x.fillRect(hx,hy-30,hw,40);x.beginPath();x.moveTo(hx-6,hy-30);x.lineTo(hx+hw/2,hy-55);x.lineTo(hx+hw+6,hy-30);x.fill();if(R()<.5){x.fillStyle='rgba(255,180,90,.7)';x.fillRect(hx+hw*.4,hy-18,7,9)}}
  x.fillStyle='#0d0f11';x.fillRect(0,H*.82,W,H);for(let i=0;i<260;i++){x.fillStyle=`rgba(240,240,240,${.3+R()*.6})`;x.beginPath();x.arc(R()*W,R()*H,R()*2+.5,0,7);x.fill()}},
};
let slide=0,slidesDrawn=false;
$('#track').innerHTML=PLACES.map((p,i)=>`<article class="slide" aria-roledescription="слайд" aria-label="${i+1} из ${PLACES.length}">${PLACE_IMG[p.scene]?`<img src="${IMG[PLACE_IMG[p.scene]]}" alt="${esc(p.name)}">`:`<canvas width="800" height="600" data-scene="${p.scene}" role="img" aria-label="Иллюстрация: ${esc(p.name)}"></canvas>`}
  <div class="stx"><span class="label">Место ${String(i+1).padStart(2,'0')}</span><h3>${p.name}</h3><span class="where">${p.where}</span><p>${p.txt}</p><div><button class="btn btn-ghost btn-sm" data-game="${p.g}">Открыть дело: ${GAME[p.g].title} →</button></div></div></article>`).join('');
$('#dots').innerHTML=PLACES.map((p,i)=>`<button aria-label="${esc(p.name)}"></button>`).join('');
function drawSlides(){if(slidesDrawn)return;slidesDrawn=true;$$('#track canvas').forEach(c=>{const x=c.getContext('2d');SCENES[c.dataset.scene](x,c.width,c.height);const v=x.createRadialGradient(c.width/2,c.height/2,c.height*.3,c.width/2,c.height/2,c.width*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=v;x.fillRect(0,0,c.width,c.height)})}
function setSlide(i){slide=(i+PLACES.length)%PLACES.length;$('#track').style.transform=`translateX(${-slide*100}%)`;$$('#dots button').forEach((d,k)=>d.setAttribute('aria-current',k===slide));$('#slCount').textContent=`${String(slide+1).padStart(2,'0')} / ${String(PLACES.length).padStart(2,'0')}`;$$('#track .slide').forEach((s,k)=>s.inert=k!==slide)}
$('#prev').addEventListener('click',()=>setSlide(slide-1));$('#next').addEventListener('click',()=>setSlide(slide+1));
$('#dots').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setSlide([...b.parentElement.children].indexOf(b))});
addEventListener('keydown',e=>{if(current!=='places'||!modal.hidden)return;if(e.key==='ArrowLeft')setSlide(slide-1);if(e.key==='ArrowRight')setSlide(slide+1)});
let sx0=null;$('#slider').addEventListener('pointerdown',e=>{sx0=e.clientX});$('#slider').addEventListener('pointerup',e=>{if(sx0===null)return;const d=e.clientX-sx0;if(Math.abs(d)>50)setSlide(slide+(d<0?1:-1));sx0=null});
setSlide(0);

/* =====================================================================
   ФИЛЬМЫ
   ===================================================================== */
function drawFrame(cv,f){
  const x=cv.getContext('2d'),W=cv.width,H=cv.height,R=rng(f.year*3+f.id.length*17);
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(f.col.map(v=>v*.5),1));g.addColorStop(1,'#050606');x.fillStyle=g;x.fillRect(0,0,W,H);
  // прожектор
  const sp=x.createRadialGradient(W*.7,H*.35,10,W*.7,H*.35,W*.6);sp.addColorStop(0,rgba(f.col.map(v=>Math.min(255,v+60)),.55));sp.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sp;x.fillRect(0,0,W,H);
  // силуэт горизонта
  x.fillStyle='rgba(0,0,0,.75)';let bx=0;while(bx<W){const bw=20+R()*50,bh=H*(.15+R()*.3);x.fillRect(bx,H-bh,bw,bh);bx+=bw+2}
  // зерно и царапины плёнки
  for(let i=0;i<500;i++){x.fillStyle=`rgba(255,255,255,${R()*.08})`;x.fillRect(R()*W,R()*H,1.5,1.5)}
  x.strokeStyle='rgba(255,255,255,.12)';for(let i=0;i<4;i++){const lx=R()*W;x.beginPath();x.moveTo(lx,0);x.lineTo(lx+(R()-.5)*8,H);x.stroke()}
  // год крупно
  x.font=`${Math.min(H*.42,W*.3)}px "Russo One","Arial Black",sans-serif`;x.textAlign='left';x.textBaseline='bottom';x.fillStyle=rgba(f.col.map(v=>Math.min(255,v+70)),.85);x.fillText(String(f.year),W*.05,H*.95);
  // маркер кадра
  x.font='bold 13px "PT Mono",monospace';x.textBaseline='top';x.fillStyle='rgba(230,230,220,.8)';
  x.fillText(f.kind==='cg'?'КАНОН · CG':f.kind==='series'?'СЕРИАЛ':'КИНО',14,12);
  x.textAlign='right';x.fillText('КАДР '+String(R()*90+10|0).padStart(2,'0')+'A',W-14,12);
}
let fkind='all';
$('#filmChips').innerHTML=FILMKINDS.map(([k,t])=>`<button class="chip" data-fk="${k}" aria-pressed="${k==='all'}">${t}</button>`).join('');
$('#filmChips').addEventListener('click',e=>{const b=e.target.closest('[data-fk]');if(!b)return;fkind=b.dataset.fk;$$('#filmChips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderFilms()});
function renderFilms(){
  const el=$('#films');const list=FILMS.filter(f=>fkind==='all'||f.kind===fkind||(fkind==='series'&&f.fmt&&f.fmt.startsWith('Мини'))).sort((a,b)=>a.year-b.year);
  $('#filmNote').textContent=FILMNOTES[fkind];
  el.innerHTML=list.map(f=>`<button class="film" data-film="${f.id}" aria-label="Открыть карточку: ${esc(f.title)}"><div class="frame poster${FILM_WIDE.has(f.id)?' wide':''}">${FILM_IMG[f.id]?`<img src="${IMG[FILM_IMG[f.id]]}" alt="${esc(f.title)}" loading="lazy">`:`<canvas width="320" height="480" data-fr="${f.id}"></canvas>`}</div>
   <span class="fy">${f.year}${f.kind==='cg'?'<span class="canon">· канон</span>':''}${f.fmt?`<span>· ${f.fmt}</span>`:''}</span><span class="ft">${f.title}</span><span class="fo">${f.orig} · реж. ${f.dir}</span></button>`).join('');
  el.querySelectorAll('canvas[data-fr]').forEach(c=>drawFrame(c,FILMS.find(f=>f.id===c.dataset.fr)));
  el.classList.remove('stagger');void el.offsetWidth;el.classList.add('stagger');stag(el);
}
renderFilms();
function filmBody(f,id){return `<div class="spanel">
     <div class="factrow"><div><span>Действие</span>${f.set}</div><div><span>Герои</span>${f.hero}</div></div>
     <h3 style="font-size:20px">Сюжет</h3><p>${f.plot}</p>
     <div class="link-box"><span class="label" style="color:var(--cyan)">Связь с играми</span><p>${f.link}</p></div>
     ${FILM_GAL[id]?`<h3 style="font-size:20px">Постеры и кадры</h3>${galleryHTML(FILM_GAL[id])}`:''}
    </div>`}
function openFilm(id){
  const f=FILMS.find(x=>x.id===id),canon=f.kind==='cg';
  const badges=`<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="badge ${canon?'c':'n'}">${canon?'Канон игр':'Отдельная вселенная'}</span>${f.fmt?`<span class="badge n">${f.fmt}</span>`:''}</div>`;
  const meta=`<span class="muted" style="font-family:var(--f-mono);font-size:13px">${f.orig} · ${f.year} · реж. ${f.dir}</span>`;
  if(FILM_WIDE.has(id)){
    openModal(`<div class="film-head"><img src="${IMG[FILM_IMG[id]]}" alt="Постер: ${esc(f.title)}" style="width:100%;display:block"><div class="fh">${badges}<h2 id="mTitle">${f.title}</h2>${meta}</div></div>`+filmBody(f,id));
  } else if(FILM_POSTER.has(id)){
    openModal(`<div class="film-poster"><img src="${IMG[FILM_IMG[id]]}" alt="Постер: ${esc(f.title)}"><div style="display:grid;gap:8px">${badges}<h2 id="mTitle" style="font-size:clamp(24px,4vw,36px)">${f.title}</h2>${meta}</div></div>`+filmBody(f,id));
  } else {
    openModal(`<div class="film-head">${FILM_IMG[id]?`<img src="${IMG[FILM_IMG[id]]}" alt="" style="width:100%;aspect-ratio:21/9;object-fit:cover;object-position:50% 25%;display:block">`:`<canvas width="1050" height="450" id="mFrame"></canvas>`}
    <div class="fh">${badges}<h2 id="mTitle">${f.title}</h2>${meta}</div></div>`+filmBody(f,id),()=>{const c=$('#mFrame');if(c)drawFrame(c,f)});
  }
}

document.addEventListener('click',e=>{const t=e.target.closest('[data-film]');if(t)openFilm(t.dataset.film)});

/* =====================================================================
   ОРГАНИЗАЦИИ
   ===================================================================== */
$('#orgs').innerHTML=ORGS.map(o=>`<button class="flip" aria-pressed="false"><div class="inner">
  <div class="face front${o.img?' has-img':''}"${o.img?` style="background-image:url(${IMG[o.img]})"`:''}><span class="tag">${o.tag}</span>${o.logo?`<div class="logo-box${o.light?' light':''}"${o.bg?` style="background:${o.bg}"`:''}><img src="${IMG[o.logo]}" alt="Эмблема ${esc(o.n)}"></div>`:''}<h3>${o.n}</h3><span class="hint">Перевернуть ↻</span></div>
  <div class="face back"><span class="tag">${o.n}</span>${o.backImg?`<img class="back-img" src="${IMG[o.backImg]}" alt="${esc(o.backCap)}">`:''}<p>${o.d}</p></div></div></button>`).join('');
stag($('#orgs'));
$('#orgs').addEventListener('click',e=>{const f=e.target.closest('.flip');if(!f)return;const on=f.classList.toggle('on');f.setAttribute('aria-pressed',on)});

/* старт */
go(VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):'home',false);
