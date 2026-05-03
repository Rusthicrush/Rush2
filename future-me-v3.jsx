import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════
// FIREBASE REST CONFIG — replace these 2:
const FB_PROJECT = "my-ca692";        // e.g. "future-me-abc12"
const FB_API_KEY  = "// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgnECagUEpd9X6BoUHAnnpbnst1mlY1dY",
  authDomain: "my-ca692.firebaseapp.com",
  projectId: "my-ca692",
  storageBucket: "my-ca692.firebasestorage.app",
  messagingSenderId: "401111475090",
  appId: "1:401111475090:web:e31700ac4ebcfaf7f3174b",
  measurementId: "G-6LWCTDB6VD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);"; // Firebase Web API Key
// REST URL (no SDK needed!)
const FB_URL = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/simulations`;
// ══════════════════════════════════════════
// WHATSAPP OWNER NUMBER (international, no +)
const WA_NUMBER = "94727676806";
// ══════════════════════════════════════════

const BAD_HABITS  = ["Late Sleep","Procrastination","Too Much Social Media","No Exercise","Junk Food","No Reading","Gaming Addiction","Overthinking"];
const GOOD_HABITS = ["Daily Coding","Reading Books","Exercise","Learning Skills","Early Wake","Music / Art","Saving Money","Prayer / Meditation"];

// ── GALAXY ────────────────────────────────
function Galaxy() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext("2d");
    let W, H, stars = [], nebs = [], raf;
    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    const init = () => {
      stars = Array.from({ length: 260 }, () => ({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.4+.3, a: Math.random()*.8+.2,
        to: Math.random()*Math.PI*2, sp: Math.random()*.012+.003,
      }));
      const cs = ["rgba(200,255,0,","rgba(0,229,255,","rgba(255,61,127,","rgba(90,60,220,"];
      nebs = Array.from({length:7},(_,i)=>({
        x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*240+90, c:cs[i%cs.length], a:Math.random()*.038+.01,
      }));
    };
    let t = 0;
    const draw = () => {
      cx.clearRect(0,0,W,H);
      const bg = cx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H));
      bg.addColorStop(0,"#07072c"); bg.addColorStop(1,"#03030a");
      cx.fillStyle = bg; cx.fillRect(0,0,W,H);
      nebs.forEach(n=>{
        const g = cx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
        g.addColorStop(0,n.c+n.a+")"); g.addColorStop(1,n.c+"0)");
        cx.fillStyle=g; cx.beginPath(); cx.arc(n.x,n.y,n.r,0,Math.PI*2); cx.fill();
      });
      t+=.012;
      stars.forEach(s=>{
        cx.globalAlpha = s.a*(0.35+0.65*Math.sin(t*50*s.sp+s.to));
        cx.fillStyle="#fff"; cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2); cx.fill();
      });
      cx.globalAlpha=1;
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize",()=>{resize();init();});
    return ()=>{ cancelAnimationFrame(raf); };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

// ── TAG ───────────────────────────────────
function Tag({label,active,onToggle}){
  return(
    <button onClick={onToggle} style={{
      background: active?"rgba(200,255,0,.10)":"rgba(255,255,255,.03)",
      border:`1px solid ${active?"#c8ff00":"#1a1a30"}`,
      color: active?"#c8ff00":"#555572",
      padding:".32rem .82rem", fontFamily:"'Space Mono',monospace",
      fontSize:".58rem", letterSpacing:".1em", textTransform:"uppercase",
      cursor:"pointer", transition:"all .18s", borderRadius:2,
    }}>{label}</button>
  );
}

// ── TYPEWRITER ────────────────────────────
function TypeWriter({text}){
  const [shown,setShown]=useState("");
  useEffect(()=>{
    setShown(""); let i=0;
    const iv=setInterval(()=>{
      if(i<text.length) setShown(text.slice(0,++i));
      else clearInterval(iv);
    },9);
    return()=>clearInterval(iv);
  },[text]);
  return <p style={{fontSize:".94rem",lineHeight:1.95,color:"#e2e2f0",whiteSpace:"pre-wrap"}}>{shown}</p>;
}

// ── COUNTDOWN ─────────────────────────────
function Countdown({ts}){
  const [diff,setDiff]=useState(ts-Date.now());
  useEffect(()=>{
    const iv=setInterval(()=>setDiff(ts-Date.now()),1000);
    return()=>clearInterval(iv);
  },[ts]);
  if(diff<=0) return <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.5rem",color:"#c8ff00"}}>🔓 UNLOCKED!</div>;
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),
        m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
  return(
    <div style={{display:"flex",gap:".7rem",flexWrap:"wrap",justifyContent:"center"}}>
      {[[d,"DAYS"],[h,"HRS"],[m,"MIN"],[s,"SEC"]].map(([n,l])=>(
        <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".18rem"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#c8ff00",
            background:"rgba(200,255,0,.06)",border:"1px solid rgba(200,255,0,.14)",
            padding:".38rem .62rem",minWidth:50,textAlign:"center"}}>
            {String(n).padStart(2,"0")}
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:".5rem",color:"#555572",letterSpacing:".2em"}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ── TOAST ─────────────────────────────────
function Toast({msg}){
  if(!msg) return null;
  return(
    <div style={{position:"fixed",bottom:"2rem",left:"50%",transform:"translateX(-50%)",
      background:"#c8ff00",color:"#03030a",fontFamily:"'Space Mono',monospace",
      fontSize:".7rem",padding:".72rem 1.5rem",zIndex:9999,whiteSpace:"nowrap",
      boxShadow:"0 8px 30px rgba(200,255,0,.3)",borderRadius:2}}>
      {msg}
    </div>
  );
}

// ── FIREBASE REST SAVE ────────────────────
async function fbSave(rec) {
  // Firestore REST API — no SDK, works in any env
  try {
    const body = {
      fields: {
        name:   { stringValue: rec.input.name  },
        age:    { stringValue: String(rec.input.age) },
        dream:  { stringValue: rec.input.dream },
        skills: { stringValue: rec.input.skills||"" },
        fear:   { stringValue: rec.input.fear||"" },
        sleep:  { integerValue: rec.input.sleep },
        phone:  { integerValue: rec.input.phone },
        years:  { stringValue: rec.input.years },
        bad:    { arrayValue: { values: rec.input.bad.map(v=>({stringValue:v})) }},
        good:   { arrayValue: { values: rec.input.good.map(v=>({stringValue:v})) }},
        result: { stringValue: rec.text },
        ts:     { stringValue: new Date().toISOString() },
      }
    };
    const res = await fetch(`${FB_URL}?key=${FB_API_KEY}`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  } catch(e) {
    console.error("Firebase error:", e);
    return false;
  }
}

// ── WHATSAPP MSG BUILD ────────────────────
function buildWAMsg(rec) {
  const {name,age,dream,years,bad,good} = rec.input;
  return encodeURIComponent(
    `🔮 *FUTURE ME Simulation*\n\n`+
    `👤 *${name}* | Age ${age}\n`+
    `🌟 Dream: ${dream}\n`+
    `⏳ Timeline: +${years} years\n`+
    `⚠️ Bad: ${bad.join(", ")||"none"}\n`+
    `✅ Good: ${good.join(", ")||"none"}\n\n`+
    `📖 *Preview:*\n${rec.text.slice(0,200)}…`
  );
}

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════
export default function FutureMe() {
  const [tab,setTab]     = useState("simulate");
  const [form,setForm]   = useState({
    name:"",age:"",dream:"",skills:"",fear:"",
    sleep:7,phone:5,years:"5",bad:[],good:[],
  });
  const [phase,setPhase]   = useState(null);
  const [phDone,setPhDone] = useState([false,false,false,false]);
  const [result,setResult] = useState(null);
  const [fbStatus,setFbStatus] = useState(null); // null|"saving"|"ok"|"fail"
  const [history,setHistory]   = useState(()=>JSON.parse(localStorage.getItem("fme_h")||"[]"));
  const [modal,setModal]   = useState(null);
  const [letter,setLetter] = useState("");
  const [unlockDate,setUnlockDate] = useState(()=>{
    const d=new Date(); d.setFullYear(d.getFullYear()+5);
    return d.toISOString().split("T")[0];
  });
  const [sealed,setSealed] = useState(()=>{
    const s=JSON.parse(localStorage.getItem("fme_let")||"null");
    return s&&s.unlock>Date.now()?s:null;
  });
  const [toast,setToast] = useState("");
  const [ownerBadge,setOwnerBadge] = useState(null);

  const simRef=useRef(),histRef=useRef(),letRef=useRef();

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2800); };

  const scrollTo = sec => {
    setTab(sec);
    const r={simulate:simRef,history:histRef,letter:letRef}[sec];
    setTimeout(()=>r?.current?.scrollIntoView({behavior:"smooth"}),60);
  };

  const toggleTag = (type,label) =>
    setForm(f=>({...f,[type]:f[type].includes(label)?f[type].filter(x=>x!==label):[...f[type],label]}));

  // ── ANIMATE PHASES
  const animPhases = () => {
    setPhDone([false,false,false,false]);
    [0,1,2,3].forEach(i=>setTimeout(()=>setPhDone(p=>p.map((v,j)=>j<=i)),i*900));
  };

  // ── GENERATE
  const generate = async () => {
    if(!form.dream){ showToast("⚠ Enter your dream first!"); return; }
    setPhase("loading"); setResult(null); setFbStatus(null); animPhases();

    const prompt=`You are a powerful AI life simulator. Write a vivid emotional future story in second-person ("you"), under 350 words, flowing prose only — no headers, no bullets.

