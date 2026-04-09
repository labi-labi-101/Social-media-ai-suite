import { useState } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PLATFORM_CONFIG = {
  Instagram: { max: 30, color: "#E1306C", icon: "📸" },
  TikTok:    { max: 10, color: "#00BCD4", icon: "🎵" },
  Twitter:   { max: 3,  color: "#1DA1F2", icon: "𝕏" },
  LinkedIn:  { max: 5,  color: "#0A66C2", icon: "💼" },
  YouTube:   { max: 15, color: "#FF0000", icon: "▶" },
};
const TONES = ["Viral","Professional","Trendy","Educational","Inspirational","Funny"];
const CAPTION_STYLES = ["Hook + Story","Question Lead","Bold Statement","List Format","Behind the Scenes","CTA Focused"];
const GOALS = ["Grow followers","Drive sales","Build community","Boost engagement","Launch a product"];
const FREE_LIMIT = 5;

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Instagram Creator · 42k followers", text: "I went from spending 2 hours finding hashtags to 2 minutes. My reach doubled in the first week.", avatar: "SM" },
  { name: "James K.", role: "Social Media Manager", text: "The competitor analysis alone is worth it. I found 4 content gaps my client's rivals were missing.", avatar: "JK" },
  { name: "Priya R.", role: "E-commerce founder", text: "The 30-day calendar is a game changer. I finally have a consistent posting strategy.", avatar: "PR" },
];

const FEATURES = [
  { icon: "#️⃣", title: "Hashtag Research", desc: "Get high, medium & niche hashtags optimised for your exact platform and audience." },
  { icon: "✍️", title: "Caption Generator", desc: "3 ready-to-post captions in seconds. Pick your style, tone, and CTA." },
  { icon: "🔍", title: "Competitor Intel", desc: "Uncover content gaps, trending angles & the hashtags your competitors rely on." },
  { icon: "📅", title: "30-Day Calendar", desc: "A full month of post ideas, hooks, and content types — built around your niche." },
  { icon: "📄", title: "PDF Export", desc: "Download your research as a clean report to share with your team or clients." },
  { icon: "🕓", title: "Search History", desc: "Every result saved automatically. Come back anytime, never lose your research." },
];

let _history = [];
let _usageCount = 0;

function saveToHistory(entry) {
  _history = [{ ...entry, id: Date.now(), date: new Date().toLocaleString() }, ..._history].slice(0, 30);
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map(i => i.text || "").join("") || "";
  return text.replace(/```json|```/g, "").trim();
}

