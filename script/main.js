
// ━━━━ CURSOR ━━━━
const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
let mx=0,my=0,dx=0,dy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur2.style.left=mx+'px';cur2.style.top=my+'px'});
(function animC(){dx+=(mx-dx)*.13;dy+=(my-dy)*.13;cur.style.left=dx+'px';cur.style.top=dy+'px';requestAnimationFrame(animC)})();
document.querySelectorAll('a,button,.svc,.pcard,.tcard,.sbox,.citem').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

// ━━━━ NAV SCROLL ━━━━
const nav=document.getElementById('nav');
const stt=document.getElementById('stt');
window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  nav.classList.toggle('scrolled',s>50);
  stt.classList.toggle('show',s>400);
});

// ━━━━ NEURAL NET BG ━━━━
(()=>{
  const c=document.getElementById('c-net'),ctx=c.getContext('2d');
  let W,H,pts;
  function init(){
    W=c.width=window.innerWidth;H=c.height=window.innerHeight;
    pts=Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+.5}));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,212,255,.65)';ctx.fill();
    });
    for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){
      const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<130){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(0,212,255,${.12*(1-d/130)})`;ctx.lineWidth=.5;ctx.stroke();}
    }}
    requestAnimationFrame(draw);
  }
  init();draw();
  window.addEventListener('resize',init);
})();

// ━━━━ CODE RAIN ━━━━
(()=>{
  const c=document.getElementById('c-rain'),ctx=c.getContext('2d');
  let W,H,cols,drops;
  const chars='01ABCDEF</>{}[];()★◆■';
  function init(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;cols=Math.floor(W/14);drops=Array(cols).fill(1);}
  function draw(){ctx.fillStyle='rgba(2,11,24,.055)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#00d4ff';ctx.font='12px Share Tech Mono';
    drops.forEach((y,i)=>{ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*14,y*14);if(y*14>H&&Math.random()>.975)drops[i]=0;drops[i]++;});
  }
  init();setInterval(draw,55);window.addEventListener('resize',init);
})();

// ━━━━ PERSPECTIVE GRID ━━━━
(()=>{
  const c=document.getElementById('c-grid'),ctx=c.getContext('2d');
  let W,H,off=0;
  function init(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  function draw(){
    ctx.clearRect(0,0,W,H);off=(off+.3)%60;
    const vp={x:W/2,y:H*.55};
    const rows=12,cols=20,fz=800;
    for(let r=0;r<=rows;r++){
      const y=H*.55+((r/rows)*H*.7+off*4)-off*4;
      const scale=fz/(fz+(y-vp.y));
      const xw=W*scale;
      ctx.beginPath();ctx.moveTo(vp.x-xw/2,y);ctx.lineTo(vp.x+xw/2,y);
      ctx.strokeStyle=`rgba(0,85,255,${.15*scale})`;ctx.lineWidth=scale;ctx.stroke();
    }
    for(let col=0;col<=cols;col++){
      const t=col/cols;
      const x0=W*t;
      ctx.beginPath();ctx.moveTo(x0,H*.55);
      const steps=20;
      for(let s=0;s<=steps;s++){
        const r=s/steps;
        const y=H*.55+r*H*.7;
        const scale=fz/(fz+(y-vp.y));
        const cx=vp.x+(x0-vp.x)*scale;
        ctx.lineTo(cx,y);
      }
      ctx.strokeStyle='rgba(0,85,255,.12)';ctx.lineWidth=.5;ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  init();draw();window.addEventListener('resize',init);
})();

// ━━━━ HERO 3D TILT ━━━━
const logo3di=document.getElementById('logo3di');
document.addEventListener('mousemove',e=>{
  const rx=(e.clientY/window.innerHeight-.5)*25;
  const ry=(e.clientX/window.innerWidth-.5)*25;
  logo3di.style.transform=`perspective(600px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
});

