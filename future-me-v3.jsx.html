import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════
// CONFIGURATIONS
// ══════════════════════════════════════════
const FB_PROJECT = "my-ca692";
const FB_API_KEY = "AIzaSyCgnECagUEpd9X6BoUHAnnpbnst1mlY1dY";
const FB_URL = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/simulations`;

// Claude API Key - இதை நீங்கள் பூர்த்தி செய்யவும்
const CLAUDE_API_KEY = "https://api.anthropic.com/v1/organizations/api_keys/apikey_01Rj2N8SVvo6BePZj99NhmiT"; 

const WA_NUMBER = "94727676806";

const BAD_HABITS  = ["Late Sleep","Procrastination","Too Much Social Media","No Exercise","Junk Food","No Reading","Gaming Addiction","Overthinking"];
const GOOD_HABITS = ["Daily Coding","Reading Books","Exercise","Learning Skills","Early Wake","Music / Art","Saving Money","Prayer / Meditation"];

// ── GALAXY BACKGROUND ─────────────────────
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
      stars.forEach(s=>{
        cx.globalAlpha = s.a;
        cx.fillStyle="#fff"; cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2); cx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize", resize);
    return ()=> { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

// ── UI COMPONENTS ─────────────────────────
function Tag({label, active, onToggle}) {
  return (
    <button onClick={onToggle} style={{
      background: active?"rgba(200,255,0,.1)":"rgba(255,255,255,.03)",
      border:`1px solid ${active?"#c8ff00":"#1a1a30"}`,
      color: active?"#c8ff00":"#555572",
      padding:".4rem .8rem", cursor:"pointer", borderRadius:2, fontSize:".6rem", textTransform:"uppercase"
    }}>{label}</button>
  );
}

function TypeWriter({text}){
  const [shown,setShown]=useState("");
  useEffect(()=>{
    setShown(""); let i=0;
    const iv=setInterval(()=>{
      if(i<text.length) setShown(text.slice(0,++i));
      else clearInterval(iv);
    },10);
    return()=>clearInterval(iv);
  },[text]);
  return <p style={{fontSize:".9rem",lineHeight:1.8,color:"#e2e2f0",whiteSpace:"pre-wrap"}}>{shown}</p>;
}

// ── FIREBASE SAVE FUNCTION ────────────────
async function fbSave(rec) {
  try {
    const body = {
      fields: {
        name: { stringValue: rec.input.name },
        dream: { stringValue: rec.input.dream },
        result: { stringValue: rec.text },
        ts: { stringValue: new Date().toISOString() }
      }
    };
    const res = await fetch(`${FB_URL}?key=${FB_API_KEY}`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch(e) { return false; }
}

// ── MAIN APP ──────────────────────────────
export default function FutureMe() {
  const [form, setForm] = useState({
    name:"", age:"", dream:"", skills:"", fear:"",
    sleep:7, phone:5, years:"5", bad:[], good:[],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const generate = async () => {
    if(!form.dream || !form.name) return showToast("Name and Dream required!");
    setLoading(true);
    
    const prompt = `Simulate a future story for ${form.name} in ${form.years} years. Dream: ${form.dream}, Habits: ${form.bad.join(", ")}. Write emotional 2nd person prose.`;

    try {
      // Note: Anthropic usually needs a backend due to CORS. 
      // If this fails in local browser, it's a CORS restriction.
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content[0].text;
      
      const rec = { text, input: form, ts: Date.now() };
      setResult(rec);
      await fbSave(rec);
      showToast("Simulation Complete & Saved!");
    } catch (e) {
      showToast("Error generating story.");
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#fff", padding: "10px", width: "100%", marginBottom: "15px" };

  return (
    <div style={{ background: "#03030a", color: "#fff", minHeight: "100vh", padding: "50px 20px", position: "relative" }}>
      <Galaxy />
      
      <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3rem", color: "#c8ff00" }}>FUTURE ME</h1>
        
        {!result ? (
          <div>
            <label>Name</label>
            <input style={inpStyle} onChange={e=>setForm({...form, name:e.target.value})} />
            
            <label>Dream</label>
            <input style={inpStyle} onChange={e=>setForm({...form, dream:e.target.value})} />

            <label>Bad Habits</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}>
              {BAD_HABITS.map(h => (
                <Tag key={h} label={h} active={form.bad.includes(h)} 
                  onToggle={() => setForm({...form, bad: form.bad.includes(h)?form.bad.filter(x=>x!==h):[...form.bad, h]})} />
              ))}
            </div>

            <button 
              onClick={generate}
              disabled={loading}
              style={{ background: "#c8ff00", color: "#000", padding: "15px", width: "100%", border: "none", fontWeight: "bold", cursor: "pointer" }}>
              {loading ? "ANALYZING..." : "START SIMULATION"}
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", border: "1px solid #c8ff00" }}>
            <h2 style={{ color: "#c8ff00" }}>THE YEAR {new Date().getFullYear() + parseInt(form.years)}</h2>
            <TypeWriter text={result.text} />
            <button onClick={() => setResult(null)} style={{ marginTop: "20px", background: "none", border: "1px solid #555", color: "#555", padding: "10px", cursor: "pointer" }}>RESET</button>
          </div>
        )}
      </div>

      {toast && <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "#c8ff00", color: "#000", padding: "10px 20px", borderRadius: "5px" }}>{toast}</div>}
    </div>
  );
        }
      