function exportToPDF(content, title) {
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>${title}</title><style>
    body{font-family:Georgia,serif;max-width:750px;margin:40px auto;color:#1a1a2e;line-height:1.7;}
    h1{color:#4f46e5;border-bottom:3px solid #4f46e5;padding-bottom:12px;}
    h2{color:#4f46e5;font-size:15px;text-transform:uppercase;letter-spacing:2px;margin-top:28px;}
    .tag{display:inline-block;background:#ede9fe;border:1px solid #c4b5fd;color:#4f46e5;padding:3px 10px;border-radius:5px;margin:3px;font-size:13px;}
    .box{background:#f8f7ff;border-left:4px solid #4f46e5;padding:14px 18px;margin:12px 0;border-radius:0 8px 8px 0;}
    .meta{color:#6b7280;font-size:12px;margin-bottom:24px;}
  </style></head><body>${content}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | app
  const [activeTab, setActiveTab] = useState("research");
  const [history, setHistory] = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  function trackUsage() {
    if (isPro) return true;
    _usageCount += 1;
    setUsageCount(_usageCount);
    if (_usageCount > FREE_LIMIT) { setShowPaywall(true); return false; }
    return true;
  }

  function addToHistory(entry) {
    saveToHistory(entry);
    setHistory([..._history]);
  }

  if (screen === "landing") return <Landing onStart={() => setScreen("app")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f8ff", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;900&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9ca3af; }
        input:focus { outline: none; }
        button { font-family: inherit; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.35s ease; }
      `}</style>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onUnlock={() => { setIsPro(true); setShowPaywall(false); }} />}

      {/* Top nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>✦</div>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>HashFlow</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isPro ? (
              <>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{Math.max(0, FREE_LIMIT - usageCount)} free searches left</span>
                <button onClick={() => setShowPaywall(true)} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Upgrade to Pro
                </button>
              </>
            ) : (
              <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#059669", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>✓ Pro Active</div>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {[
            { id: "research", label: "# Research" },
            { id: "caption", label: "✍️ Caption" },
            { id: "competitor", label: "🔍 Competitor" },
            { id: "calendar", label: "📅 Calendar" },
            { id: "history", label: "🕓 History", badge: history.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "14px 18px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: activeTab === tab.id ? "#4f46e5" : "#6b7280",
              borderBottom: activeTab === tab.id ? "2px solid #4f46e5" : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.15s", position: "relative",
            }}>
              {tab.label}
              {tab.badge > 0 && <span style={{ marginLeft: 5, background: "#4f46e5", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 9 }}>{tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 80px" }}>
        {activeTab === "research"   && <ResearchTab   trackUsage={trackUsage} addToHistory={addToHistory} isPro={isPro} />}
        {activeTab === "caption"    && <CaptionTab    trackUsage={trackUsage} addToHistory={addToHistory} isPro={isPro} />}
        {activeTab === "competitor" && <CompetitorTab trackUsage={trackUsage} addToHistory={addToHistory} isPro={isPro} />}
        {activeTab === "calendar"   && <CalendarTab   trackUsage={trackUsage} addToHistory={addToHistory} isPro={isPro} />}
        {activeTab === "history"    && <HistoryTab    history={history} setHistory={setHistory} setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", background: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;900&display=swap'); *{box-sizing:border-box;} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} .hero-animate{animation:fadeUp 0.6s ease both;}`}</style>

      {/* NAV */}
      <nav style={{ padding: "0 32px", borderBottom: "1px solid #f3f4f6", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>✦</div>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 22, color: "#1a1a2e" }}>HashFlow</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={onStart} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Try Free</button>
            <button onClick={onStart} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#faf9ff 0%,#f0eeff 100%)", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="hero-animate" style={{ animationDelay: "0s", display: "inline-flex", alignItems: "center", gap: 8, background: "#ede9fe", border: "1px solid #c4b5fd", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#7c3aed", fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>
            ✦ AI-POWERED · FREE TO START
          </div>
          <h1 className="hero-animate" style={{ animationDelay: "0.1s", fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 1.1, color: "#1a1a2e", marginBottom: 20 }}>
            Grow Your Social Media<br />
            <span style={{ color: "#4f46e5" }}>10x Faster with AI</span>
          </h1>
          <p className="hero-animate" style={{ animationDelay: "0.2s", fontSize: 18, color: "#6b7280", lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Find the perfect hashtags, write captions that convert, analyse your competitors, and plan a month of content — all in seconds.
          </p>
          <div className="hero-animate" style={{ animationDelay: "0.3s", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onStart} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 30px rgba(79,70,229,0.35)" }}>
              Start Free — No Sign Up Needed →
            </button>
          </div>
          <p className="hero-animate" style={{ animationDelay: "0.4s", fontSize: 12, color: "#9ca3af", marginTop: 14 }}>
            5 free searches · No credit card required · Upgrade anytime
          </p>
        </div>
      </div>

      {/* SOCIAL PROOF BAR */}
      <div style={{ background: "#1a1a2e", padding: "18px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          {[["2,400+","Creators using HashFlow"],["4.9★","Average rating"],["10M+","Hashtags researched"],["$9/mo","Full Pro access"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#a5b4fc", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900 }}>{val}</div>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Everything You Need</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#1a1a2e" }}>One tool. Total social media control.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "#f9f8ff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px", transition: "box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(79,70,229,0.12)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "80px 24px", background: "#f9f8ff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Real Results</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#1a1a2e" }}>Creators love HashFlow</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ color: "#f59e0b", fontSize: 16, marginBottom: 14 }}>★★★★★</div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Simple Pricing</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#1a1a2e", marginBottom: 48 }}>Start free. Upgrade when ready.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 600, margin: "0 auto" }}>
            {/* Free */}
            <div style={{ background: "#f9f8ff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 24px", textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>FREE</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 900, color: "#1a1a2e", marginBottom: 16 }}>$0</div>
              {["5 AI searches","All 4 tools","PDF export","Search history"].map(f => <div key={f} style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>✓ {f}</div>)}
              <button onClick={onStart} style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#4f46e5", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Try Free</button>
            </div>
            {/* Pro */}
            <div style={{ background: "linear-gradient(160deg,#4f46e5,#7c3aed)", borderRadius: 16, padding: "28px 24px", textAlign: "left", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 12, background: "#fbbf24", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 10, letterSpacing: 1 }}>POPULAR</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", marginBottom: 8 }}>PRO</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 4 }}>$9<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: "#a5b4fc", marginBottom: 16 }}>Cancel anytime</div>
              {["Unlimited searches","All 4 tools","PDF export","Full history (500)","Priority AI speed"].map(f => <div key={f} style={{ fontSize: 13, color: "#e0e7ff", marginBottom: 8 }}>✓ {f}</div>)}
              <button onClick={onStart} style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 10, border: "none", background: "#fff", color: "#4f46e5", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Get Pro →</button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#2d1b69)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
          Ready to grow faster?
        </h2>
        <p style={{ color: "#a5b4fc", fontSize: 16, marginBottom: 32 }}>Join 2,400+ creators already using HashFlow</p>
        <button onClick={onStart} style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", color: "#fff", border: "none", borderRadius: 12, padding: "18px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 30px rgba(129,140,248,0.4)" }}>
          Start Free Now →
        </button>
        <p style={{ color: "#6b7280", fontSize: 12, marginTop: 14 }}>No credit card · No sign up · 5 free searches instantly</p>
      </div>

      <div style={{ background: "#0f0f1a", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#374151", fontSize: 12 }}>© 2026 HashFlow · Powered by Claude AI</p>
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function PaywallModal({ onClose, onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 420, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "fadeUp 0.3s ease" }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>✦</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 900, color: "#1a1a2e", marginBottom: 8 }}>You've used your 5 free searches</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Upgrade to Pro for unlimited access to all tools.</p>
        </div>

        <div style={{ background: "#f9f8ff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", marginBottom: 12 }}>Everything in Pro:</div>
          {["Unlimited AI searches","30-day content calendar","PDF export for all results","Full search history"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 18, height: 18, background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#059669", flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: "#374151" }}>{f}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 14, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 900, color: "#4f46e5" }}>$9</span>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>/month · Cancel anytime</span>
          </div>
        </div>

        <a href="https://buy.stripe.com/YOUR_STRIPE_LINK" target="_blank" style={{ display: "block", width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "center", textDecoration: "none", marginBottom: 10 }}>
          🚀 Upgrade to Pro — $9/month
        </a>

        <div style={{ marginBottom: 10 }}>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Have a promo code? Enter it here"
            onKeyDown={e => { if (e.key === "Enter") { if (code.trim().toLowerCase() === "pro2024") { onUnlock(); } else { setError("Invalid code. Try: pro2024"); } } }}
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1a1a2e" }} />
          {error && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{error}</div>}
          <button onClick={() => { if (code.trim().toLowerCase() === "pro2024") { onUnlock(); } else { setError("Invalid code. Try: pro2024"); } }}
            style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#4f46e5", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Apply Code
          </button>
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "transparent", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>Maybe later</button>
        <p style={{ textAlign: "center", color: "#d1d5db", fontSize: 10, marginTop: 8 }}>Demo unlock code: pro2024</p>
      </div>
    </div>
  );
}

// ─── RESEARCH TAB ─────────────────────────────────────────────────────────────
function ResearchTab({ trackUsage, addToHistory, isPro }) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Viral");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [subTab, setSubTab] = useState("hashtags");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!topic.trim() || !trackUsage()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const text = await callClaude(`Social media SEO expert. Topic: "${topic}" on ${platform}, tone: ${tone}. Return ONLY JSON: {"hashtags":{"high_volume":["#t1","#t2","#t3","#t4","#t5"],"medium_volume":["#t1","#t2","#t3","#t4","#t5"],"niche":["#t1","#t2","#t3","#t4","#t5"]},"seo_keywords":["k1","k2","k3","k4","k5"],"caption_hook":"One killer opening line","best_post_times":["t1","t2","t3"],"content_tip":"One specific actionable tip","trending_angle":"A fresh trending angle"}`);
      const parsed = JSON.parse(text);
      setResult(parsed);
      addToHistory({ type: "research", topic, platform, tone, result: parsed });
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const allTags = result ? [...result.hashtags.high_volume, ...result.hashtags.medium_volume, ...result.hashtags.niche].slice(0, PLATFORM_CONFIG[platform].max) : [];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <PageHeader title="Hashtag & SEO Research" subtitle="Find the best hashtags and keywords for your content — instantly." />
      <Card>
        <Field label="What's your post or niche about?">
          <StyledInput value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} placeholder="e.g. morning skincare routine, gym motivation, vegan meal prep..." />
        </Field>
        <Field label="Platform">
          <Pills items={Object.entries(PLATFORM_CONFIG).map(([p, c]) => ({ label: `${c.icon} ${p}`, value: p, color: c.color }))} selected={platform} onSelect={setPlatform} />
        </Field>
        <Field label="Tone">
          <Pills items={TONES.map(t => ({ label: t, value: t, color: "#4f46e5" }))} selected={tone} onSelect={setTone} />
        </Field>
        <PrimaryBtn onClick={run} disabled={loading || !topic.trim()}>
          {loading ? <Spinner /> : "⚡ Generate Research"}
        </PrimaryBtn>
      </Card>
      {error && <ErrBox>{error}</ErrBox>}
      {result && (
        <div className="fade-up">
          <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", marginBottom: 20 }}>
            {["hashtags", "seo", "strategy"].map(t => (
              <button key={t} onClick={() => setSubTab(t)} style={{ padding: "10px 20px", border: "none", background: "transparent", fontWeight: 600, fontSize: 13, cursor: "pointer", color: subTab === t ? "#4f46e5" : "#9ca3af", borderBottom: subTab === t ? "2px solid #4f46e5" : "2px solid transparent", marginBottom: -2, fontFamily: "inherit" }}>
                {t === "hashtags" ? "# Hashtags" : t === "seo" ? "🔍 Keywords" : "💡 Strategy"}
              </button>
            ))}
          </div>

          {subTab === "hashtags" && (
            <div>
              {[{ label: "High Volume", key: "high_volume", color: "#f59e0b", bg: "#fffbeb", tip: "Massive reach, competitive" },
                { label: "Medium Volume", key: "medium_volume", color: "#10b981", bg: "#ecfdf5", tip: "Balanced reach & discovery" },
                { label: "Niche", key: "niche", color: "#4f46e5", bg: "#ede9fe", tip: "Targeted, easier to rank" }].map(({ label, key, color, bg, tip }) => (
                <div key={key} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                    <span style={{ color: "#9ca3af", fontSize: 11 }}>{tip}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {result.hashtags[key].map(tag => (
                      <span key={tag} onClick={() => navigator.clipboard.writeText(tag)} title="Click to copy"
                        style={{ background: "#fff", border: `1.5px solid ${color}40`, color, padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { navigator.clipboard.writeText(allTags.join(" ")); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ flex: 1, padding: "12px", borderRadius: 10, border: "2px solid #4f46e5", background: copied ? "#4f46e5" : "#fff", color: copied ? "#fff" : "#4f46e5", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                  {copied ? "✓ Copied to clipboard!" : `Copy All ${PLATFORM_CONFIG[platform].max} Hashtags`}
                </button>
                <button onClick={() => {
                  const all = [...result.hashtags.high_volume, ...result.hashtags.medium_volume, ...result.hashtags.niche];
                  exportToPDF(`<h1>Hashtag Research</h1><div class="meta">Topic: <strong>${topic}</strong> · Platform: <strong>${platform}</strong></div><h2>High Volume</h2><div>${result.hashtags.high_volume.map(t=>`<span class="tag">${t}</span>`).join("")}</div><h2>Medium Volume</h2><div>${result.hashtags.medium_volume.map(t=>`<span class="tag">${t}</span>`).join("")}</div><h2>Niche</h2><div>${result.hashtags.niche.map(t=>`<span class="tag">${t}</span>`).join("")}</div><h2>SEO Keywords</h2><div>${result.seo_keywords.map(k=>`<span class="tag">${k}</span>`).join("")}</div><div class="box">Hook: ${result.caption_hook}</div>`, `Research - ${topic}`)
                }} style={{ padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>📄 PDF</button>
              </div>
            </div>
          )}

          {subTab === "seo" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoCard label="SEO Keywords to weave into your caption" color="#4f46e5">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.seo_keywords.map(kw => <span key={kw} style={{ background: "#ede9fe", border: "1px solid #c4b5fd", color: "#4f46e5", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{kw}</span>)}
                </div>
              </InfoCard>
              <InfoCard label="✍️ Caption Hook" color="#f59e0b">
                <p style={{ color: "#92400e", fontSize: 15, margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>"{result.caption_hook}"</p>
              </InfoCard>
            </div>
          )}

          {subTab === "strategy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoCard label="🕐 Best Times to Post" color="#10b981">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {result.best_post_times.map(t => <span key={t} style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#059669", padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>⏰ {t}</span>)}
                </div>
              </InfoCard>
              <InfoCard label="🔥 Trending Angle" color="#7c3aed">
                <p style={{ color: "#5b21b6", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{result.trending_angle}</p>
              </InfoCard>
              <InfoCard label="💡 Boost Your Reach" color="#f59e0b">
                <p style={{ color: "#92400e", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{result.content_tip}</p>
              </InfoCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CAPTION TAB ─────────────────────────────────────────────────────────────
function CaptionTab({ trackUsage, addToHistory }) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [style, setStyle] = useState("Hook + Story");
  const [cta, setCta] = useState("Follow for more");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [error, setError] = useState("");

  const run = async () => {
    if (!topic.trim() || !trackUsage()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const text = await callClaude(`Expert ${platform} copywriter. Topic: "${topic}". Style: ${style}. CTA: "${cta}". Return ONLY JSON: {"captions":[{"label":"Version A","text":"full caption with emojis","why":"brief reason"},{"label":"Version B","text":"...","why":"..."},{"label":"Version C","text":"...","why":"..."}],"emoji_pack":["e1","e2","e3","e4","e5","e6"],"cta_variations":["c1","c2","c3"]}`);
      const parsed = JSON.parse(text);
      setResult(parsed);
      addToHistory({ type: "caption", topic, platform, style, result: parsed });
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <PageHeader title="Caption Generator" subtitle="3 scroll-stopping captions written and ready to post in seconds." />
      <Card>
        <Field label="What's your post about?">
          <StyledInput value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} placeholder="e.g. product launch, before & after transformation, recipe tutorial..." />
        </Field>
        <Field label="Platform"><Pills items={Object.entries(PLATFORM_CONFIG).map(([p, c]) => ({ label: `${c.icon} ${p}`, value: p, color: c.color }))} selected={platform} onSelect={setPlatform} /></Field>
        <Field label="Caption Style"><Pills items={CAPTION_STYLES.map(s => ({ label: s, value: s, color: "#10b981" }))} selected={style} onSelect={setStyle} /></Field>
        <Field label="Your Call to Action">
          <StyledInput value={cta} onChange={e => setCta(e.target.value)} placeholder="e.g. Follow for more, Link in bio, Drop a 🔥 below..." />
        </Field>
        <PrimaryBtn onClick={run} disabled={loading || !topic.trim()}>{loading ? <Spinner /> : "✍️ Generate 3 Captions"}</PrimaryBtn>
      </Card>
      {error && <ErrBox>{error}</ErrBox>}
      {result && (
        <div className="fade-up">
          {result.captions.map((cap, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{cap.label}</span>
                <button onClick={() => { navigator.clipboard.writeText(cap.text); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }}
                  style={{ background: copiedIdx === i ? "#ecfdf5" : "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: copiedIdx === i ? "#059669" : "#6b7280", padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  {copiedIdx === i ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>{cap.text}</p>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0, borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>💡 {cap.why}</p>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InfoCard label="🎯 Emoji Pack" color="#f59e0b">
              <div style={{ fontSize: 22, letterSpacing: 4 }}>{result.emoji_pack.join(" ")}</div>
            </InfoCard>
            <InfoCard label="📣 CTA Variations" color="#4f46e5">
              {result.cta_variations.map((c, i) => <div key={i} style={{ color: "#4f46e5", fontSize: 12, padding: "5px 0", borderBottom: i < 2 ? "1px solid #ede9fe" : "none" }}>→ {c}</div>)}
            </InfoCard>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPETITOR TAB ───────────────────────────────────────────────────────────
function CompetitorTab({ trackUsage, addToHistory }) {
  const [niche, setNiche] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async () => {
    if (!niche.trim() || !trackUsage()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const text = await callClaude(`Social media competitor analyst. Niche: "${niche}"${competitor ? `, competitor: "${competitor}"` : ""}. Platform: ${platform}. Return ONLY JSON: {"content_gaps":["g1","g2","g3","g4"],"winning_content_types":[{"type":"t","why":"w","example":"e"},{"type":"t","why":"w","example":"e"},{"type":"t","why":"w","example":"e"}],"competitor_weaknesses":["w1","w2","w3"],"your_opportunity":"One specific untapped opportunity","top_hashtags_they_use":["#t1","#t2","#t3","#t4","#t5"],"posting_frequency":"Recommended posting frequency","differentiation_ideas":["i1","i2","i3"]}`);
      const parsed = JSON.parse(text);
      setResult(parsed);
      addToHistory({ type: "competitor", niche, competitor, platform, result: parsed });
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <PageHeader title="Competitor Analysis" subtitle="Find content gaps, winning strategies, and untapped opportunities in your niche." />
      <Card>
        <Field label="Your niche"><StyledInput value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. fitness coaching, vegan food, personal finance..." /></Field>
        <Field label="Competitor handle (optional)"><StyledInput value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder="@competitor — leave blank for general niche analysis" /></Field>
        <Field label="Platform"><Pills items={Object.entries(PLATFORM_CONFIG).map(([p, c]) => ({ label: `${c.icon} ${p}`, value: p, color: c.color }))} selected={platform} onSelect={setPlatform} /></Field>
        <PrimaryBtn onClick={run} disabled={loading || !niche.trim()}>{loading ? <Spinner /> : "🔍 Analyse Competitors"}</PrimaryBtn>
      </Card>
      {error && <ErrBox>{error}</ErrBox>}
      {result && (
        <div className="fade-up">
          <div style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", border: "2px solid #6ee7b7", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🎯 Your #1 Opportunity</div>
            <p style={{ color: "#064e3b", fontSize: 15, margin: 0, lineHeight: 1.7, fontWeight: 500 }}>{result.your_opportunity}</p>
          </div>
          <InfoCard label="🏆 Winning Content Types" color="#f59e0b" style={{ marginBottom: 12 }}>
            {result.winning_content_types.map((item, i) => (
              <div key={i} style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ color: "#b45309", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{item.type}</div>
                <div style={{ color: "#78716c", fontSize: 12, marginBottom: 2 }}>Why it works: {item.why}</div>
                <div style={{ color: "#059669", fontSize: 11, fontWeight: 600 }}>→ Try: {item.example}</div>
              </div>
            ))}
          </InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <InfoCard label="⚠️ Their Weaknesses" color="#ef4444">
              {result.competitor_weaknesses.map((w, i) => <div key={i} style={{ color: "#991b1b", fontSize: 12, marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #fca5a5" }}>{w}</div>)}
            </InfoCard>
            <InfoCard label="🕳️ Content Gaps" color="#4f46e5">
              {result.content_gaps.map((g, i) => <div key={i} style={{ color: "#3730a3", fontSize: 12, marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #a5b4fc" }}>{g}</div>)}
            </InfoCard>
          </div>
          <InfoCard label="#️⃣ Hashtags They Use" color="#10b981">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {result.top_hashtags_they_use.map(t => <span key={t} onClick={() => navigator.clipboard.writeText(t)} title="Copy" style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#059669", padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t}</span>)}
            </div>
          </InfoCard>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR TAB ─────────────────────────────────────────────────────────────
function CalendarTab({ trackUsage, addToHistory }) {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [goal, setGoal] = useState("Grow followers");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [error, setError] = useState("");

  const run = async () => {
    if (!niche.trim() || !trackUsage()) return;
    setLoading(true); setResult(null); setError(""); setActiveWeek(1);
    try {
      const text = await callClaude(`Social media strategist. 30-day content calendar for niche: "${niche}", platform: ${platform}, goal: "${goal}". Return ONLY JSON: {"weeks":[{"week":1,"theme":"theme","posts":[{"day":1,"type":"Reel","content_idea":"idea","hook":"hook"},{"day":3,"type":"Post","content_idea":"idea","hook":"hook"},{"day":5,"type":"Story","content_idea":"idea","hook":"hook"}]},{"week":2,"theme":"theme","posts":[{"day":8,"type":"...","content_idea":"...","hook":"..."},{"day":10,"type":"...","content_idea":"...","hook":"..."},{"day":12,"type":"...","content_idea":"...","hook":"..."}]},{"week":3,"theme":"theme","posts":[{"day":15,"type":"...","content_idea":"...","hook":"..."},{"day":17,"type":"...","content_idea":"...","hook":"..."},{"day":19,"type":"...","content_idea":"...","hook":"..."}]},{"week":4,"theme":"theme","posts":[{"day":22,"type":"...","content_idea":"...","hook":"..."},{"day":25,"type":"...","content_idea":"...","hook":"..."},{"day":28,"type":"...","content_idea":"...","hook":"..."}]}],"monthly_tip":"tip","content_pillars":["p1","p2","p3","p4"]}`);
      const parsed = JSON.parse(text);
      setResult(parsed);
      addToHistory({ type: "calendar", niche, platform, goal, result: parsed });
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const TYPE_COLORS = { Reel: "#E1306C", Story: "#f59e0b", Post: "#4f46e5", Carousel: "#10b981", Video: "#ef4444", Live: "#3b82f6" };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <PageHeader title="30-Day Content Calendar" subtitle="A full month of post ideas, hooks, and content types built around your niche." />
      <Card>
        <Field label="Your niche"><StyledInput value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} placeholder="e.g. fitness coaching, photography, home decor..." /></Field>
        <Field label="Platform"><Pills items={Object.entries(PLATFORM_CONFIG).map(([p, c]) => ({ label: `${c.icon} ${p}`, value: p, color: c.color }))} selected={platform} onSelect={setPlatform} /></Field>
        <Field label="Monthly goal"><Pills items={GOALS.map(g => ({ label: g, value: g, color: "#7c3aed" }))} selected={goal} onSelect={setGoal} /></Field>
        <PrimaryBtn onClick={run} disabled={loading || !niche.trim()}>{loading ? <Spinner /> : "📅 Build My 30-Day Calendar"}</PrimaryBtn>
      </Card>
      {error && <ErrBox>{error}</ErrBox>}
      {result && (
        <div className="fade-up">
          <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 2, marginRight: 4 }}>📌 Pillars:</span>
            {result.content_pillars.map(p => <span key={p} style={{ background: "#ede9fe", border: "1px solid #c4b5fd", color: "#4f46e5", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p}</span>)}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {result.weeks.map(w => (
              <button key={w.week} onClick={() => setActiveWeek(w.week)} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: activeWeek === w.week ? "2px solid #7c3aed" : "1.5px solid #e5e7eb", background: activeWeek === w.week ? "#faf5ff" : "#fff", color: activeWeek === w.week ? "#7c3aed" : "#6b7280", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Week {w.week}
              </button>
            ))}
          </div>
          {result.weeks.filter(w => w.week === activeWeek).map(week => (
            <div key={week.week}>
              <div style={{ color: "#7c3aed", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Week {week.week}: {week.theme}</div>
              {week.posts.map((post, i) => {
                const col = TYPE_COLORS[post.type] || "#6b7280";
                return (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px", marginBottom: 10, display: "flex", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ textAlign: "center", minWidth: 44 }}>
                      <div style={{ color: "#1a1a2e", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, lineHeight: 1 }}>D{post.day}</div>
                      <div style={{ background: col, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 6, padding: "2px 5px", marginTop: 4, whiteSpace: "nowrap" }}>{post.type}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600, marginBottom: 5, lineHeight: 1.5 }}>{post.content_idea}</div>
                      <div style={{ color: "#9ca3af", fontSize: 12 }}>🪝 {post.hook}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <InfoCard label="🎯 Monthly Strategy Tip" color="#7c3aed" style={{ marginTop: 12 }}>
            <p style={{ color: "#5b21b6", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{result.monthly_tip}</p>
          </InfoCard>
          <button onClick={() => exportToPDF(`<h1>30-Day Content Calendar</h1><div class="meta">Niche: <strong>${niche}</strong> · Platform: <strong>${platform}</strong> · Goal: <strong>${goal}</strong></div>${result.weeks.map(w=>`<h2>Week ${w.week}: ${w.theme}</h2>${w.posts.map(p=>`<div class="box"><strong>Day ${p.day} · ${p.type}</strong><br/>${p.content_idea}<br/>Hook: ${p.hook}</div>`).join("")}`).join("")}<h2>Monthly Tip</h2><div class="box">${result.monthly_tip}</div>`, `30-Day Calendar - ${niche}`)}
            style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            📄 Export Calendar as PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────
function HistoryTab({ history, setHistory, setActiveTab }) {
  const TYPE_COLOR = { research: "#4f46e5", caption: "#10b981", competitor: "#f59e0b", calendar: "#7c3aed" };
  const TYPE_ICON  = { research: "⚡", caption: "✍️", competitor: "🔍", calendar: "📅" };

  if (!history.length) return (
    <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🕓</div>
      <h3 style={{ color: "#1a1a2e", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No history yet</h3>
      <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>Run any research or generation to see your results saved here.</p>
      <button onClick={() => setActiveTab("research")} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>⚡ Start Researching</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "#1a1a2e", fontSize: 20, fontWeight: 700, margin: 0 }}>Search History</h2>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "4px 0 0" }}>{history.length} saved results</p>
        </div>
        <button onClick={() => { _history = []; setHistory([]); }} style={{ background: "#fff", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear All</button>
      </div>
      {history.map(item => <HistoryCard key={item.id} item={item} color={TYPE_COLOR[item.type]} icon={TYPE_ICON[item.type]} />)}
    </div>
  );
}

function HistoryCard({ item, color, icon }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, marginBottom: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{icon}</div>
          <div>
            <div style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600 }}>{item.topic || item.niche}{item.competitor ? <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: 12 }}> · {item.competitor}</span> : ""}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{item.date} · {item.platform}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: `${color}15`, color, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{item.type}</span>
          <span style={{ color: "#d1d5db", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ paddingTop: 14, color: "#6b7280", fontSize: 13 }}>
            {item.type === "research" && item.result?.hashtags && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {[...item.result.hashtags.high_volume, ...item.result.hashtags.medium_volume, ...item.result.hashtags.niche].map(t => <span key={t} style={{ background: `${color}12`, border: `1px solid ${color}25`, color, padding: "3px 9px", borderRadius: 20, fontSize: 11 }}>{t}</span>)}
                </div>
                {item.result.caption_hook && <p style={{ color: "#b45309", fontSize: 12, fontStyle: "italic", margin: 0 }}>Hook: "{item.result.caption_hook}"</p>}
              </div>
            )}
            {item.type === "caption" && item.result?.captions?.map((c, i) => (
              <div key={i} style={{ background: "#f9f8ff", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ color, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{c.label}</div>
                <p style={{ color: "#374151", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{c.text.slice(0, 140)}...</p>
              </div>
            ))}
            {item.type === "competitor" && item.result?.your_opportunity && (
              <div>
                <p style={{ color: "#1a1a2e", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{item.result.your_opportunity}</p>
                {item.result.content_gaps?.map((g, i) => <div key={i} style={{ color: "#4f46e5", fontSize: 12, marginBottom: 4 }}>• {g}</div>)}
              </div>
            )}
            {item.type === "calendar" && item.result?.content_pillars && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {item.result.content_pillars.map(p => <span key={p} style={{ background: `${color}12`, border: `1px solid ${color}25`, color, padding: "3px 9px", borderRadius: 20, fontSize: 11 }}>{p}</span>)}
                </div>
                <p style={{ color: "#6b7280", fontSize: 12 }}>{item.result.monthly_tip}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>{title}</h2>
      <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>{subtitle}</p>
    </div>
  );
}
function Card({ children }) {
  return <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 22px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>{children}</div>;
}
function Field({ label, children }) {
  return <div style={{ marginBottom: 18 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>{children}</div>;
}
function StyledInput({ value, onChange, onKeyDown, placeholder }) {
  const [f, setF] = useState(false);
  return <input value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)}
    style={{ width: "100%", background: "#f9fafb", border: f ? "2px solid #4f46e5" : "1.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#1a1a2e", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }} />;
}
function Pills({ items, selected, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {items.map(({ label, value, color }) => (
        <button key={value} onClick={() => onSelect(value)} style={{ padding: "7px 13px", borderRadius: 20, fontFamily: "inherit", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s", border: selected === value ? `1.5px solid ${color}` : "1.5px solid #e5e7eb", background: selected === value ? `${color}12` : "#fff", color: selected === value ? color : "#6b7280" }}>{label}</button>
      ))}
    </div>
  );
}
function PrimaryBtn({ onClick, disabled, children }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", marginTop: 6, background: disabled ? "#f3f4f6" : "linear-gradient(135deg,#4f46e5,#7c3aed)", color: disabled ? "#9ca3af" : "#fff", fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: disabled ? "none" : "0 4px 20px rgba(79,70,229,0.3)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{children}</button>;
}
function InfoCard({ label, color, children, style }) {
  const BG = { "#4f46e5": "#ede9fe", "#f59e0b": "#fffbeb", "#10b981": "#ecfdf5", "#7c3aed": "#faf5ff", "#ef4444": "#fff1f2" };
  const BORDER = { "#4f46e5": "#c4b5fd", "#f59e0b": "#fde68a", "#10b981": "#6ee7b7", "#7c3aed": "#e9d5ff", "#ef4444": "#fecaca" };
  return <div style={{ background: BG[color] || "#f9f8ff", border: `1px solid ${BORDER[color] || "#e5e7eb"}`, borderRadius: 12, padding: "16px 18px", ...style }}><div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{label}</div>{children}</div>;
}
function ErrBox({ children }) {
  return <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#991b1b", fontSize: 13, marginBottom: 16 }}>{children}</div>;
}
function Spinner() {
  return <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}
