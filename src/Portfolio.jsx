import React, { useEffect, useRef, useState } from "react";
import myimage from "./assets/myimage.jpeg";

const COLORS = {
  bg: "#0a0f14",
  surface: "#111a22",
  surface2: "#16212b",
  line: "#22323f",
  teal: "#5eead4",
  amber: "#f5b942",
  text: "#e7eef3",
  muted: "#8298a6",
};

const AVATAR_SRC = myimage;

const SKILLS_LEFT = [
  { label: "JavaScript / React.js", level: 85 },
  { label: "HTML / CSS / Responsive Design", level: 90 },
  { label: "Core Java & OOP", level: 82 },
  { label: "SQL / MySQL", level: 78 },
];
const SKILLS_RIGHT = [
  { label: "JDBC & Database Integration", level: 75 },
  { label: "Data Structures & DBMS", level: 70 },
  { label: "Git / GitHub / Postman", level: 72 },
  { label: "AI Tools (Copilot, ChatGPT, Claude)", level: 65 },
];

const PROJECTS = [
  {
    title: "PetHub",
    desc: "A Java full-stack pet adoption platform. Core Java and OOP power the backend logic, with MySQL and JDBC handling CRUD operations for registrations, listings, and adoption requests.",
    stack: ["Java", "JDBC", "MySQL", "OOP","Servlets","JSP","Apache Tomcat","HTML/CSS"],
  },
  {
    title: "Academic Notice & Event Registration with Ticket Generation",
    desc: "A web app managing academic notices and event registrations, with an admin dashboard and automated QR-code ticket generation for secure, trackable event check-ins.",
    stack: ["HTML/CSS/JS", "C#", "MySQL", "QR Codes"],
  },
  {
    title: "Doctor Appointment Booking",
    desc: "Streamlines appointment booking and patient management with an admin panel for doctors, plus secure authentication and role-based access control.",
    stack: ["HTML/CSS/JS","PHP", "MySQL"],
  },
];

const MARQUEE_ITEMS = [
  "React.js", "Java", "MySQL", "JDBC", "JavaScript",
  "Bootstrap", "Git & GitHub", "SQL", "Postman", "Data Structures",
];

const ROLE_WORDS = ["Full-Stack Developer", "Java & React Engineer", "Frontend Developer","Problem Solver", "Information Science Student"];

const STATS = [
  { label: "CGPA", value: 8.82, decimals: 2, suffix: "" },
  { label: "Projects Shipped", value: 3, decimals: 0, suffix: "+" },
  { label: "Certifications", value: 1, decimals: 0, suffix: "" },
  { label: "Tech Stacks", value: 10, decimals: 0, suffix: "+" },
];

const PAGES = ["home", "about", "skills", "projects", "achievements", "contact"];
const PAGE_LABELS = { home: "Home", about: "About", skills: "Skills", projects: "Projects", achievements: "Achievements", contact: "Contact" };

/* ---------- Reusable bits ---------- */

