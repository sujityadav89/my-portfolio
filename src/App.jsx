import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Custom cursor ---------------- */
function Cursor(){
  const dot = useRef(null), ring = useRef(null);
  useEffect(()=>{
    let rx=0,ry=0,mx=0,my=0;
    const move = e => { mx=e.clientX; my=e.clientY; dot.current.style.left=mx+'px'; dot.current.style.top=my+'px'; };
    window.addEventListener('mousemove', move);
    const raf = () => {
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      if(ring.current){ ring.current.style.left=rx+'px'; ring.current.style.top=ry+'px'; }
      requestAnimationFrame(raf);
    };
    raf();
    const overHandler = e => {
      if(e.target.closest('a,button,.skill-card,.work-card')) ring.current.classList.add('hover');
      else ring.current.classList.remove('hover');
    };
    window.addEventListener('mouseover', overHandler);
    return ()=>{ window.removeEventListener('mousemove',move); window.removeEventListener('mouseover',overHandler); };
  },[]);
  return (<>
    <div className="cursor-dot" ref={dot}></div>
    <div className="cursor-ring" ref={ring}></div>
  </>);
}

/* ---------------- Particle field ---------------- */
function Particles(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current, ctx = canvas.getContext('2d');
    let w,h,particles,mouse={x:-999,y:-999};
    const DPR = Math.min(window.devicePixelRatio||1,2);
    const resize = ()=>{
      w = canvas.width = window.innerWidth*DPR;
      h = canvas.height = window.innerHeight*DPR;
      canvas.style.width=window.innerWidth+'px';
      canvas.style.height=window.innerHeight+'px';
      const count = Math.min(90, Math.floor(window.innerWidth/16));
      particles = Array.from({length:count},()=>({
        x:Math.random()*w, y:Math.random()*h,
        vx:(Math.random()-.5)*.3*DPR, vy:(Math.random()-.5)*.3*DPR,
        r: (Math.random()*1.6+.6)*DPR
      }));
    };
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove', e=>{ mouse.x=e.clientX*DPR; mouse.y=e.clientY*DPR; });
    let raf;
    const tick = ()=>{
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        const dx=p.x-mouse.x, dy=p.y-mouse.y, dist=Math.hypot(dx,dy);
        if(dist<140*DPR){ p.x+=dx/dist*0.6; p.y+=dy/dist*0.6; }
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(167,139,250,0.55)';
        ctx.fill();
      });
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<110*DPR){
            ctx.strokeStyle='rgba(124,92,255,'+(1-d/(110*DPR))*0.25+')';
            ctx.lineWidth=1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  },[]);
  return <canvas id="particles" ref={ref}></canvas>;
}

/* ---------------- Nav ---------------- */
function Nav(){
  const [scrolled,setScrolled] = useState(false);
  useEffect(()=>{
    const h = ()=> setScrolled(window.scrollY>40);
    window.addEventListener('scroll',h);
    return ()=>window.removeEventListener('scroll',h);
  },[]);
  const links = ['About','Skills','Dashboard','Experience','Work','Contact'];
  return (
    <nav className={scrolled?'scrolled':''}>
      <a className="logo" href="#top">SUJIT<span>.</span>YADAV</a>
      <ul className="nav-links">
        {links.map(l=>(<li key={l}><a href={'#'+l.toLowerCase()}>{l}</a></li>))}
      </ul>
      <a className="nav-cta" href="#contact">Let's talk</a>
    </nav>
  );
}

