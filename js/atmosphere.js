/* Атмосфера: грязь и кровь, фонарик, сбои экрана, пасхалка, звук */
/* грязь и кровь, рисуются кодом */
function grimeTex(w,h,seed,o){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),R=rng(seed);
  for(let i=0;i<(o.dirt||40);i++){const g=x.createRadialGradient(0,0,0,0,0,1);const a=(o.dirtA||.12)*R();g.addColorStop(0,`rgba(${o.dr||60},${o.dg||42},${o.db||22},${a})`);g.addColorStop(1,'rgba(0,0,0,0)');
    x.save();x.translate(R()*w,R()*h);x.scale(20+R()*w*.25,10+R()*h*.18);x.rotate(R()*3);x.fillStyle=g;x.beginPath();x.arc(0,0,1,0,7);x.fill();x.restore()}
  for(let s=0;s<(o.blood||2);s++){const cx=o.edge?(R()<.5?R()*w*.25:w-R()*w*.25):R()*w,cy=o.edge?(R()<.5?R()*h*.3:h-R()*h*.3):R()*h,r=(o.size||30)*(.6+R()*.8),col=o.col||'110,8,10';
    x.fillStyle=`rgba(${col},${o.bA||.75})`;x.beginPath();for(let k=0;k<=24;k++){const a=k/24*6.283,rr=r*(.7+R()*.5);k?x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):x.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.fill();
    for(let d=0;d<30;d++){const a=R()*6.283,dist=r*(1.1+R()*2.6),dr=R()*r*.16+.8;x.globalAlpha=.4+R()*.5;x.beginPath();x.arc(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist,dr,0,7);x.fill()}
    x.globalAlpha=1;for(let k=0;k<(o.drips||3);k++){const dx=cx+(R()-.5)*r*1.2,len=r*(1+R()*3),dw=1.5+R()*r*.12;x.fillRect(dx-dw/2,cy,dw,len);x.beginPath();x.arc(dx,cy+len,dw*.9,0,7);x.fill()}}
  return c.toDataURL('image/png')}
(function(){
  document.getElementById('grime').style.backgroundImage=`url(${grimeTex(1200,800,77,{dirt:70,dirtA:.22,dr:30,dg:26,db:24,blood:3,edge:true,size:38,col:'80,4,8',bA:.55,drips:4})})`;
  const stains=[0,1,2,3,4,5].map(i=>grimeTex(420,300,100+i*13,{dirt:26,dirtA:.35,blood:i%3===0?2:1,size:16+i*3,col:'110,10,8',bA:.7,drips:i%2?2:0}));
  const st=document.createElement('style');st.textContent=stains.map((u,i)=>`.note:nth-child(6n+${i+1}){--stain:url(${u})}`).join('')+`.fact{--fstain:url(${grimeTex(900,200,5,{dirt:30,dirtA:.3,dr:20,dg:18,db:18,blood:1,size:18,col:'90,6,8',bA:.5,drips:2})})}`;document.head.appendChild(st);
})();

