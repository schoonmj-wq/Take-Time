import { useState, useEffect, useRef } from "react";
import { ref, set, onValue, off } from "firebase/database";
import { db } from "./firebase";
import { CHAPTERS, validateClock, dealCards, genCode } from "./gameData";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Quattrocento+Sans:ital,wght@0,400;0,700;1,400&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Quattrocento Sans', serif; background: #0e0c14; color: #e8dfc8; min-height: 100vh; }
:root {
  --gold: #c9a84c; --gold-light: #e8cc7a; --silver: #9eb8c8;
  --deep: #0e0c14; --mid: #1a1726; --surface: #221e30;
  --solar: #e8a020; --lunar: #5a80c0; --error: #d04040; --success: #50b060;
}
.cinzel { font-family: 'Cinzel', serif; }
h1,h2,h3,h4 { font-family: 'Cinzel', serif; }
.app { max-width: 480px; margin: 0 auto; padding: 16px; min-height: 100vh; }

.lobby { display:flex; flex-direction:column; align-items:center; gap:20px; padding-top:40px; }
.logo-ring { width:110px; height:110px; border-radius:50%; border:3px solid var(--gold); display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at 40% 35%,#2a2040,#0e0c14); box-shadow:0 0 30px rgba(201,168,76,0.3); }
.logo-inner { font-size:52px; }
.game-title { font-family:'Cinzel',serif; font-size:32px; color:var(--gold); letter-spacing:3px; text-align:center; }
.game-sub { color:var(--silver); font-style:italic; font-size:13px; text-align:center; }
.card-panel { background:var(--surface); border:1px solid rgba(201,168,76,0.3); border-radius:12px; padding:24px; width:100%; }
.card-panel h3 { color:var(--gold); margin-bottom:16px; font-size:14px; letter-spacing:2px; text-transform:uppercase; }
.input-group { display:flex; flex-direction:column; gap:8px; }
.inp { background:var(--mid); border:1px solid rgba(201,168,76,0.4); border-radius:8px; padding:12px 14px; color:#e8dfc8; font-family:inherit; font-size:15px; width:100%; outline:none; }
.inp:focus { border-color:var(--gold); }
.btn { padding:13px 20px; border-radius:8px; border:none; cursor:pointer; font-family:'Cinzel',serif; font-size:13px; letter-spacing:1px; transition:all 0.2s; width:100%; }
.btn-gold { background:linear-gradient(135deg,#a87830,#c9a84c); color:#0e0c14; font-weight:700; }
.btn-gold:hover { background:linear-gradient(135deg,#c9a84c,#e8cc7a); }
.btn-outline { background:transparent; border:1px solid var(--gold); color:var(--gold); }
.btn-outline:hover { background:rgba(201,168,76,0.1); }
.btn-sm { padding:8px 16px; font-size:12px; width:auto; }
.btn-danger { background:rgba(200,50,50,0.2); border:1px solid #d04040; color:#e07070; }
.divider { display:flex; align-items:center; gap:12px; color:var(--silver); font-size:12px; }
.divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(201,168,76,0.2); }
.error-msg { color:var(--error); font-size:13px; text-align:center; }
.hint { color:var(--silver); font-size:12px; text-align:center; font-style:italic; }

.waiting { display:flex; flex-direction:column; gap:16px; }
.code-badge { background:var(--mid); border:2px solid var(--gold); border-radius:12px; padding:20px; text-align:center; }
.code-big { font-family:'Cinzel',serif; font-size:42px; color:var(--gold-light); letter-spacing:8px; }
.player-list { display:flex; flex-direction:column; gap:8px; }
.player-row { display:flex; align-items:center; gap:10px; background:var(--mid); border-radius:8px; padding:10px 14px; }
.player-dot { width:8px; height:8px; border-radius:50%; background:var(--success); flex-shrink:0; }
.player-dot.me { background:var(--gold); }

.campaign { display:flex; flex-direction:column; gap:12px; }
.chapter-block { background:var(--surface); border:1px solid rgba(201,168,76,0.2); border-radius:10px; overflow:hidden; }
.chapter-header { padding:12px 16px; background:rgba(201,168,76,0.08); border-bottom:1px solid rgba(201,168,76,0.15); display:flex; justify-content:space-between; align-items:center; }
.chapter-name { font-family:'Cinzel',serif; font-size:13px; color:var(--gold); letter-spacing:1px; }
.clock-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:10px; }
.clock-card { background:var(--mid); border-radius:8px; padding:12px 10px; cursor:pointer; border:1px solid transparent; transition:all 0.2s; position:relative; }
.clock-card:hover:not(.done) { border-color:var(--gold); background:rgba(201,168,76,0.06); }
.clock-card.done { border-color:rgba(80,176,96,0.5); opacity:0.7; cursor:default; }
.clock-card.regret { border-color:rgba(200,100,50,0.5); }
.clock-num { font-family:'Cinzel',serif; font-size:10px; color:var(--silver); margin-bottom:2px; }
.clock-title { font-size:12px; color:#e8dfc8; font-weight:700; }
.clock-flavor { font-size:10px; color:var(--silver); font-style:italic; margin-top:2px; }
.clock-badge { position:absolute; top:6px; right:6px; font-size:14px; }

.test-screen { display:flex; flex-direction:column; gap:12px; }
.test-header { display:flex; align-items:center; gap:10px; }
.back-btn { background:none; border:1px solid rgba(201,168,76,0.3); border-radius:6px; color:var(--gold); padding:6px 10px; cursor:pointer; font-size:12px; font-family:'Cinzel',serif; }
.test-title-block { flex:1; }
.test-title { font-family:'Cinzel',serif; font-size:16px; color:var(--gold); }
.phase-badge { font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:4px 10px; border-radius:20px; font-family:'Cinzel',serif; }
.phase-discuss { background:rgba(90,128,192,0.2); color:var(--silver); border:1px solid var(--lunar); }
.phase-place { background:rgba(232,160,32,0.2); color:var(--solar); border:1px solid var(--solar); }
.phase-reveal { background:rgba(80,176,96,0.2); color:var(--success); border:1px solid var(--success); }

.clock-face-wrap { position:relative; width:100%; }

.rules-card { background:var(--surface); border:1px solid rgba(201,168,76,0.25); border-radius:10px; padding:14px; }
.rules-card h4 { font-size:11px; letter-spacing:2px; color:var(--gold); text-transform:uppercase; margin-bottom:10px; }
.rule-item { display:flex; gap:8px; align-items:flex-start; margin-bottom:6px; font-size:12px; color:var(--silver); }
.rule-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:5px; }

.hand-area { display:flex; flex-direction:column; gap:8px; }
.hand-title { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--silver); }
.cards-row { display:flex; flex-wrap:wrap; gap:8px; }
.card { width:52px; height:74px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; border:2px solid transparent; transition:all 0.15s; flex-shrink:0; }
.card.solar { background:linear-gradient(145deg,#3a2a10,#5a3e18); border-color:rgba(232,160,32,0.4); }
.card.lunar { background:linear-gradient(145deg,#101830,#1e2e50); border-color:rgba(90,128,192,0.4); }
.card.selected { transform:translateY(-6px); box-shadow:0 6px 20px rgba(201,168,76,0.5); border-color:var(--gold); }
.card.played { opacity:0.25; cursor:default; pointer-events:none; }
.card-val { font-family:'Cinzel',serif; font-size:22px; font-weight:700; }
.card.solar .card-val { color:var(--solar); }
.card.lunar .card-val { color:var(--lunar); }
.card-type-icon { font-size:14px; margin-top:2px; }

.seg-selector { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.seg-btn { background:var(--mid); border:1px solid rgba(201,168,76,0.3); border-radius:8px; padding:10px 6px; text-align:center; cursor:pointer; transition:all 0.15s; }
.seg-btn:hover { border-color:var(--gold); background:rgba(201,168,76,0.08); }
.seg-btn.has-cards { border-color:rgba(201,168,76,0.5); }
.seg-btn-label { font-family:'Cinzel',serif; font-size:12px; color:var(--gold); }
.seg-btn-count { font-size:10px; color:var(--silver); margin-top:2px; }

.faceup-toggle { display:flex; align-items:center; gap:8px; background:var(--mid); border-radius:8px; padding:8px 12px; }
.toggle-check { width:16px; height:16px; accent-color:var(--gold); cursor:pointer; }

.placement-log { background:var(--surface); border-radius:8px; padding:10px 12px; max-height:100px; overflow-y:auto; }
.log-entry { font-size:11px; color:var(--silver); padding:2px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
.log-entry .seg-tag { color:var(--gold); font-family:'Cinzel',serif; }

.reveal-grid { display:flex; flex-direction:column; gap:6px; }
.reveal-row { display:flex; justify-content:space-between; align-items:center; background:var(--mid); border-radius:8px; padding:8px 12px; border:1px solid transparent; }
.reveal-row.pass { border-color:rgba(80,176,96,0.4); }
.reveal-row.fail { border-color:rgba(200,50,50,0.4); }
.reveal-seg { font-family:'Cinzel',serif; font-size:13px; color:var(--gold); min-width:24px; }
.reveal-cards { display:flex; gap:4px; flex-wrap:wrap; flex:1; margin:0 8px; }
.mini-card { font-size:10px; padding:2px 5px; border-radius:4px; }
.mini-card.solar { background:rgba(232,160,32,0.2); color:var(--solar); }
.mini-card.lunar { background:rgba(90,128,192,0.2); color:var(--lunar); }
.reveal-val { font-size:15px; font-weight:700; min-width:24px; text-align:right; }
.reveal-errors { background:rgba(200,50,50,0.1); border:1px solid rgba(200,50,50,0.3); border-radius:8px; padding:10px 12px; }
.reveal-errors h4 { color:var(--error); font-size:12px; letter-spacing:1px; margin-bottom:6px; }
.err-item { font-size:12px; color:#e07070; margin-bottom:3px; }
.result-banner { border-radius:10px; padding:16px; text-align:center; }
.result-banner.pass { background:rgba(80,176,96,0.15); border:1px solid rgba(80,176,96,0.4); }
.result-banner.fail { background:rgba(200,50,50,0.1); border:1px solid rgba(200,50,50,0.3); }
.result-title { font-family:'Cinzel',serif; font-size:20px; }
.result-banner.pass .result-title { color:var(--success); }
.result-banner.fail .result-title { color:var(--error); }
.result-sub { font-size:13px; color:var(--silver); margin-top:6px; }
.action-row { display:flex; gap:8px; flex-wrap:wrap; }

.status-bar { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; }
.status-chip { background:var(--mid); border-radius:20px; padding:4px 10px; font-size:11px; display:flex; align-items:center; gap:5px; white-space:nowrap; border:1px solid rgba(201,168,76,0.2); flex-shrink:0; }
.status-chip.me-chip { border-color:rgba(201,168,76,0.5); }
.chip-name { color:var(--gold); }
.chip-cards { color:var(--silver); }

.bonus-row { display:flex; gap:8px; align-items:center; }
.bonus-token { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; }
.bonus-token.active { background:rgba(201,168,76,0.2); border:1px solid var(--gold); }
.bonus-token.inactive { background:var(--mid); border:1px solid rgba(201,168,76,0.2); opacity:0.4; }

.section-title { font-family:'Cinzel',serif; font-size:13px; letter-spacing:2px; color:var(--gold); text-transform:uppercase; }
.progress-bar-wrap { height:4px; background:var(--mid); border-radius:2px; overflow:hidden; margin-top:4px; }
.progress-bar { height:100%; background:linear-gradient(90deg,#a87830,#e8cc7a); border-radius:2px; transition:width 0.4s; }
.gap-12 { display:flex; flex-direction:column; gap:12px; }
.gap-8 { display:flex; flex-direction:column; gap:8px; }
.text-center { text-align:center; }
.text-silver { color:var(--silver); }
.text-gold { color:var(--gold); }
.text-sm { font-size:12px; }
.spinner { width:32px; height:32px; border:3px solid rgba(201,168,76,0.2); border-top-color:var(--gold); border-radius:50%; animation:spin 0.8s linear infinite; margin:20px auto; }
@keyframes spin { to{transform:rotate(360deg)} }
.pulse { animation:pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
.info-box { background:rgba(90,128,192,0.1); border:1px solid rgba(90,128,192,0.3); border-radius:8px; padding:10px 12px; font-size:12px; color:var(--silver); }
.warn-box { background:rgba(232,160,32,0.1); border:1px solid rgba(232,160,32,0.3); border-radius:8px; padding:10px 12px; font-size:12px; color:#e8c060; }
.chip-row { display:flex; gap:6px; flex-wrap:wrap; }
.chip { padding:4px 10px; border-radius:20px; font-size:11px; background:var(--mid); border:1px solid rgba(201,168,76,0.3); color:var(--silver); }
`;

// ─── CLOCK SVG ────────────────────────────────────────────────────────────────
function ClockFaceSVG({ clock, placements, phase, onSegmentClick }) {
  const cx = 100, cy = 100, r = 80, innerR = 35;
  const startDeg = (clock.startSegment || 0) * 60 - 90;
  const segPaths = [], segLabels = [], segValues = [];

  for (let i = 0; i < 6; i++) {
    const a1 = (startDeg + i * 60) * Math.PI / 180;
    const a2 = (startDeg + (i + 1) * 60) * Math.PI / 180;
    const d = `M ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} L ${cx + innerR * Math.cos(a2)} ${cy + innerR * Math.sin(a2)} A ${innerR} ${innerR} 0 0 0 ${cx + innerR * Math.cos(a1)} ${cy + innerR * Math.sin(a1)} Z`;
    const mid = startDeg + i * 60 + 30;
    const mr = (r + innerR) / 2;
    const lx = cx + mr * Math.cos(mid * Math.PI / 180);
    const ly = cy + mr * Math.sin(mid * Math.PI / 180);
    const placed = (placements || [])[i] || [];
    const val = placed.reduce((a, c) => a + c.value, 0);
    const isStart = i === (clock.startSegment || 0);

    let fill = isStart ? "rgba(201,168,76,0.08)" : "rgba(34,30,48,0.9)";
    if (placed.length > 0) fill = "rgba(30,46,80,0.7)";

    segPaths.push(
      <path key={i} d={d} fill={fill} stroke="rgba(201,168,76,0.4)" strokeWidth="1"
        onClick={() => onSegmentClick && onSegmentClick(i)}
        style={{ cursor: onSegmentClick ? "pointer" : "default", transition: "fill 0.2s" }} />
    );
    segLabels.push(
      <text key={`l${i}`} x={lx} y={ly - (placed.length > 0 ? 6 : 0)} textAnchor="middle" dominantBaseline="middle"
        fill={isStart ? "#c9a84c" : "#9eb8c8"} fontSize="8" fontFamily="Cinzel,serif">
        {clock.segments[i].label}
      </text>
    );
    if (placed.length > 0) {
      segValues.push(
        <text key={`v${i}`} x={lx} y={ly + 7} textAnchor="middle" dominantBaseline="middle"
          fill="#e8dfc8" fontSize="10" fontFamily="Cinzel,serif" fontWeight="bold">
          {phase === "reveal" ? val : `×${placed.length}`}
        </text>
      );
    }
  }

  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30) - 90) * Math.PI / 180;
    ticks.push(<line key={i} x1={cx + 82 * Math.cos(a)} y1={cy + 82 * Math.sin(a)} x2={cx + 86 * Math.cos(a)} y2={cy + 86 * Math.sin(a)} stroke="rgba(201,168,76,0.3)" strokeWidth="1" />);
  }

  return (
    <svg viewBox="0 0 200 200" width="100%" style={{ display: "block" }}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1726" /><stop offset="100%" stopColor="#0e0c14" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="96" fill="url(#bg)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
      {ticks}{segPaths}{segLabels}{segValues}
      <circle cx={cx} cy={cy} r={innerR} fill="#0e0c14" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#c9a84c" fontSize="7" fontFamily="Cinzel,serif">{clock.id}</text>
      <text x={cx} y={cy + 7} textAnchor="middle" fill="#9eb8c8" fontSize="6" fontFamily="Cinzel,serif">{clock.title}</text>
    </svg>
  );
}

// ─── FIREBASE HELPERS ─────────────────────────────────────────────────────────
async function saveRoom(room) {
  await set(ref(db, `rooms/${room.code}`), { ...room, updatedAt: Date.now() });
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [room, setRoom] = useState(null);
  const [myIdx, setMyIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeClock, setActiveClock] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [wantFaceup, setWantFaceup] = useState(false);
  const unsubRef = useRef(null);

  // Subscribe to room updates from Firebase
  function subscribeRoom(code) {
    if (unsubRef.current) off(unsubRef.current);
    const roomRef = ref(db, `rooms/${code}`);
    unsubRef.current = roomRef;
    onValue(roomRef, (snap) => {
      if (snap.exists()) setRoom(snap.val());
    });
  }

  useEffect(() => {
    return () => { if (unsubRef.current) off(unsubRef.current); };
  }, []);

  // Keep activeClock in sync when room.test changes
  useEffect(() => {
    if (!room || !activeClock) return;
    if (room.phase === "campaign" && screen === "test") {
      // test resolved by host
    }
  }, [room?.phase]);

  const isHost = room && myIdx === room.host;
  const me = room?.players?.[myIdx];
  const currentTest = room?.test;
  const myHand = currentTest?.hands?.[myIdx];
  const allMyCards = myHand ? [...myHand.main, ...(myHand.bonus || [])] : [];
  const playedIds = myHand?.played || [];
  const testPlacements = currentTest?.placements || [[], [], [], [], [], []];
  const clock = activeClock?.clock;

  // ── CREATE ROOM ──
  async function createRoom() {
    if (!name.trim()) return setError("Enter your name");
    setLoading(true); setError("");
    const code = genCode();
    const newRoom = {
      code, createdAt: Date.now(), phase: "waiting",
      players: [{ name: name.trim(), idx: 0 }],
      host: 0,
      campaign: { completed: [], regrets: [], bonusTokens: 0 },
      test: null
    };
    await saveRoom(newRoom);
    setMyIdx(0);
    subscribeRoom(code);
    setScreen("waiting");
    setLoading(false);
  }

  // ── JOIN ROOM ──
  async function joinRoom() {
    if (!name.trim()) return setError("Enter your name");
    if (!joinCode.trim()) return setError("Enter a room code");
    setLoading(true); setError("");
    const code = joinCode.trim().toUpperCase();
    const roomRef = ref(db, `rooms/${code}`);

    // Read once
    const { get } = await import("firebase/database");
    const snap = await get(roomRef);
    if (!snap.exists()) { setLoading(false); return setError("Room not found"); }
    const r = snap.val();
    if (r.players.length >= 4) { setLoading(false); return setError("Room is full (max 4)"); }

    const idx = r.players.length;
    const updated = { ...r, players: [...r.players, { name: name.trim(), idx }] };
    await saveRoom(updated);
    setMyIdx(idx);
    subscribeRoom(code);
    setScreen("waiting");
    setLoading(false);
  }

  // ── START CAMPAIGN ──
  async function startCampaign() {
    if (!room) return;
    await saveRoom({ ...room, phase: "campaign" });
    setScreen("campaign");
  }

  // ── OPEN CLOCK ──
  function openClock(ch, cl) {
    const chapter = CHAPTERS.find(c => c.id === ch);
    const clockDef = chapter.clocks.find(c => c.id === cl);
    setActiveClock({ chapter, clock: clockDef });
    setScreen("test");
  }

  // ── START TEST ──
  async function startTest() {
    if (!room || !clock) return;
    const hands = dealCards(room.players.length);
    const test = {
      clockId: clock.id,
      phase: "discussion",
      hands: hands.map(h => ({ main: h.main, bonus: h.bonus || [], played: [] })),
      placements: [[], [], [], [], [], []],
      placementLog: [],
      faceupUsed: 0,
      faceupAllowed: room.campaign.bonusTokens || 0,
    };
    await saveRoom({ ...room, phase: "test", test });
  }

  // ── END DISCUSSION ──
  async function endDiscussion() {
    if (!room?.test) return;
    await saveRoom({ ...room, test: { ...room.test, phase: "placement" } });
  }

  // ── PLACE CARD ──
  async function placeCard(segIdx) {
    if (!selectedCard || !room?.test) return;
    const hand = room.test.hands[myIdx];
    const cardInMain = hand.main.find(c => c.id === selectedCard.id);
    const cardInBonus = hand.bonus?.find(c => c.id === selectedCard.id);
    const card = cardInMain || cardInBonus;
    if (!card || hand.played.includes(card.id)) return;

    const newPlayed = [...hand.played, card.id];
    let newMain = cardInMain ? hand.main.filter(c => c.id !== card.id) : hand.main;
    let newBonus = cardInBonus ? (hand.bonus || []).filter(c => c.id !== card.id) : (hand.bonus || []);

    // 2-player: reveal bonus after 2 placed
    if (room.players.length === 2 && newPlayed.length === 2 && newBonus.length > 0 && cardInMain) {
      newMain = [...newMain, ...newBonus];
      newBonus = [];
    }

    const newHands = room.test.hands.map((h, i) =>
      i === myIdx ? { ...h, main: newMain, bonus: newBonus, played: newPlayed } : h
    );
    const newPlacements = room.test.placements.map((s, i) =>
      i === segIdx ? [...s, { ...card, faceup: wantFaceup }] : s
    );
    const faceupUsed = room.test.faceupUsed + (wantFaceup ? 1 : 0);
    const newLog = [...(room.test.placementLog || []), {
      player: room.players[myIdx].name,
      cardVal: card.value, cardType: card.type,
      segLabel: clock.segments[segIdx].label,
      faceup: wantFaceup
    }];

    const allDone = newHands.every(h => h.main.length === 0 && (h.bonus || []).length === 0);

    await saveRoom({
      ...room,
      test: {
        ...room.test,
        hands: newHands, placements: newPlacements,
        placementLog: newLog, faceupUsed,
        phase: allDone ? "reveal" : "placement"
      }
    });
    setSelectedCard(null); setWantFaceup(false);
  }

  // ── RESOLVE TEST ──
  async function resolveTest(passed) {
    if (!room || !clock) return;
    let campaign = { ...room.campaign };
    if (passed) {
      campaign.completed = [...(campaign.completed || []), clock.id];
      campaign.bonusTokens = 0;
    } else {
      campaign.bonusTokens = Math.min((campaign.bonusTokens || 0) + 1, 3);
    }
    await saveRoom({ ...room, phase: "campaign", campaign, test: null });
    setScreen("campaign"); setActiveClock(null);
  }

  async function skipClock() {
    if (!room || !clock) return;
    const campaign = {
      ...room.campaign,
      regrets: [...(room.campaign.regrets || []), clock.id],
      bonusTokens: 0
    };
    await saveRoom({ ...room, phase: "campaign", campaign, test: null });
    setScreen("campaign"); setActiveClock(null);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════

  // ── LOBBY ──
  if (screen === "lobby") return (
    <div className="app">
      <style>{FONTS}{css}</style>
      <div className="lobby">
        <div className="logo-ring"><div className="logo-inner">🕰️</div></div>
        <div>
          <div className="game-title">TAKE TIME</div>
          <div className="game-sub">A cooperative card game</div>
        </div>
        <div className="card-panel gap-8">
          <div className="input-group">
            <label className="text-sm text-silver">Your name</label>
            <input className="inp" placeholder="Enter your name…" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && createRoom()} />
          </div>
          <button className="btn btn-gold" onClick={createRoom} disabled={loading}>
            {loading ? "Creating…" : "Create Room"}
          </button>
          <div className="divider">or join existing room</div>
          <div className="input-group">
            <input className="inp" placeholder="Room code (e.g. XTQB)" value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6}
              onKeyDown={e => e.key === "Enter" && joinRoom()} />
            <button className="btn btn-outline" onClick={joinRoom} disabled={loading}>
              {loading ? "Joining…" : "Join Room"}
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </div>
        <div className="info-box">2–4 players · Cooperative · No talking during placement!</div>
      </div>
    </div>
  );

  // ── WAITING ──
  if (screen === "waiting" && room) return (
    <div className="app">
      <style>{FONTS}{css}</style>
      <div className="waiting" style={{ paddingTop: 20 }}>
        <div>
          <h2 className="text-gold cinzel" style={{ marginBottom: 4 }}>Waiting Room</h2>
          <p className="text-sm text-silver">Share this code with your friends</p>
        </div>
        <div className="code-badge">
          <div className="code-big">{room.code}</div>
          <div className="text-sm text-silver" style={{ marginTop: 6 }}>Room Code · tap to copy</div>
        </div>
        <div className="rules-card gap-8">
          <h4>Players ({room.players.length}/4)</h4>
          <div className="player-list">
            {room.players.map((p, i) => (
              <div key={i} className="player-row">
                <div className={`player-dot ${i === myIdx ? "me" : ""}`} />
                <span style={{ flex: 1 }}>{p.name}</span>
                {i === room.host && <span className="text-sm text-gold">Host</span>}
                {i === myIdx && <span className="text-sm text-silver">(you)</span>}
              </div>
            ))}
          </div>
        </div>
        {isHost && room.players.length >= 2 &&
          <button className="btn btn-gold" onClick={startCampaign}>Begin Campaign →</button>}
        {isHost && room.players.length < 2 &&
          <div className="hint">Waiting for at least 1 more player…</div>}
        {!isHost &&
          <div className="hint pulse">Waiting for host to start…</div>}
        <div className="info-box">
          <b>Quick Rules:</b> Players place cards face-down around the clock. No talking during placement! Values must increase clockwise. Each segment ≥ 1 card. Max value per segment: 24.
        </div>
      </div>
    </div>
  );

  // ── CAMPAIGN ──
  if (screen === "campaign" && room) {
    const completed = room.campaign?.completed || [];
    const regrets = room.campaign?.regrets || [];
    return (
      <div className="app">
        <style>{FONTS}{css}</style>
        <div className="campaign">
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 className="cinzel text-gold">Journey</h2>
                <div className="text-sm text-silver">{completed.length}/40 complete · Room: {room.code}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="text-sm text-silver">Bonus Tokens</div>
                <div className="bonus-row" style={{ justifyContent: "flex-end" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`bonus-token ${i < (room.campaign.bonusTokens || 0) ? "active" : "inactive"}`}>⊕</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="progress-bar-wrap" style={{ marginTop: 8 }}>
              <div className="progress-bar" style={{ width: `${(completed.length / 40) * 100}%` }} />
            </div>
          </div>
          {CHAPTERS.map(ch => {
            const chDone = ch.clocks.filter(cl => completed.includes(cl.id)).length;
            return (
              <div key={ch.id} className="chapter-block">
                <div className="chapter-header">
                  <span className="chapter-name">Ch.{ch.id} · {ch.name}</span>
                  <span style={{ fontSize: 11, color: "var(--silver)" }}>{chDone}/4</span>
                </div>
                <div className="clock-grid">
                  {ch.clocks.map(cl => {
                    const isDone = completed.includes(cl.id);
                    const isRegret = regrets.includes(cl.id);
                    return (
                      <div key={cl.id}
                        className={`clock-card ${isDone ? "done" : ""} ${isRegret ? "regret" : ""}`}
                        onClick={() => !isDone && openClock(ch.id, cl.id)}>
                        <div className="clock-num">{cl.id}</div>
                        <div className="clock-title">{cl.title}</div>
                        <div className="clock-flavor">{cl.flavor}</div>
                        <div className="clock-badge">{isDone ? "✅" : isRegret ? "😔" : "🕰️"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {completed.length === 40 && (
            <div className="result-banner pass">
              <div className="result-title">🎉 Journey Complete!</div>
              <div className="result-sub">You've mastered all 40 tests!</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── TEST ──
  if (screen === "test" && activeClock && clock) {
    const testPhase = currentTest?.phase || "pre";
    const revealErrors = testPhase === "reveal" ? validateClock(clock, testPlacements) : [];
    const testPassed = testPhase === "reveal" && revealErrors.length === 0;
    const revealVals = testPlacements.map(seg => seg.reduce((a, c) => a + c.value, 0));

    return (
      <div className="app">
        <style>{FONTS}{css}</style>
        <div className="test-screen">

          <div className="test-header">
            <button className="back-btn" onClick={() => { setScreen("campaign"); setActiveClock(null); setSelectedCard(null); }}>← Back</button>
            <div className="test-title-block">
              <div className="test-title">{clock.title}</div>
              <div style={{ fontSize: 11, color: "var(--silver)" }}>{activeClock.chapter.name} · {clock.id}</div>
            </div>
            <div className={`phase-badge ${testPhase === "placement" ? "phase-place" : testPhase === "reveal" ? "phase-reveal" : "phase-discuss"}`}>
              {testPhase === "pre" ? "Setup" : testPhase === "discussion" ? "Discuss" : testPhase === "placement" ? "Place" : "Reveal"}
            </div>
          </div>

          {currentTest && (
            <div className="status-bar">
              {room.players.map((p, i) => {
                const h = currentTest.hands[i];
                const rem = h ? h.main.length + (h.bonus || []).length : "?";
                return (
                  <div key={i} className={`status-chip ${i === myIdx ? "me-chip" : ""}`}>
                    <span className="chip-name">{p.name}</span>
                    {testPhase === "placement" && <span className="chip-cards">{rem} left</span>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="clock-face-wrap">
            <ClockFaceSVG
              clock={clock}
              placements={testPlacements}
              phase={testPhase}
              onSegmentClick={testPhase === "placement" && selectedCard ? placeCard : null}
            />
          </div>

          <div className="rules-card">
            <h4>Clock Rules</h4>
            <div className="rule-item"><div className="rule-dot" /><span>Each segment: ≥1 card · values increase clockwise{!clock.no24cap ? " · max 24" : ""}</span></div>
            {clock.clockRule && <div className="rule-item"><div className="rule-dot" style={{ background: "var(--solar)" }} /><span>{clock.clockRule.text}</span></div>}
            {clock.segments.map((seg, i) => seg.rules.map((r, j) => (
              <div key={`${i}-${j}`} className="rule-item">
                <div className="rule-dot" style={{ background: "var(--lunar)" }} />
                <span><b>{seg.label}:</b> {r.text}</span>
              </div>
            )))}
            {(clock.startSegment || 0) > 0 && (
              <div className="rule-item"><div className="rule-dot" style={{ background: "var(--gold)" }} /><span>Starting segment: {clock.segments[clock.startSegment].label}</span></div>
            )}
          </div>

          {/* PRE */}
          {testPhase === "pre" && (
            <div className="gap-8">
              <div className="info-box">Study the rules above and discuss strategy. When ready, the host deals cards.</div>
              {isHost && <button className="btn btn-gold" onClick={startTest}>Deal Cards & Begin →</button>}
              {!isHost && <div className="hint pulse">Waiting for host to deal cards…</div>}
            </div>
          )}

          {/* DISCUSSION */}
          {testPhase === "discussion" && (
            <div className="gap-8">
              <div className="warn-box">🗣️ Discussion Phase — talk freely! You can see your card backs only.</div>
              {myHand && (
                <div className="rules-card">
                  <h4>Your card backs</h4>
                  <div className="chip-row">
                    {[...myHand.main, ...(myHand.bonus || [])].map((c, i) => (
                      <div key={i} className="chip">{c.type === "solar" ? "☀️ Solar" : "🌙 Lunar"}</div>
                    ))}
                  </div>
                </div>
              )}
              {(room.campaign.bonusTokens || 0) > 0 && (
                <div className="info-box">⊕ You have {room.campaign.bonusTokens} bonus token{room.campaign.bonusTokens > 1 ? "s" : ""} — you may play that many cards face-up during placement.</div>
              )}
              <button className="btn btn-gold" onClick={endDiscussion}>Ready — Start Placement 🤫</button>
              <div className="hint">Tap when everyone agrees. No more talking after this!</div>
            </div>
          )}

          {/* PLACEMENT */}
          {testPhase === "placement" && myHand && (
            <div className="gap-8">
              <div className="info-box" style={{ fontSize: 11 }}>🤫 Silence! Tap a card → tap a clock segment to place it.</div>
              <div className="hand-area">
                <div className="hand-title">Your Hand</div>
                <div className="cards-row">
                  {allMyCards.map(card => {
                    const isPlayed = playedIds.includes(card.id);
                    const isSel = selectedCard?.id === card.id;
                    return (
                      <div key={card.id}
                        className={`card ${card.type} ${isSel ? "selected" : ""} ${isPlayed ? "played" : ""}`}
                        onClick={() => !isPlayed && setSelectedCard(isSel ? null : card)}>
                        <span className="card-val">{card.value}</span>
                        <span className="card-type-icon">{card.type === "solar" ? "☀️" : "🌙"}</span>
                      </div>
                    );
                  })}
                  {myHand.bonus?.length > 0 && playedIds.length < 2 && (
                    <span style={{ fontSize: 10, color: "var(--silver)", alignSelf: "center", marginLeft: 4 }}>
                      +{myHand.bonus.length} after 2 placed
                    </span>
                  )}
                </div>
              </div>

              {currentTest.faceupAllowed > currentTest.faceupUsed && selectedCard && (
                <div className="faceup-toggle">
                  <input type="checkbox" className="toggle-check" checked={wantFaceup} onChange={e => setWantFaceup(e.target.checked)} />
                  <span className="text-sm">Play face-up ({currentTest.faceupAllowed - currentTest.faceupUsed} remaining)</span>
                </div>
              )}

              {selectedCard && (
                <div className="gap-8">
                  <div className="section-title">Place on segment:</div>
                  <div className="seg-selector">
                    {clock.segments.map((seg, i) => (
                      <div key={i} className={`seg-btn ${testPlacements[i].length > 0 ? "has-cards" : ""}`}
                        onClick={() => placeCard(i)}>
                        <div className="seg-btn-label">{seg.label}</div>
                        <div className="seg-btn-count">{testPlacements[i].length > 0 ? `${testPlacements[i].length} card${testPlacements[i].length > 1 ? "s" : ""}` : "empty"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTest.placementLog?.length > 0 && (
                <div className="placement-log">
                  {[...currentTest.placementLog].reverse().map((e, i) => (
                    <div key={i} className="log-entry">
                      {e.player} → {e.cardType === "solar" ? "☀️" : "🌙"}{e.cardVal}{e.faceup ? "👁️" : ""} → <span className="seg-tag">{e.segLabel}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVEAL */}
          {testPhase === "reveal" && (
            <div className="gap-8">
              <div className={`result-banner ${testPassed ? "pass" : "fail"}`}>
                <div className="result-title">{testPassed ? "✨ Test Passed!" : "💀 Test Failed"}</div>
                <div className="result-sub">{testPassed ? `${clock.title} complete!` : "Discuss and try again."}</div>
              </div>
              <div className="reveal-grid">
                {clock.segments.map((seg, i) => {
                  const cards = testPlacements[i];
                  const val = revealVals[i];
                  const ok = cards.length > 0 && val <= 24 && seg.rules.every(r => r.check(cards));
                  return (
                    <div key={i} className={`reveal-row ${ok ? "pass" : "fail"}`}>
                      <span className="reveal-seg">{seg.label}</span>
                      <div className="reveal-cards">
                        {cards.map((c, j) => (
                          <span key={j} className={`mini-card ${c.type}`}>{c.value}{c.faceup ? "👁️" : ""}</span>
                        ))}
                      </div>
                      <span className="reveal-val" style={{ color: ok ? "var(--success)" : "var(--error)" }}>{val || 0}</span>
                    </div>
                  );
                })}
              </div>
              {revealErrors.length > 0 && (
                <div className="reveal-errors">
                  <h4>❌ Issues</h4>
                  {revealErrors.map((e, i) => <div key={i} className="err-item">• {e}</div>)}
                </div>
              )}
              {isHost && (
                <div className="action-row">
                  {testPassed
                    ? <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => resolveTest(true)}>Continue →</button>
                    : <>
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => resolveTest(false)}>Try Again</button>
                      <button className="btn btn-danger btn-sm" onClick={skipClock}>Skip 😔</button>
                    </>
                  }
                </div>
              )}
              {!isHost && <div className="hint pulse">Waiting for host…</div>}
            </div>
          )}

        </div>
      </div>
    );
  }

  return <div className="app"><style>{FONTS}{css}</style><div className="spinner" /></div>;
}