/* ---------------- Hero ---------------- */
const ROLES = ['React.js Engineer','Next.js Developer','UI / UX Craftsman','Tailwind CSS Specialist'];
function Hero(){
  const [roleIdx,setRoleIdx] = useState(0);
  const [display,setDisplay] = useState('');
  const heroRef = useRef(null);

  useEffect(()=>{
    let i=0, deleting=false, timeout;
    const type = ()=>{
      const full = ROLES[roleIdx];
      if(!deleting){
        i++; setDisplay(full.slice(0,i));
        if(i===full.length){ deleting=true; timeout=setTimeout(type,1400); return; }
      } else {
        i--; setDisplay(full.slice(0,i));
        if(i===0){ deleting=false; setRoleIdx(r=>(r+1)%ROLES.length); return; }
      }
      timeout=setTimeout(type, deleting?35:70);
    };
    timeout=setTimeout(type,70);
    return ()=>clearTimeout(timeout);
  },[roleIdx]);

  useEffect(()=>{
    const tl = gsap.timeline({defaults:{ease:'power3.out'}});
    tl.to('.eyebrow',{opacity:1,y:0,duration:.6})
      .to('.hero h1 .line span',{y:0,opacity:1,stagger:.08,duration:.9},'-=.3')
      .to('.hero-role',{opacity:1,duration:.6},'-=.4')
      .to('.hero-sub',{opacity:1,duration:.6},'-=.4')
      .to('.hero-ctas',{opacity:1,duration:.6},'-=.4')
      .to('.hero-stats',{opacity:1,duration:.6},'-=.3');

    gsap.to('.hero-parallax',{
      yPercent:30, ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}
    });
  },[]);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-parallax">
        <p className="eyebrow">Kolhapur, Maharashtra — Available for select projects</p>
        <h1>
          <span className="line"><span>Building interfaces</span></span>
          <span className="line"><span className="accent">people remember.</span></span>
        </h1>
        <p className="hero-role">{'> '}{display}<span className="cursor-blink"></span></p>
        <p className="hero-sub">Senior UI / Front-End Developer with 8+ years turning high-fidelity Figma prototypes into pixel-perfect, high-performance web applications — React.js, Next.js, Tailwind CSS.</p>
        <div className="hero-ctas">
          <a className="btn-primary" href="#work">View Selected Work →</a>
          <a className="btn-ghost" href="#contact">Get in touch</a>
        </div>
        <div className="hero-stats">
          <div className="stat"><b>8+</b><span>Years experience</span></div>
          <div className="stat"><b>5</b><span>Companies shipped for</span></div>
          <div className="stat"><b>30+</b><span>Products &amp; interfaces built</span></div>
        </div>
      </div>
      <div className="scroll-cue"><div className="line"></div>Scroll</div>
    </section>
  );
}

/* ---------------- Reveal on scroll wrapper ---------------- */
function useReveal(selector, opts={}){
  useEffect(()=>{
    const els = gsap.utils.toArray(selector);
    els.forEach((el,i)=>{
      gsap.to(el,{
        opacity:1, y:0, duration:.9, ease:'power3.out',
        delay: opts.stagger ? i*opts.stagger : 0,
        scrollTrigger:{ trigger: el, start:'top 85%' }
      });
    });
  },[]);
}