Person: ${form.name||"You"}, age ${form.age||"?"}
Dream: ${form.dream}
Skills: ${form.skills||"none"} | Fear: ${form.fear||"none"}
Sleep: ${form.sleep}hr/night | Phone: ${form.phone}hr/day
Bad habits: ${form.bad.join(", ")||"none"}
Good habits: ${form.good.join(", ")||"none"}
Simulate: ${form.years} years ahead

Cover: where they are now → what changed because of habits → vivid scene ${form.years} years later → the turning point → direct message to present self. Bad habits = real painful consequences. Good habits = real earned rewards. Be honest and deeply personal.`;

    try{
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:prompt}],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("")||"Generation failed. Try again.";
      const rec  = {text, input:{...form}, ts:Date.now(), id:Date.now()};
      setResult(rec);
      setPhase("done");

      // Firebase save
      setFbStatus("saving");
      const ok = await fbSave(rec);
      setFbStatus(ok?"ok":"fail");
      if(ok) showToast("☁ Saved to Firebase!");

      // Owner WA badge
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${buildWAMsg(rec)}`;
      setOwnerBadge({url:waUrl, name:form.name||"User"});
      setTimeout(()=>setOwnerBadge(null), 9000);

    }catch(e){
      showToast("❌ Error — try again"); setPhase(null);
      console.error(e);
    }
  };

  // ── LOCAL SAVE
  const saveLocal = () => {
    if(!result) return;
    const h=[result,...history].slice(0,50);
    setHistory(h); localStorage.setItem("fme_h",JSON.stringify(h));
    showToast("💾 Saved locally!");
  };

  const delHistory = id => {
    const h=history.filter(x=>x.id!==id);
    setHistory(h); localStorage.setItem("fme_h",JSON.stringify(h));
    showToast("🗑 Deleted");
  };

  // ── SHARE (user WA)
  const shareWA = () => {
    if(!result) return;
    window.open(`https://wa.me/?text=${buildWAMsg(result)}`,"_blank");
  };

  const shareCopy = () => {
    if(!result) return;
    navigator.clipboard.writeText(result.text.slice(0,300)+"…").then(()=>showToast("📋 Copied!"));
  };

  // ── LETTER
  const sealLetter = () => {
    if(!letter.trim()){ showToast("✏ Write your letter!"); return; }
    const unlock=new Date(unlockDate).getTime();
    if(unlock<=Date.now()){ showToast("⚠ Choose a future date!"); return; }
    const s={txt:letter,unlock};
    localStorage.setItem("fme_let",JSON.stringify(s));
    setSealed(s); showToast("🔒 Letter sealed!");
  };

  const breakSeal = () => {
    if(!window.confirm("Break the seal? Letter will be revealed.")) return;
    setLetter(sealed.txt); setSealed(null);
    localStorage.removeItem("fme_let");
  };

  const fmt = ts=>new Date(ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});

  const phLabels=["▸ Analyzing your habits","▸ Calculating life trajectory","▸ Writing your future story","▸ Saving to Firebase"];

  // ── SHARED STYLES
  const inp = {background:"rgba(255,255,255,.04)",border:"1px solid #1a1a30",color:"#e2e2f0",padding:".82rem 1rem",fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",outline:"none",width:"100%"};
  const btnP = {background:"#c8ff00",color:"#03030a",border:"none",padding:".9rem 2rem",fontFamily:"'Space Mono',monospace",fontSize:".74rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))"};
  const btnG = {background:"transparent",color:"#555572",border:"1px solid #1a1a30",padding:".9rem 2rem",fontFamily:"'Space Mono',monospace",fontSize:".74rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer"};
  const lbl  = {fontFamily:"'Space Mono',monospace",fontSize:".58rem",letterSpacing:".2em",color:"#555572",textTransform:"uppercase",marginBottom:".4rem",display:"block"};
  const div  = {height:1,background:"#1a1a30",margin:"1.5rem 0"};

  return(
    <div style={{minHeight:"100vh",background:"#03030a",color:"#e2e2f0",fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#c8ff00}
        input[type=range]{accent-color:#c8ff00} ::placeholder{color:#333355}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes rstP{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.015)}}
        @keyframes badgeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <Galaxy/>

      {/* RST WATERMARK */}
      <div style={{position:"fixed",inset:0,zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",overflow:"hidden"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(100px,26vw,300px)",letterSpacing:".2em",color:"transparent",WebkitTextStroke:"1px rgba(200,255,0,0.055)",textShadow:"0 0 120px rgba(200,255,0,0.03)",animation:"rstP 7s ease-in-out infinite",userSelect:"none"}}>
          RST
        </div>
      </div>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(3,3,10,.82)",backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(200,255,0,.07)",padding:"1rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",letterSpacing:".15em",color:"#c8ff00"}}>FUTURE ME</div>
        <div style={{display:"flex",gap:"1.5rem"}}>
          {["simulate","history","letter"].map(s=>(
            <button key={s} onClick={()=>scrollTo(s)} style={{fontFamily:"'Space Mono',monospace",fontSize:".6rem",letterSpacing:".2em",color:tab===s?"#c8ff00":"#555572",cursor:"pointer",textTransform:"uppercase",background:"none",border:"none",transition:"color .2s"}}>
              {s==="letter"?"5YR LETTER":s.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"2rem",position:"relative",zIndex:10}}>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:".63rem",letterSpacing:".32em",color:"#c8ff00",background:"rgba(200,255,0,.07)",border:"1px solid rgba(200,255,0,.17)",padding:".4rem 1.1rem",borderRadius:100,marginBottom:"2rem",animation:"fu .5s ease both"}}>
          ✦ AI-Powered Future Simulation
        </div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(4rem,16vw,9.5rem)",lineHeight:.88,animation:"fu .5s .1s ease both"}}>
          WHO WILL<br/><span style={{color:"#c8ff00"}}>YOU</span><br/><span style={{color:"#00e5ff"}}>BECOME?</span>
        </h1>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:"clamp(.68rem,2vw,.83rem)",color:"#555572",marginTop:"1.5rem",lineHeight:1.9,animation:"fu .5s .2s ease both"}}>
          Enter your present self.<br/>We'll reveal who you'll be.
        </p>
        <div style={{marginTop:"2.5rem",display:"flex",gap:"1rem",flexWrap:"wrap",justifyContent:"center",animation:"fu .5s .3s ease both"}}>
          <button style={btnP} onClick={()=>scrollTo("simulate")}>⚡ START SIMULATION</button>
          <button style={btnG} onClick={()=>scrollTo("history")}>VIEW HISTORY</button>
        </div>
      </section>

      {/* ── SIMULATE ── */}
      <section ref={simRef} style={{padding:"5rem 0",background:"rgba(11,11,22,.82)",backdropFilter:"blur(18px)",position:"relative",zIndex:10}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 1.5rem"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:".59rem",letterSpacing:".3em",color:"#c8ff00",textTransform:"uppercase",marginBottom:".55rem"}}>// Step 01</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,4.5rem)",lineHeight:1}}>YOUR PRESENT SELF</h2>
          <p style={{color:"#555572",fontSize:".84rem",lineHeight:1.7,marginTop:".4rem"}}>Fill in your reality. No filter. The AI builds your future.</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.2rem",marginTop:"2rem"}}>
            <div><label style={lbl}>Your Name</label><input style={inp} placeholder="e.g. Rusthi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
            <div><label style={lbl}>Current Age</label><input style={inp} type="number" placeholder="18" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>Your Big Dream / Goal</label><input style={inp} placeholder="e.g. Own a garage, music producer..." value={form.dream} onChange={e=>setForm(f=>({...f,dream:e.target.value}))}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>Current Skills</label><input style={inp} placeholder="e.g. coding, guitar, football..." value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>Biggest Fear / Obstacle</label><input style={inp} placeholder="e.g. lazy, no money..." value={form.fear} onChange={e=>setForm(f=>({...f,fear:e.target.value}))}/></div>
            <div><label style={lbl}>Sleep Hours / Night — <span style={{color:"#c8ff00"}}>{form.sleep}h</span></label><input type="range" min="3" max="12" value={form.sleep} onChange={e=>setForm(f=>({...f,sleep:+e.target.value}))} style={{width:"100%",marginTop:".5rem"}}/></div>
            <div><label style={lbl}>Phone Usage / Day — <span style={{color:"#c8ff00"}}>{form.phone}h</span></label><input type="range" min="0" max="16" value={form.phone} onChange={e=>setForm(f=>({...f,phone:+e.target.value}))} style={{width:"100%",marginTop:".5rem"}}/></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Bad Habits — tap to select</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:".45rem",marginTop:".25rem"}}>
                {BAD_HABITS.map(h=><Tag key={h} label={h} active={form.bad.includes(h)} onToggle={()=>toggleTag("bad",h)}/>)}
              </div>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Good Habits — tap to select</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:".45rem",marginTop:".25rem"}}>
                {GOOD_HABITS.map(h=><Tag key={h} label={h} active={form.good.includes(h)} onToggle={()=>toggleTag("good",h)}/>)}
              </div>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Simulation Timeline</label>
              <select style={{...inp,background:"rgba(11,11,22,.9)"}} value={form.years} onChange={e=>setForm(f=>({...f,years:e.target.value}))}>
                <option value="1">1 Year From Now</option>
                <option value="3">3 Years From Now</option>
                <option value="5">5 Years From Now</option>
                <option value="10">10 Years From Now</option>
              </select>
            </div>
            <div style={{gridColumn:"1/-1",display:"flex",flexDirection:"column",alignItems:"center",gap:".8rem",marginTop:".5rem"}}>
              <button style={{...btnP,width:"100%",maxWidth:340,fontSize:".85rem",padding:"1rem 2rem"}} onClick={generate}>⚡ SIMULATE MY FUTURE</button>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:".56rem",color:"#555572"}}>Claude AI · Firebase REST · localStorage</p>
            </div>
          </div>

          {/* LOADING */}
          {phase==="loading"&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",padding:"4rem 2rem",textAlign:"center"}}>
              <div style={{width:54,height:54,border:"2px solid #1a1a30",borderTopColor:"#c8ff00",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:".7rem",color:"#555572",letterSpacing:".2em"}}>SIMULATING YOUR FUTURE...</div>
                <div style={{marginTop:".75rem",display:"flex",flexDirection:"column",gap:".38rem"}}>
                  {phLabels.map((l,i)=>(
                    <div key={i} style={{fontFamily:"'Space Mono',monospace",fontSize:".6rem",color:phDone[i]?"#c8ff00":"#1a1a30",transition:"color .3s"}}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RESULT */}
          {phase==="done"&&result&&(
            <div style={{marginTop:"3rem"}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:".59rem",letterSpacing:".3em",color:"#c8ff00",textTransform:"uppercase",marginBottom:".55rem"}}>// Simulation Result</div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,4.5rem)",lineHeight:1}}>{(form.name||"YOUR").toUpperCase()}'S FUTURE</h2>
              <div style={{background:"rgba(11,11,22,.9)",border:"1px solid #1a1a30",padding:"2.5rem",marginTop:"1.5rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#c8ff00,#00e5ff,#ff3d7f)"}}/>
                {/* Meta */}
                <div style={{display:"flex",gap:"2rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
                  {[["Name",form.name||"You"],["Age",form.age||"?"],["Timeline",`+${form.years} Yrs`],["Dream",form.dream.slice(0,24)+(form.dream.length>24?"…":"")]].map(([k,v])=>(
                    <div key={k}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:".57rem",letterSpacing:".2em",color:"#555572",textTransform:"uppercase"}}>{k}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:".8rem",color:"#c8ff00"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={div}/>
                <TypeWriter text={result.text}/>

                {/* Firebase status */}
                <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",fontFamily:"'Space Mono',monospace",fontSize:".57rem",color:"#555572",background:"rgba(255,255,255,.03)",border:"1px solid #1a1a30",padding:".28rem .7rem",marginTop:".8rem",borderRadius:2}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:fbStatus==="ok"?"#c8ff00":fbStatus==="fail"?"#ff3d7f":"#555572",animation:fbStatus==="saving"?"spin 1s linear infinite":""}}/>
                  <span>{fbStatus==="saving"?"Saving to Firebase…":fbStatus==="ok"?"✅ Saved to Firebase":fbStatus==="fail"?"⚠ Firebase failed (saved locally)":"Firebase"}</span>
                </div>

                <div style={div}/>
                {/* Action buttons */}
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                  <button style={btnP} onClick={saveLocal}>💾 SAVE LOCAL</button>
                  <button style={{...btnG,background:"#25D366",color:"#fff",borderColor:"#25D366"}} onClick={shareWA}>📲 SHARE ON WHATSAPP</button>
                  <button style={btnG} onClick={shareCopy}>📋 COPY</button>
                  <button style={btnG} onClick={generate}>↺ RE-SIMULATE</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HISTORY ── */}
      <section ref={histRef} style={{padding:"5rem 0",background:"rgba(8,8,20,.8)",backdropFilter:"blur(18px)",position:"relative",zIndex:10}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 1.5rem"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:".59rem",letterSpacing:".3em",color:"#c8ff00",textTransform:"uppercase",marginBottom:".55rem"}}>// Archive</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,4.5rem)",lineHeight:1}}>PAST SIMULATIONS</h2>
          <p style={{color:"#555572",fontSize:".84rem",marginTop:".4rem"}}>Locally saved predictions.</p>
          {history.length===0?(
            <div style={{textAlign:"center",padding:"3rem",fontFamily:"'Space Mono',monospace",fontSize:".7rem",color:"#555572",border:"1px dashed #1a1a30",marginTop:"2rem"}}>
              No saves yet.<br/>Run a simulation and tap Save Local.
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"2rem"}}>
              {history.map(h=>(
                <div key={h.id} style={{background:"rgba(255,255,255,.025)",border:"1px solid #1a1a30",padding:"1.2rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",cursor:"pointer"}} onClick={()=>setModal(h)}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",marginBottom:".2rem"}}>{h.input?.name||"?"} — +{h.input?.years||"?"}YR</div>
                    <div style={{fontSize:".77rem",color:"#555572",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.text?.slice(0,88)}…</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:".57rem",color:"#555572",marginTop:".18rem"}}>📅 {fmt(h.ts)}</div>
                  </div>
                  <button style={{background:"transparent",border:"1px solid #1a1a30",color:"#555572",padding:".32rem .62rem",fontSize:".68rem",cursor:"pointer",flexShrink:0}} onClick={e=>{e.stopPropagation();delHistory(h.id);}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LETTER ── */}
      <section ref={letRef} style={{padding:"5rem 0",position:"relative",zIndex:10}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 1.5rem"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:".59rem",letterSpacing:".3em",color:"#c8ff00",textTransform:"uppercase",marginBottom:".55rem"}}>// Open After 5 Years</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,4.5rem)",lineHeight:1}}>DEAR FUTURE ME</h2>
          <p style={{color:"#555572",fontSize:".84rem",lineHeight:1.7,marginTop:".4rem"}}>Write a letter. Sealed until you're ready.</p>
          {!sealed?(
            <div style={{background:"rgba(11,11,22,.85)",border:"1px solid #1a1a30",padding:"2rem",marginTop:"1.5rem"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#00e5ff",marginBottom:"1.5rem"}}>✉ Dear Future Me,</div>
              <textarea value={letter} onChange={e=>setLetter(e.target.value)} rows={5}
                placeholder="Right now I am feeling… My biggest dream is… I promise myself that… By the time you read this, I hope…"
                style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid #1a1a30",color:"#e2e2f0",fontFamily:"'Space Mono',monospace",fontSize:".8rem",lineHeight:1.9,resize:"none",outline:"none",paddingBottom:"1rem",minHeight:110}}/>
              <div style={{marginTop:"1.5rem",display:"flex",alignItems:"flex-end",gap:"1rem",flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:200}}>
                  <label style={lbl}>Unlock Date</label>
                  <input type="date" value={unlockDate} onChange={e=>setUnlockDate(e.target.value)} style={{...inp,fontFamily:"'Space Mono',monospace",fontSize:".76rem"}}/>
                </div>
                <button style={btnP} onClick={sealLetter}>🔒 SEAL LETTER</button>
              </div>
            </div>
          ):(
            <div style={{background:"rgba(11,11,22,.85)",border:"1px solid rgba(0,229,255,.22)",padding:"2rem",marginTop:"1.5rem",textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"3rem",color:"#00e5ff"}}>🔒 LETTER SEALED</div>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:".68rem",color:"#555572",marginTop:".5rem"}}>
                Opens on <span style={{color:"#00e5ff"}}>{fmt(sealed.unlock)}</span>
              </p>
              <div style={{marginTop:"1.5rem",display:"flex",justifyContent:"center"}}>
                <Countdown ts={sealed.unlock}/>
              </div>
              <button style={{...btnG,marginTop:"1.5rem",fontSize:".6rem"}} onClick={breakSeal}>Break Seal Early</button>
            </div>
          )}
        </div>
      </section>

      <footer style={{borderTop:"1px solid #1a1a30",padding:"2rem 1.5rem",textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:".58rem",color:"#555572",position:"relative",zIndex:10}}>
        <span style={{color:"#c8ff00"}}>FUTURE ME</span> by RST · Claude AI · Firebase REST · All data yours
      </footer>

      {/* MODAL */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",backdropFilter:"blur(14px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}} onClick={()=>setModal(null)}>
          <div style={{background:"#0b0b16",border:"1px solid #1a1a30",maxWidth:700,width:"100%",maxHeight:"80vh",overflowY:"auto",padding:"2rem",position:"relative"}} onClick={e=>e.stopPropagation()}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#00e5ff,#c8ff00)"}}/>
            <button style={{position:"absolute",top:"1rem",right:"1rem",background:"transparent",border:"1px solid #1a1a30",color:"#555572",padding:".33rem .62rem",cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:".63rem"}} onClick={()=>setModal(null)}>✕ CLOSE</button>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.5rem",color:"#c8ff00",marginBottom:".38rem"}}>{modal.input?.name||"You"} — {modal.input?.years||"?"} Years Later</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:".58rem",color:"#555572",marginBottom:"1.5rem"}}>{fmt(modal.ts)} · Dream: {modal.input?.dream||"—"}</div>
            <div style={div}/>
            <p style={{fontSize:".92rem",lineHeight:1.95,color:"#e2e2f0",whiteSpace:"pre-wrap"}}>{modal.text}</p>
            <div style={{marginTop:"1.5rem"}}>
              <button style={{...btnG,fontSize:".65rem",padding:".6rem 1.2rem",background:"#25D366",color:"#fff",borderColor:"#25D366"}} onClick={()=>window.open(`https://wa.me/?text=${buildWAMsg(modal)}`,"_blank")}>📲 Share on WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {/* OWNER WA BADGE */}
      {ownerBadge&&(
        <div style={{position:"fixed",bottom:"5rem",right:"1.5rem",zIndex:999,background:"#25D366",color:"#fff",fontFamily:"'Space Mono',monospace",fontSize:".63rem",padding:".58rem 1rem",cursor:"pointer",borderRadius:4,boxShadow:"0 4px 20px rgba(37,211,102,.4)",animation:"badgeIn .4s ease"}} onClick={()=>{window.open(ownerBadge.url,"_blank");setOwnerBadge(null);}}>
          📲 Notify Rusthi: {ownerBadge.name}
        </div>
      )}

      <Toast msg={toast}/>
    </div>
  );
}