function FadeIn({ children, style = {} }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(24px)",
      transition: "opacity .6s ease, transform .6s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SkillRow({ label, level }) {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFill(level), 200);
    return () => clearTimeout(t);
  }, [level]);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", marginBottom: 8 }}>
        <span>{label}</span>
        <span style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: ".78rem" }}>
          {level}%
        </span>
      </div>
      <div style={{ height: 6, background: COLORS.surface2, borderRadius: 4, overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
        <div style={{
          height: "100%", width: `${fill}%`, borderRadius: 4,
          background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.amber})`,
          transition: "width 1.2s cubic-bezier(.22,.9,.3,1)",
        }} />
      </div>
    </div>
  );
}

function Typewriter({ words, speed = 55, pause = 1400 }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 1.6);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return (
    <span className="mono" style={{ color: COLORS.teal }}>
      {text}
      <span className="typewriter-caret">|</span>
    </span>
  );
}

function useOnScreen(ref, threshold = 0.4) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Counter({ value, decimals = 0, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref, 0.5);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = null;
    let raf;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, duration]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");
  const [spot, setSpot] = useState({ x: 50, y: 50, on: 0 });

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotX = (py - 0.5) * -10;
    const rotY = (px - 0.5) * 10;
    setTransform(`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`);
    setSpot({ x: px * 100, y: py * 100, on: 1 });
  }
  function onLeave() {
    setTransform("");
    setSpot((s) => ({ ...s, on: 0 }));
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
      style={{
        transform,
        transition: transform ? "transform .08s ease" : "transform .5s ease",
        "--spot-x": `${spot.x}%`,
        "--spot-y": `${spot.y}%`,
        "--spot-on": spot.on,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], raf;
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    const count = Math.min(80, Math.floor(W / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    }));
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(94,234,212,0.6)";
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(94,234,212,${0.15 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4, zIndex: 0 }} />;
}

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  useEffect(() => {
    let raf;
    function onMove(e) {
      pos.current.mx = e.clientX; pos.current.my = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = e.clientX + "px"; dotRef.current.style.top = e.clientY + "px"; }
    }
    function animate() {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.15;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.15;
      if (ringRef.current) { ringRef.current.style.left = pos.current.rx + "px"; ringRef.current.style.top = pos.current.ry + "px"; }
      raf = requestAnimationFrame(animate);
    }
    window.addEventListener("mousemove", onMove);
    animate();
    const attach = () => {
      const interactive = document.querySelectorAll("a, button, .hoverable");
      interactive.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      return interactive;
    };
    const onEnter = () => ringRef.current && ringRef.current.classList.add("active");
    const onLeave = () => ringRef.current && ringRef.current.classList.remove("active");
    let interactive = attach();
    const mo = new MutationObserver(() => {
      interactive.forEach((el) => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
      interactive = attach();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
      interactive.forEach((el) => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    };
  }, []);
  return (
    <>
      <style>{`
        .cursor-ring.active { width: 52px !important; height: 52px !important; background: rgba(94,234,212,.08) !important; border-color: ${COLORS.amber} !important; }
        @media (max-width: 768px) { .cursor-dot, .cursor-ring { display: none !important; } }
      `}</style>
      <div ref={dotRef} className="cursor-dot" style={{
        position: "fixed", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%",
        background: COLORS.teal, boxShadow: "0 0 8px 2px rgba(94,234,212,.8)",
        pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)",
      }} />
      <div ref={ringRef} className="cursor-ring" style={{
        position: "fixed", top: 0, left: 0, width: 34, height: 34, borderRadius: "50%",
        border: "1px solid rgba(94,234,212,.5)", pointerEvents: "none", zIndex: 9998,
        transform: "translate(-50%,-50%)", transition: "width .2s, height .2s, border-color .2s, background .2s",
      }} />
    </>
  );
}

function Loader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: COLORS.bg,
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14,
      opacity: hidden ? 0 : 1, visibility: hidden ? "hidden" : "visible",
      transition: "opacity .8s ease, visibility .8s ease", pointerEvents: hidden ? "none" : "auto",
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: COLORS.muted, letterSpacing: ".15em" }}>
        LAKSHMI.PN — INITIALIZING
      </div>
      <div style={{ width: 200, height: 2, background: COLORS.line, position: "relative", overflow: "hidden", borderRadius: 2 }}>
        <div className="loader-sweep" style={{
          position: "absolute", top: 0, left: "-40%", width: "40%", height: "100%",
          background: `linear-gradient(90deg, transparent, ${COLORS.teal}, transparent)`,
        }} />
      </div>
      <style>{`@keyframes loadsweep { 0% { left: -40%; } 100% { left: 100%; } } .loader-sweep { animation: loadsweep 1.1s ease-in-out infinite; }`}</style>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div className="tag" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ width: 26, height: 1, background: COLORS.teal, display: "inline-block" }} />
      {children}
    </div>
  );
}

/* ---------- Pages ---------- */

function HomePage({ go }) {
  return (
    <div style={{
      minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 40, position: "relative", zIndex: 1, flexWrap: "wrap", paddingTop: 40,
    }}>
      <ParticleCanvas />
      <FadeIn style={{ maxWidth: 640, position: "relative", zIndex: 1 }}>
        <span className="tag" style={{ display: "block", marginBottom: 20 }}>
          // Information Science and Engineering, Class of 2026
        </span>
        <h1 className="display" style={{
          fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: 20,
          background: `linear-gradient(100deg, ${COLORS.text} 20%, ${COLORS.teal} 40%, ${COLORS.amber} 50%, ${COLORS.text} 70%)`,
          backgroundSize: "300% auto", WebkitBackgroundClip: "text", backgroundClip: "text",
          color: "transparent", animation: "shimmer 6s linear infinite",
        }}>
          Lakshmi PN
        </h1>
        <div className="mono" style={{ fontSize: "1.05rem", marginBottom: 18, minHeight: 26 }}>
          <Typewriter words={ROLE_WORDS} />
        </div>
        <p style={{ color: COLORS.muted, fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 28, maxWidth: 540 }}>
          I build full-stack web applications — from JDBC-backed Java systems to React interfaces — with a habit of
          turning academic projects into things people can actually use. Based in Davanagere, Karnataka.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 46 }}>
          <button className="btn btn-primary hoverable" onClick={() => go("projects")}>View Projects</button>
          <button className="btn btn-ghost hoverable" onClick={() => go("contact")}>Get in Touch</button>
        </div>
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="display" style={{ fontSize: "1.8rem", fontWeight: 700, color: COLORS.teal }}>
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mono" style={{ fontSize: ".72rem", color: COLORS.muted, letterSpacing: ".04em", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
      <div className="hero-right" style={{ position: "relative", width: 420, height: 420, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", border: `1px solid ${COLORS.teal}`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            animation: `ripple 3s ease-out infinite`, animationDelay: `${i}s`, opacity: 0,
          }} />
        ))}
        <div style={{
          width: 280, height: 280, borderRadius: "50%",
          border: `1px solid ${COLORS.line}`, overflow: "hidden",
          position: "relative", zIndex: 3, boxShadow: "0 0 40px rgba(94,234,212,.15)",
        }}>
          <img src={AVATAR_SRC} alt="Lakshmi PN" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <SectionEyebrow>About &amp; Education</SectionEyebrow>
      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <FadeIn>
          <div style={{ perspective: 1200, display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 280, height: 340, borderRadius: 18,
              background: `linear-gradient(160deg, ${COLORS.surface2}, ${COLORS.surface})`,
              border: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column",
              justifyContent: "space-between", padding: 28, animation: "floatRotate 8s ease-in-out infinite",
              transformStyle: "preserve-3d", boxShadow: "0 30px 60px rgba(0,0,0,.5)",
            }}>
              <div className="mono" style={{ color: COLORS.muted, fontSize: ".75rem" }}>B.E. INFORMATION SCIENCE &amp; ENGINEERING</div>
              <div className="display" style={{ fontSize: "3.4rem", fontWeight: 700, color: COLORS.teal }}>
                8.82<span style={{ fontSize: "1.2rem", color: COLORS.muted }}>/10</span>
              </div>
              <div style={{ fontSize: ".85rem", color: COLORS.muted, lineHeight: 1.5 }}>
                Bapuji Institute of Engineering and Technology<br />2022 — 2026
              </div>
            </div>
          </div>
        </FadeIn>
        <FadeIn>
          <div>
            <h2 className="display" style={{ fontSize: "2.2rem", marginBottom: 20 }}>Motivated to build, wired to learn.</h2>
            <p style={{ color: COLORS.muted, lineHeight: 1.8, marginBottom: 16 }}>
              I'm an Information Science student with a strong footing in web development and Java, drawn to
              projects that improve how people manage information — from pet adoption platforms to hospital
              scheduling. Alongside my technical work, I've been recognized for social work as an NGO Associate.
            </p>
            {[
              { h: "Pre-University Course — Sri Siddeshwara IND PU College", s: "92% · 2020 – 2022" },
              { h: "Secondary Education — Kitturu Rani Channamma Residential School", s: "83% · 2020" },
            ].map((e, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${COLORS.line}`, padding: "8px 0 8px 20px", marginTop: 18, position: "relative" }}>
                <div style={{ position: "absolute", left: -6, top: 14, width: 10, height: 10, borderRadius: "50%", background: COLORS.amber }} />
                <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>{e.h}</h4>
                <span className="mono" style={{ fontSize: ".75rem", color: COLORS.teal }}>{e.s}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function SkillsPage() {
  return (
    <div>
      <SectionEyebrow>Technical Skills</SectionEyebrow>
      <FadeIn><h2 className="display" style={{ fontSize: "2.2rem" }}>What I work with</h2></FadeIn>
      <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 60px", marginTop: 50 }}>
        <FadeIn><div>{SKILLS_LEFT.map((s, i) => <SkillRow key={i} {...s} />)}</div></FadeIn>
        <FadeIn><div>{SKILLS_RIGHT.map((s, i) => <SkillRow key={i} {...s} />)}</div></FadeIn>
      </div>
      <FadeIn style={{ marginTop: 60 }}>
        <div style={{ overflow: "hidden", borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, padding: "26px 0" }}>
          <div style={{ display: "flex", gap: 60, width: "max-content", animation: "marquee 22s linear infinite" }}>
            {[0, 1].map((dup) => (
              <span key={dup} className="mono" style={{ display: "flex", gap: 60, color: COLORS.muted, fontSize: "1rem", whiteSpace: "nowrap" }}>
                {MARQUEE_ITEMS.map((item, i) => <span key={i}><b style={{ color: COLORS.teal, fontWeight: 500 }}>{item}</b> ·</span>)}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div>
      <SectionEyebrow>Projects</SectionEyebrow>
      <FadeIn><h2 className="display" style={{ fontSize: "2.2rem" }}>Things I've built</h2></FadeIn>
      <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26, marginTop: 50 }}>
        {PROJECTS.map((p, i) => (
          <FadeIn key={i}>
            <TiltCard className="project-card hoverable">
              <h3 className="display" style={{ fontSize: "1.15rem", marginBottom: 12 }}>{p.title}</h3>
              <p style={{ color: COLORS.muted, fontSize: ".9rem", lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.stack.map((s, j) => (
                  <span key={j} className="mono" style={{ fontSize: ".7rem", padding: "4px 10px", border: `1px solid ${COLORS.line}`, borderRadius: 20, color: COLORS.teal }}>{s}</span>
                ))}
              </div>
            </TiltCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function AchievementsPage() {
  return (
    <div>
      <SectionEyebrow>Certifications &amp; Achievements</SectionEyebrow>
      <FadeIn><h2 className="display" style={{ fontSize: "2.2rem" }}>Recognition</h2></FadeIn>
      <div className="ach-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 50 }}>
        <FadeIn>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 26 }}>
            <span className="tag" style={{ display: "block", marginBottom: 10 }}>Certification</span>
            <h4 style={{ fontSize: "1.05rem", marginBottom: 8 }}>Programming in Java</h4>
            <p style={{ color: COLORS.muted, fontSize: ".88rem", lineHeight: 1.6 }}>NPTEL Online Certification, conducted by IIT Kharagpur.</p>
          </div>
        </FadeIn>
        <FadeIn>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 26 }}>
            <span className="tag" style={{ display: "block", marginBottom: 10 }}>Internship · 4 Months</span>
            <h4 style={{ fontSize: "1.05rem", marginBottom: 8 }}>Java Full Stack Development</h4>
            <p style={{ color: COLORS.muted, fontSize: ".88rem", lineHeight: 1.6 }}>
              Completed a 4-month internship in Java Full Stack Development at Pentagon Space, gaining hands-on
              experience across the full development stack.
            </p>
          </div>
        </FadeIn>
        <FadeIn>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 26 }}>
            <span className="tag" style={{ display: "block", marginBottom: 10 }}>Award · February 2020</span>
            <h4 style={{ fontSize: "1.05rem", marginBottom: 8 }}>Rajya Puraskar (Governor's Award)</h4>
            <p style={{ color: COLORS.muted, fontSize: ".88rem", lineHeight: 1.6 }}>
              Awarded by The Bharat Scouts &amp; Guides, Karnataka, for outstanding social work as an NGO Associate.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function ContactPage() {
  const [toast, setToast] = useState("");

  function copy(value, label) {
    navigator.clipboard?.writeText(value).then(() => {
      setToast(`${label} copied to clipboard`);
      setTimeout(() => setToast(""), 2000);
    });
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <div className="mono" style={{
        position: "fixed", bottom: 30, left: "50%", transform: `translateX(-50%) translateY(${toast ? 0 : 20}px)`,
        opacity: toast ? 1 : 0, transition: "opacity .3s ease, transform .3s ease",
        background: COLORS.surface2, border: `1px solid ${COLORS.teal}`, color: COLORS.teal,
        padding: "10px 20px", borderRadius: 8, fontSize: ".8rem", zIndex: 200, pointerEvents: "none",
      }}>
        {toast}
      </div>
      <SectionEyebrow>
        <span style={{ margin: "0 auto" }}>Let's Connect</span>
      </SectionEyebrow>
      <FadeIn><h2 className="display" style={{ fontSize: "2.4rem", marginBottom: 14 }}>Open to opportunities</h2></FadeIn>
      <FadeIn>
        <p style={{ color: COLORS.muted, maxWidth: 480, margin: "0 auto 10px" }}>
          Looking for internships and entry-level roles where I can put full-stack development and problem-solving
          to work. Reach out — I reply quickly.
        </p>
      </FadeIn>
      <FadeIn>
        <div style={{ position: "relative", width: 180, height: 180, margin: "40px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute", borderRadius: "50%", border: `1px solid ${COLORS.amber}`,
              animation: "ripple2 3s ease-out infinite", animationDelay: `${i}s`, opacity: 0,
            }} />
          ))}
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: COLORS.teal, boxShadow: "0 0 40px rgba(94,234,212,.5)", zIndex: 2 }} />
        </div>
      </FadeIn>
      <FadeIn>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 30, flexWrap: "wrap" }}>
          <a
            className="btn btn-primary hoverable"
            href="mailto:laxmipnlaxmipn@gmail.com"
            onClick={() => copy("laxmipnlaxmipn@gmail.com", "Email")}
          >
            Email Me
          </a>
          <a
            className="btn btn-ghost hoverable"
            href="tel:+916364272034"
            onClick={() => copy("+91-6364272034", "Phone number")}
          >
            +91-6364272034
          </a>
        </div>
      </FadeIn>
    </div>
  );
}