/* ---------------- About ---------------- */
function About(){
  useReveal('.about-reveal',{stagger:.12});
  return (
    <section id="about">
      <div className="section-head reveal about-reveal">
        <p className="section-num">01 / About</p>
        <h2 className="section-title">Eight years in the details<br/>most people scroll past.</h2>
      </div>
      <div className="about-grid">
        <div className="avatar-wrap reveal about-reveal">
          <div className="avatar-ring"></div>
          <div className="avatar-inner">SY</div>
        </div>
        <div className="about-text">
          <p className="reveal about-reveal">Sujit is a results-driven front-end developer who has spent eight years inside the gap between design and code — the pixel-level decisions that make an interface feel inevitable rather than assembled. He works primarily in React.js and Next.js, styled with Tailwind CSS, and is fluent in turning high-fidelity Figma prototypes into responsive, cross-browser interfaces without losing the designer's intent.</p>
          <p className="reveal about-reveal">Currently a Senior UI / Front-End Developer at Hexalytics Inc., he builds reusable component systems, mentors junior developers, and keeps a close eye on performance — lazy loading, memoization, and bundle discipline — so products stay fast as they grow.</p>
          <div className="about-facts">
            <div className="fact glass reveal about-reveal"><b>Based in</b><span>Kolhapur, Maharashtra, IN</span></div>
            <div className="fact glass reveal about-reveal"><b>Focus</b><span>React.js · Next.js · Tailwind</span></div>
            <div className="fact glass reveal about-reveal"><b>Practice</b><span>Agile / Scrum, TDD</span></div>
            <div className="fact glass reveal about-reveal"><b>Languages</b><span>English · Hindi · Marathi</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
const SKILL_GROUPS = [
  { title:'Frontend Development', items:['React.js & Next.js','JavaScript (ES6+) & TypeScript','HTML5 & CSS3','Component Architecture'] },
  { title:'UI / UX Design', items:['Figma prototyping','Adobe Photoshop','Wireframing','Interactive prototypes'] },
  { title:'Styling Systems', items:['Tailwind CSS','Bootstrap 3 / 4 / 5','shadcn/ui','PrimeFaces'] },
  { title:'Performance', items:['Code splitting','Lazy loading','Render optimization','Bundle discipline'] },
  { title:'Workflow & Tools', items:['Git & GitHub','Jira','VS Code','Agile / Scrum, TDD'] },
  { title:'Craft & Standards', items:['Cross-browser QA','Mobile-first design','WCAG accessibility','SEO best practice'] },
];
function SkillCard({title,items,index}){
  const ref = useRef(null);
  const onMove = e=>{
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    ref.current.style.setProperty('--mx', x+'px');
    ref.current.style.setProperty('--my', y+'px');
    const rx = ((y/r.height)-0.5)*-8, ry = ((x/r.width)-0.5)*8;
    ref.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = ()=>{ ref.current.style.transform='perspective(700px) rotateX(0) rotateY(0)'; };
  return (
    <div className="skill-card glass reveal skill-reveal" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="skill-num">{String(index+1).padStart(2,'0')}</span>
      <h3>{title}</h3>
      <ul>{items.map(it=>(<li key={it}>{it}</li>))}</ul>
    </div>
  );
}
function Skills(){
  useReveal('.skills-reveal-head');
  useReveal('.skill-reveal',{stagger:.08});
  return (
    <section id="skills">
      <div className="section-head reveal skills-reveal-head">
        <p className="section-num">02 / Capabilities</p>
        <h2 className="section-title">A full front-end toolkit,<br/>held to one standard.</h2>
        <p className="section-desc">Every project runs through the same checklist: pixel accuracy, performance budget, accessibility, and a component system the next developer can actually read.</p>
      </div>
      <div className="skills-grid">
        {SKILL_GROUPS.map((g,i)=>(<SkillCard key={g.title} title={g.title} items={g.items} index={i} />))}
      </div>
    </section>
  );
}

/* ---------------- Analytics Dashboard ---------------- */
const DASHBOARD_STATS = [
  { label:'Total sales', value:'$86.2K', change:'+14.8%', tone:'violet' },
  { label:'Visitors', value:'128K', change:'+22.4%', tone:'blue' },
  { label:'Conversion', value:'8.4%', change:'+4.2%', tone:'amber' },
  { label:'Retention', value:'72%', change:'+9.6%', tone:'green' },
];

const DASHBOARD_BARS = [
  { label:'Organic search', value:82 },
  { label:'Paid campaigns', value:68 },
  { label:'Direct traffic', value:74 },
  { label:'Referrals', value:58 },
];

const DASHBOARD_ACTIVITY = [
  { label:'Custom chart widgets', meta:'Interactive trend cards and filters' },
  { label:'Role-based dashboard views', meta:'Admin, sales, and customer success screens' },
  { label:'Responsive glass UI system', meta:'Desktop and tablet layouts with reusable cards' },
];

function Dashboard(){
  useReveal('.dashboard-reveal',{stagger:.08});
  return (
    <section id="dashboard" className="dashboard-section">
      <div className="section-head reveal dashboard-reveal">
        <p className="section-num">03 / Analytics UI</p>
        <h2 className="section-title">Modern analytics dashboard<br/>screens I build in React.</h2>
        <p className="section-desc">Sample dashboard screen showing the kind of glassy analytics UI experience I have worked on: clean data cards, chart panels, filters, insights, and responsive product layouts.</p>
      </div>

      <div className="dashboard-shell glass reveal dashboard-reveal">
        <div className="dashboard-topbar">
          <div>
            <span className="dash-kicker">Sample screen</span>
            <h3>Analytics Dashboard</h3>
          </div>
          <div className="dash-filter">React + Tailwind + Charts</div>
        </div>

        <div className="dashboard-screen glass">
          <aside className="dashboard-sidebar">
            <b>Pulse<span>.</span></b>
            {['Overview','Sales','Traffic','Reports'].map((item,index)=>(
              <span className={index===0?'active':''} key={item}>{item}</span>
            ))}
          </aside>

          <div className="dashboard-content">
            <div className="dashboard-toolbar">
              <div>
                <span>Welcome back</span>
                <strong>Executive analytics</strong>
              </div>
              <button type="button">Export report</button>
            </div>

            <div className="dashboard-grid">
              <div className="dash-metrics">
                {DASHBOARD_STATS.map(stat=>(
                  <div className={'dash-stat '+stat.tone} key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <b>{stat.change}</b>
                  </div>
                ))}
              </div>

              <div className="dash-chart glass">
                <div className="dash-panel-head">
                  <span>Revenue analytics</span>
                  <b>+24.8%</b>
                </div>
                <div className="chart-stage">
                  <div className="chart-grid-lines"></div>
                  <svg viewBox="0 0 520 210" role="img" aria-label="Analytics growth line chart">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.42" />
                        <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="chart-fill" d="M0 162 C60 130 92 148 138 104 C190 54 236 126 290 82 C354 30 392 92 448 54 C482 31 504 37 520 24 L520 210 L0 210 Z" />
                    <path className="chart-line" d="M0 162 C60 130 92 148 138 104 C190 54 236 126 290 82 C354 30 392 92 448 54 C482 31 504 37 520 24" />
                    <circle cx="448" cy="54" r="6" />
                    <circle cx="520" cy="24" r="6" />
                  </svg>
                </div>
              </div>

              <div className="dash-panel glass">
                <div className="dash-panel-head">
                  <span>Traffic sources</span>
                  <b>Live</b>
                </div>
                <div className="dash-bars">
                  {DASHBOARD_BARS.map(item=>(
                    <div className="dash-bar-row" key={item.label}>
                      <div><span>{item.label}</span><b>{item.value}%</b></div>
                      <i><em style={{width:item.value+'%'}}></em></i>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-panel glass">
                <div className="dash-panel-head">
                  <span>Dashboard features</span>
                  <b>Built UI</b>
                </div>
                <div className="dash-activity">
                  {DASHBOARD_ACTIVITY.map(item=>(
                    <div className="activity-row" key={item.label}>
                      <span></span>
                      <div>
                        <b>{item.label}</b>
                        <p>{item.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-device-card glass">
                <span>Responsive sample</span>
                <strong>Tablet-ready analytics views</strong>
                <div className="device-bars">
                  <i></i><i></i><i></i>
                </div>
              </div>

              <div className="dash-device-card glass amber-card">
                <span>UI craft</span>
                <strong>Glassy cards, soft borders, motion</strong>
                <div className="device-orbit">
                  <i></i><i></i><i></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Experience ---------------- */
const EXPERIENCE = [
  { period:'Nov 2021 — Present', role:'Senior UI / Front-End Developer', org:'Hexalytics Inc. · Kolhapur, Maharashtra', current:true,
    points:['Build high-performance, scalable applications with React.js, Next.js, TypeScript and Tailwind CSS','Implement reusable components, hooks and custom styling for long-term maintainability','Convert Figma prototypes into responsive, pixel-perfect interfaces with the design team','Mentor junior developers and lead code reviews'] },
  { period:'Jun 2019 — Nov 2021', role:'UI / UX Developer', org:'Edbrix · Kolhapur, Maharashtra',
    points:['Designed and built responsive applications with HTML5, CSS3 and JavaScript','Produced wireframes, mockups and interactive prototypes in Figma','Ran usability testing to validate design decisions'] },
  { period:'Jan 2018 — Feb 2019', role:'UI Developer', org:'Nobletree · Pune, Maharashtra',
    points:['Designed UI mockups and prototypes for client projects','Converted PSD designs into fully responsive HTML5 / CSS3 / JavaScript builds'] },
  { period:'Oct 2016 — Dec 2017', role:'UI Developer', org:'Green Chillies Software Solution · Sangli, Maharashtra',
    points:['Created website layouts, templates and graphic assets in Photoshop','Converted PSD designs into responsive websites','Researched UI trends to improve engagement'] },
  { period:'Sep 2015 — Aug 2016', role:'Independent Developer', org:'Self-Employed · Ichalkaranji, Maharashtra',
    points:["Built 'Digital Panchayat' — taxation and billing software for Gram Panchayats", 'Owned requirement gathering, UI design, development and testing end to end'] },
];
function Experience(){
  useReveal('.exp-reveal-head');
  useReveal('.tl-item',{stagger:.1});
  return (
    <section id="experience">
      <div className="section-head reveal exp-reveal-head">
        <p className="section-num">04 / Experience</p>
        <h2 className="section-title">A straight line from<br/>Photoshop layers to design systems.</h2>
      </div>
      <div className="timeline">
        {EXPERIENCE.map(e=>(
          <div className={'tl-item reveal'+(e.current?' current':'')} key={e.role+e.period}>
            <div className="tl-dot"></div>
            <p className="tl-period">{e.period}</p>
            <h3 className="tl-role">{e.role}</h3>
            <p className="tl-org">{e.org}</p>
            <ul>{e.points.map(p=>(<li key={p}>{p}</li>))}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Work (horizontal scroll) ---------------- */
const WORK = [
  { tag:'Enterprise SaaS', title:'Component System @ Hexalytics', desc:'A reusable React + Tailwind component library used across internal SaaS dashboards — built for consistency, speed, and easy handoff.', stack:['React.js','TypeScript','Tailwind'], color:'#7c5cff' },
  { tag:'E-Commerce', title:'Storefront UI Customization', desc:'Pixel-perfect, mobile-first storefront interfaces with custom checkout flows and performance-tuned product pages.', stack:['Next.js','REST APIs','SEO'], color:'#ffb454' },
  { tag:'Design System', title:'Figma-to-Code Pipeline', desc:'A process for converting high-fidelity Figma prototypes into production components with zero visual drift.', stack:['Figma','shadcn/ui','Storybook-style QA'], color:'#5cc8ff' },
  { tag:'Civic Tech', title:'Digital Panchayat', desc:'Taxation and billing software for Gram Panchayats, built independently end-to-end — requirements through deployment.', stack:['JavaScript','UI Design','SQL'], color:'#7c5cff' },
  { tag:'Product Rebuild', title:'PSD → Responsive Rebuild', desc:'Legacy PSD-based sites rebuilt as fully responsive, cross-browser HTML5/CSS3/JS experiences.', stack:['HTML5','CSS3','Cross-browser QA'], color:'#ffb454' },
];
function Work(){
  const trackRef = useRef(null);
  const pinRef = useRef(null);
  useEffect(()=>{
    const track = trackRef.current;
    const setDistance = ()=> track.scrollWidth - window.innerWidth;
    let ctx = gsap.context(()=>{
      gsap.to(track,{
        x: ()=> -setDistance(),
        ease:'none',
        scrollTrigger:{
          trigger: pinRef.current,
          start:'top top',
          end: ()=> '+=' + (setDistance()+window.innerWidth*0.4),
          scrub:1,
          pin:true,
          invalidateOnRefresh:true,
        }
      });
    });
    return ()=> ctx.revert();
  },[]);
  return (
    <section id="work" className="work-pin" ref={pinRef}>
      <div className="work-head section-head">
        <p className="section-num">05 / Selected Work</p>
        <h2 className="section-title">Scroll horizontally.<br/>Everything below shipped.</h2>
      </div>
      <div className="work-track" ref={trackRef}>
        {WORK.map((w,i)=>(
          <div className="work-card glass" key={w.title} style={{'--wc':w.color}}>
            <div className="glow"></div>
            <span className="work-index">{String(i+1).padStart(2,'0')}</span>
            <span className="work-tag">{w.tag}</span>
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
            <div className="work-stack">{w.stack.map(s=>(<span key={s}>{s}</span>))}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact(){
  useReveal('.contact-reveal',{stagger:.1});
  return (
    <section id="contact">
      <div className="contact-panel glass reveal contact-reveal">
        <p className="section-num">06 / Contact</p>
        <h2>Have an interface that needs<br/>eight years of attention to detail?</h2>
        <p className="section-desc">Open to senior front-end and UI engineering roles, and select freelance builds.</p>
        <div className="contact-links">
          <a href="mailto:sujityadavsoft@gmail.com">✉ sujityadavsoft@gmail.com</a>
          <a href="tel:+918975593718">📱 +91 89755 93718</a>
          <a href="#top">📍 Kolhapur, Maharashtra</a>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer>
      <span>© {new Date().getFullYear()} Sujit Yadav. Built with React, GSAP &amp; a lot of coffee.</span>
      <span>Front-End Developer · React.js · Next.js · Tailwind CSS</span>
    </footer>
  );
}

function App(){
  useEffect(()=>{
    const t = setTimeout(()=> ScrollTrigger.refresh(), 300);
    return ()=>clearTimeout(t);
  },[]);
  return (<>
    <div className="noise"></div>
    <Particles />
    <Cursor />
    <Nav />
    <Hero />
    <About />
    <Skills />
    <Dashboard />
    <Experience />
    <Work />
    <Contact />
    <Footer />
  </>);
}

export default App;