// ━━━━ TYPEWRITER ━━━━
const el=document.getElementById('typeEl');
const phrases=['Criador de Sites Incríveis','Especialista em E-commerce','Desenvolvedor Full Stack','Designer de Experiências Digitais','Transformador de Ideias em Código'];
let pi=0,ci=0,del=false;
function type(){
  const ph=phrases[pi];
  if(!del){el.innerHTML=ph.slice(0,ci)+'<span class="cursor-blink"></span>';ci++;if(ci>ph.length){del=true;setTimeout(type,2000);return;}}
  else{el.innerHTML=ph.slice(0,ci)+'<span class="cursor-blink"></span>';ci--;if(ci<0){del=false;pi=(pi+1)%phrases.length;setTimeout(type,500);return;}}
  setTimeout(type,del?40:85);
}
type();

// ━━━━ INTERSECTION OBSERVER ━━━━
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      if(e.target.closest('#about'))triggerCounters();
      if(e.target.closest('#skills'))triggerSkills();
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el,i)=>{
  el.style.transitionDelay=(i%4)*.08+'s';
  io.observe(el);
});

// ━━━━ COUNTERS ━━━━
let countersRan=false;
function triggerCounters(){
  if(countersRan)return;countersRan=true;
  document.querySelectorAll('.snum[data-t]').forEach(el=>{
    const t=+el.dataset.t;let n=0;
    const iv=setInterval(()=>{n+=t/60;if(n>=t){n=t;clearInterval(iv);}
      el.textContent=Math.floor(n)+(t===100?'%':'+');},20);
  });
}

// ━━━━ SKILL BARS ━━━━
let skillsRan=false;
function triggerSkills(){
  if(skillsRan)return;skillsRan=true;
  document.querySelectorAll('.skfill').forEach(el=>{el.style.width=el.dataset.w+'%';});
}

// ━━━━ PORTFOLIO FILTER ━━━━
function pf(btn,cat){
  document.querySelectorAll('.pfbtn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.pcard').forEach((c,i)=>{
    const show=cat==='all'||c.dataset.c===cat;
    c.style.transition='all .4s ease '+(i*.05)+'s';
    c.style.opacity=show?'1':'0';
    c.style.transform=show?'scale(1)':'scale(.95)';
    c.style.pointerEvents=show?'all':'none';
    setTimeout(()=>c.style.display=show?'block':'none',show?0:400);
    if(show)setTimeout(()=>{c.style.opacity='1';c.style.transform='scale(1)'},50);
  });
}

// ━━━━ CONTACT FORM ━━━━
function doSend(e){
  e.preventDefault();
  const btn=document.getElementById('sbtn');
  btn.textContent='⏳ PROCESSANDO...';btn.disabled=true;
  const steps=['VALIDANDO DADOS...','CRIPTOGRAFANDO...','TRANSMITINDO...','RECEBIDO COM SUCESSO!'];
  let si=0;
  const iv=setInterval(()=>{
    if(si>=steps.length-1){clearInterval(iv);btn.textContent='✅ MENSAGEM ENVIADA!';btn.style.background='linear-gradient(135deg,#00ff88,#00aa55)';
      setTimeout(()=>{btn.textContent='⚡ ENVIAR MENSAGEM';btn.style.background='';btn.disabled=false;e.target.reset();},3500);}
    else{btn.textContent=steps[si];si++;}
  },500);
}

// ━━━━ TILT CARDS ━━━━
document.querySelectorAll('.svc,.tcard,.pcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateZ(8px) translateY(-8px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='perspective(900px) rotateX(0) rotateY(0) translateZ(0)';});
});

// ━━━━ SMOOTH SCROLL ━━━━
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'});});
});

// ━━━━ HAMBURGER MENU ━━━━
const hbg=document.getElementById('hbg');
const navlinks=document.getElementById('navlinks');
hbg.addEventListener('click',()=>{
  hbg.classList.toggle('open');
  navlinks.classList.toggle('open');
});
navlinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{hbg.classList.remove('open');navlinks.classList.remove('open');});
});
document.addEventListener('click',e=>{
  if(!hbg.contains(e.target)&&!navlinks.contains(e.target)){hbg.classList.remove('open');navlinks.classList.remove('open');}
});

// ━━━━ CSS INJECTIONS ━━━━
const s=document.createElement('style');
s.textContent=`
@keyframes rs{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;
document.head.appendChild(s);