/* ---------- App shell ---------- */

export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pageMap = {
    home: <HomePage go={go} />,
    about: <AboutPage />,
    skills: <SkillsPage />,
    projects: <ProjectsPage />,
    achievements: <AchievementsPage />,
    contact: <ContactPage />,
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', sans-serif", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: ${COLORS.bg}; }
        html, body, #root { width: 100%; min-height: 100%; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${COLORS.teal}; color: #04211c; }
        .display { font-family: 'Space Grotesk', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .tag { font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; text-transform: uppercase; font-size: .72rem; color: ${COLORS.teal}; }
        @keyframes shimmer { to { background-position: -300% center; } }
        @keyframes ripple { 0% { width: 280px; height: 280px; opacity: .7; } 100% { width: 440px; height: 440px; opacity: 0; } }
        @keyframes ripple2 { 0% { width: 70px; height: 70px; opacity: .8; } 100% { width: 180px; height: 180px; opacity: 0; } }
        @keyframes floatRotate {
          0%,100% { transform: rotateY(-8deg) rotateX(4deg) translateY(0); }
          25% { transform: rotateY(6deg) rotateX(-3deg) translateY(-10px); }
          50% { transform: rotateY(-4deg) rotateX(6deg) translateY(4px); }
          75% { transform: rotateY(8deg) rotateX(-5deg) translateY(-6px); }
        }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .btn { font-family: 'JetBrains Mono', monospace; font-size: .85rem; padding: 13px 26px; border-radius: 8px; text-decoration: none; display: inline-block; transition: transform .3s, box-shadow .3s, color .3s, border-color .3s; cursor: none; border: none; }
        .btn-primary { background: ${COLORS.teal}; color: #04211c; font-weight: 600; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(94,234,212,.25); }
        .btn-ghost { border: 1px solid ${COLORS.line}; color: ${COLORS.text}; background: transparent; }
        .btn-ghost:hover { border-color: ${COLORS.teal}; color: ${COLORS.teal}; transform: translateY(-3px); }
        .project-card { position: relative; background: ${COLORS.surface}; border: 1px solid ${COLORS.line}; border-radius: 14px; padding: 28px; overflow: hidden; transition: transform .35s ease, border-color .35s ease; }
        .project-card::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 3px; background: linear-gradient(90deg, transparent, ${COLORS.teal}, ${COLORS.amber}, transparent); transition: left .6s ease; }
        .project-card:hover::before { left: 100%; }
        .project-card:hover { transform: translateY(-6px); border-color: rgba(94,234,212,.4); }
        .nav-btn { position: relative; background: none; border: none; color: ${COLORS.muted}; font-size: .9rem; cursor: none; transition: color .3s; font-family: 'Inter', sans-serif; padding: 6px 0; }
        .nav-btn::after { content: ""; position: absolute; left: 0; bottom: -2px; height: 2px; width: 100%; background: ${COLORS.teal}; transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
        .nav-btn:hover { color: ${COLORS.teal}; }
        .nav-btn.active { color: ${COLORS.teal}; }
        .nav-btn.active::after { transform: scaleX(1); }

        @keyframes pageFadeSlide { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .page-transition { animation: pageFadeSlide .5s ease; }

        .typewriter-caret { animation: caretBlink 1s step-end infinite; }
        @keyframes caretBlink { 50% { opacity: 0; } }

        .tilt-card { --spot-x: 50%; --spot-y: 50%; --spot-on: 0; }
        .tilt-card::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: radial-gradient(240px circle at var(--spot-x) var(--spot-y), rgba(94,234,212,.14), transparent 70%);
          opacity: var(--spot-on); transition: opacity .25s ease;
        }

        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.line}; border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.teal}; }
        html { scrollbar-color: ${COLORS.line} ${COLORS.bg}; }

        a:focus-visible, button:focus-visible { outline: 2px solid ${COLORS.teal}; outline-offset: 3px; }

        @media (max-width: 900px) { .hero-right, .nav-links { display: none !important; } .about-grid, .skills-grid, .ach-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 1000px) { .projects-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .page-shell { padding: 80px 6vw 60px !important; } body { cursor: auto; } }
      `}</style>

      <Loader />
      <CustomCursor />

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 101, background: "transparent" }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.amber})`,
          transition: "width .1s linear",
        }} />
      </div>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: scrolled ? "14px 8vw" : "22px 8vw",
        background: scrolled ? "rgba(10,15,20,.75)" : COLORS.bg,
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: `1px solid ${COLORS.line}`,
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,.25)" : "none",
        transition: "padding .3s ease, background .3s ease, box-shadow .3s ease",
      }}>
        <button className="nav-btn hoverable" onClick={() => go("home")} style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Space Grotesk', sans-serif", color: COLORS.text }}>
          <span style={{ color: COLORS.teal }}>Lakshmi PN</span>
        </button>
        <ul className="nav-links" style={{ listStyle: "none", display: "flex", gap: 32, margin: 0, padding: 0 }}>
          {PAGES.filter((p) => p !== "home").map((id) => (
            <li key={id}>
              <button className={`nav-btn hoverable ${page === id ? "active" : ""}`} onClick={() => go(id)}>
                {PAGE_LABELS[id]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="page-shell" style={{ padding: "120px 8vw 60px", position: "relative", zIndex: 1, minHeight: "80vh" }}>
        <div key={page} className="page-transition">
          {pageMap[page]}
        </div>
      </div>

      <footer className="mono" style={{ textAlign: "center", padding: 30, color: COLORS.muted, fontSize: ".8rem", borderTop: `1px solid ${COLORS.line}` }}>
        © 2026 Lakshmi PN · Davanagere, Karnataka, India
      </footer>
    </div>
  );
}