(function(){
  const reduceM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* фото в шапках разделов */
  const MAP={timeline:'m_tape',games:'m_pins',people:'m_missing',films:'m_tv',viruses:'m_steps',places:'m_flash',orgs:'m_spider'};
  document.querySelectorAll('.view').forEach(v=>{const k=MAP[v.dataset.view];if(!k)return;const d=document.createElement('div');d.className='mood';d.setAttribute('aria-hidden','true');d.style.backgroundImage=`url(${MOOD[k]})`;v.prepend(d)});
  document.getElementById('homeBg').style.backgroundImage=`url(${MOOD.m_tape})`;
  const fs=document.createElement('style');fs.textContent=`.fact::before{background-image:url(${MOOD.m_paper})}`;document.head.appendChild(fs);
  /* фонарик на главном экране */
  const hero=document.querySelector('.hero'),fl=document.getElementById('flash');
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();fl.style.setProperty('--fx',(e.clientX-r.left)+'px');fl.style.setProperty('--fy',(e.clientY-r.top)+'px')});
  if(!reduceM&&matchMedia('(hover: none)').matches){let t=0;(function sway(){t+=.012;fl.style.setProperty('--fx',(50+30*Math.sin(t))+'%');fl.style.setProperty('--fy',(45+15*Math.sin(t*1.7))+'%');requestAnimationFrame(sway)})()}
  /* случайные сбои экрана и пульс */
  const ecg=document.getElementById('ecg'),ecgT=document.getElementById('ecgT');
  function glitch(){document.body.classList.add('glitching');if(Math.random()<.5){document.body.classList.remove('alarm');void document.body.offsetWidth;document.body.classList.add('alarm')}ecg.classList.add('danger');ecgT.textContent='DANGER';
    setTimeout(()=>document.body.classList.remove('glitching'),340);setTimeout(()=>{ecg.classList.remove('danger');ecgT.textContent='FINE'},1600)}
  if(!reduceM)(function loop(){setTimeout(()=>{glitch();loop()},12000+Math.random()*14000)})();
  /* пасхалка: три клика по штампу */
  let clicks=0;document.querySelector('.stamp').addEventListener('click',()=>{if(++clicks<3)return;clicks=0;const j=document.createElement('div');j.className='jump';j.style.backgroundImage=`url(${MOOD.m_hands})`;document.body.appendChild(j);glitch();setTimeout(()=>j.remove(),800)});
  /* звук: дождь и гул, создаются прямо в браузере */
  let ctx=null,master=null;const sb=document.getElementById('snd');
  function startSound(){
    ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
    const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let last=0;
    for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}
    const rain=ctx.createBufferSource();rain.buffer=buf;rain.loop=true;const bp=ctx.createBiquadFilter();bp.type='lowpass';bp.frequency.value=1400;
    const rg=ctx.createGain();rg.gain.value=.4;rain.connect(bp).connect(rg).connect(master);rain.start();
    [55,55.7,82.4].forEach((f,i)=>{const o=ctx.createOscillator();o.type=i==2?'triangle':'sine';o.frequency.value=f;const g=ctx.createGain();g.gain.value=i==2?.03:.09;
      const l=ctx.createOscillator();l.frequency.value=.07+i*.05;const lg=ctx.createGain();lg.gain.value=.04;l.connect(lg).connect(g.gain);l.start();o.connect(g).connect(master);o.start()});
    (function beat(){if(!ctx)return;const t=ctx.currentTime;[0,.28].forEach(dt=>{const o=ctx.createOscillator();o.frequency.setValueAtTime(70,t+dt);o.frequency.exponentialRampToValueAtTime(40,t+dt+.15);const g=ctx.createGain();g.gain.setValueAtTime(.0001,t+dt);g.gain.exponentialRampToValueAtTime(.35,t+dt+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dt+.2);o.connect(g).connect(master);o.start(t+dt);o.stop(t+dt+.25)});setTimeout(beat,1400)})();
    /* далёкие стоны зомби */
    function groan(){
      if(!ctx||ctx.state!=='running')return;
      const t=ctx.currentTime,dur=1.4+Math.random()*1.8,f0=85+Math.random()*45;
      const src=ctx.createOscillator();src.type='sawtooth';
      src.frequency.setValueAtTime(f0*1.15,t);src.frequency.linearRampToValueAtTime(f0,t+dur*.35);src.frequency.linearRampToValueAtTime(f0*.72,t+dur);
      const vib=ctx.createOscillator();vib.frequency.value=5+Math.random()*4;const vg=ctx.createGain();vg.gain.value=4+Math.random()*5;vib.connect(vg).connect(src.frequency);
      const nb=ctx.createBufferSource();nb.buffer=buf;nb.playbackRate.value=.6;const ng=ctx.createGain();ng.gain.value=.25;
      const f1=ctx.createBiquadFilter();f1.type='bandpass';f1.frequency.setValueAtTime(420+Math.random()*120,t);f1.frequency.linearRampToValueAtTime(320,t+dur);f1.Q.value=4;
      const f2=ctx.createBiquadFilter();f2.type='bandpass';f2.frequency.value=900+Math.random()*200;f2.Q.value=6;
      const mix=ctx.createGain();const env=ctx.createGain();env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(.55+Math.random()*.3,t+.3);env.gain.setValueAtTime(.5,t+dur*.6);env.gain.exponentialRampToValueAtTime(.0001,t+dur);
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;
      const pan=ctx.createStereoPanner?ctx.createStereoPanner():null;
      src.connect(mix);nb.connect(ng).connect(mix);mix.connect(f1);mix.connect(f2);f1.connect(env);f2.connect(env);env.connect(lp);
      if(pan){pan.pan.value=Math.random()*1.6-.8;lp.connect(pan).connect(master)}else lp.connect(master);
      src.start(t);vib.start(t);nb.start(t);src.stop(t+dur+.1);vib.stop(t+dur+.1);nb.stop(t+dur+.1);
    }
    (function groanLoop(){setTimeout(()=>{if(!ctx)return;groan();if(Math.random()<.35)setTimeout(groan,500+Math.random()*700);groanLoop()},3500+Math.random()*6000)})();
    setTimeout(groan,1800);
    master.gain.linearRampToValueAtTime(.5,ctx.currentTime+2);
  }
  sb.addEventListener('click',()=>{
    if(!ctx){try{startSound()}catch(e){sb.textContent='ЗВУК НЕДОСТУПЕН';return}sb.setAttribute('aria-pressed','true');sb.innerHTML='ЗВУК<span class="long">: ВКЛ</span>';return}
    if(ctx.state==='running'){ctx.suspend();sb.setAttribute('aria-pressed','false');sb.innerHTML='ЗВУК<span class="long">: ВЫКЛ</span>'}else{ctx.resume();sb.setAttribute('aria-pressed','true');sb.innerHTML='ЗВУК<span class="long">: ВКЛ</span>'}
  });
})();
