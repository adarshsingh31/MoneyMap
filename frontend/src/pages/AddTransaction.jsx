import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { addExpense } from "../services/expenseService";
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const MAX_COLORS = 8;

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = input => {
  const base = (input && input.length ? input : ['#A6C8FF', '#5227FF', '#FF9FFC']).slice(0, MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  o = vec4(colr, uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const Lightfall = ({
  className,
  dpr,
  paused = false,
  colors = ['#A6C8FF', '#5227FF', '#FF9FFC'],
  backgroundColor = '#0A29FF',
  speed = 0.5,
  streakCount = 2,
  streakWidth = 1,
  streakLength = 1,
  glow = 1,
  density = 0.6,
  twinkle = 1,
  zoom = 3,
  backgroundGlow = 0.5,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
  mixBlendMode
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(streakCount))) },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    if (mouseInteraction) {
      canvas.addEventListener('pointermove', onPointerMove);
    }

    const loop = t => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseInteraction) canvas.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === 'function') {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, 'remove');
      callIfFn(geometryRef.current, 'remove');
      callIfFn(meshRef.current, 'remove');
      callIfFn(rendererRef.current, 'destroy');
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative ${className ?? ''}`}
      style={{
        ...(mixBlendMode && { mixBlendMode })
      }}
    />
  );
};


const categoryStyles = {
  food: { icon: "restaurant", iconBg: "bg-orange-50 text-orange-500" },
  shopping: { icon: "shopping_bag", iconBg: "bg-slate-100 text-slate-600" },
  transport: { icon: "directions_car", iconBg: "bg-blue-50 text-blue-500" },
  utilities: { icon: "bolt", iconBg: "bg-yellow-50 text-yellow-600" },
  entertainment: { icon: "movie", iconBg: "bg-red-50 text-red-600" },
  salary: { icon: "payments", iconBg: "bg-emerald-50 text-primary" },
  freelance: { icon: "work", iconBg: "bg-blue-50 text-blue-600" }
};

const getCategoryStyle = (cat) => {
  const normalized = String(cat || "").toLowerCase();
  if (normalized.includes("food")) return categoryStyles.food;
  if (normalized.includes("shopping")) return categoryStyles.shopping;
  if (normalized.includes("travel") || normalized.includes("transport") || normalized.includes("fuel")) return categoryStyles.transport;
  if (normalized.includes("bills") || normalized.includes("utilities") || normalized.includes("rent")) return categoryStyles.utilities;
  if (normalized.includes("entertainment") || normalized.includes("movie")) return categoryStyles.entertainment;
  if (normalized.includes("salary") || normalized.includes("payment")) return categoryStyles.salary;
  if (normalized.includes("freelance") || normalized.includes("work")) return categoryStyles.freelance;
  return { icon: "category", iconBg: "bg-slate-100 text-slate-600" };
};

const expenseCategoriesList = [
  "🍔 Food",
  "🛒 Shopping",
  "🚗 Travel",
  "⛽ Fuel",
  "🏠 Rent",
  "💡 Bills",
  "🎬 Entertainment",
  "🏥 Healthcare",
  "📚 Education",
  "🛍 Personal Care",
  "🎁 Gifts",
  "📱 Subscriptions",
  "💼 Business",
  "📦 Other"
];

const incomeCategoriesList = [
  "💼 Salary",
  "💻 Freelance",
  "🏢 Business",
  "📈 Investment",
  "🏦 Interest",
  "🎁 Gift",
  "💸 Refund",
  "🪙 Bonus",
  "💰 Rental Income",
  "📱 Online Earnings",
  "🏆 Prize",
  "📦 Other"
];

const AddTransaction = () => {
  const navigate = useNavigate();
  const { logout, user, currencySymbol } = useAuth();

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("🍔 Food");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const card = document.querySelector(".glass-card");
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await addExpense({
        title,
        amount: Number(amount),
        date,
        type,
        category
      });

      setSuccessMessage("Transaction saved successfully!");
      setTitle("");
      setAmount("");
      setDescription("");
      
      setTimeout(() => {
        navigate("/transactions");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-background min-h-screen">
      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-border shadow-sm z-50 flex flex-col py-gutter">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img alt="MoneyMap Logo" className="w-10 h-10 object-contain" src={logo} />
          <span className="font-headline-md text-headline-md font-bold text-primary">MoneyMap</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-body-md">Transactions</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/add-transaction">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-medium">Add Transaction</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-body-md">Categories</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Reports</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/budget">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="font-body-md">Budget Planning</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/ai-analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md">AI Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto px-6 border-t border-border pt-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 py-3 text-text-muted hover:text-error transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Top Navigation */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-border w-80">
            <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
            <input className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-text-muted focus:outline-none" placeholder="Search transactions..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-text-muted hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="text-text-muted hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-on-surface font-bold text-sm leading-none">{user?.name || "Premium User"}</p>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mt-1">Tier 1 Analytics</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5">
              <img
                className="w-full h-full rounded-full object-cover"
                alt="Premium User Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCri9PyXic65bVGnjayUMgd-OrCKi034yE8M5MrREU_uBSWzC_1L1nIW6Wqvl9YcrW1mam49lN5yby52zX1SIfFzQYc445pIyO1d6ViYHMCrctSQ3YM3soVbxhnPs1egAJqgCWY3atJ8J3s_EWgVUukzFVw2791cJKRJfmaRLNjg-mHaVT6EyPsSEhkDi1aEIxuLSieWo3nSZpkyQoHM6l5_wJZLIIQKTKArrG5bPleLmY599dGhTy0c5V98l3ctpm2RcllrXtv8I"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 mt-16 p-gutter min-h-[calc(100vh-4rem)]">
        <div className="max-w-3xl mx-auto py-stack-lg">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-text-muted hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Back to Dashboard</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-xl overflow-hidden bg-white shadow-sm border border-border">
            <div className="relative p-8 border-b border-border bg-slate-50/50 overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-30">
                <Lightfall
                  speed={0.4}
                  streakCount={3}
                  streakWidth={1.5}
                  streakLength={1.2}
                  glow={1.2}
                  density={0.7}
                  zoom={2.5}
                  backgroundColor="#ffffff"
                  colors={['#10B981', '#3B82F6', '#6366F1']}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <img alt="MoneyMap" className="w-16 h-16 mb-4" src={logo} />
                <h2 className="text-headline-lg font-headline-lg text-text-primary">Add New Transaction</h2>
                <p className="text-text-muted mt-2">Log your daily expenses and income precisely.</p>
              </div>
            </div>

            {error && (
              <div className="mx-8 mt-6 p-4 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mx-8 mt-6 p-4 bg-emerald-50 border border-primary/30 rounded-lg text-primary text-body-md flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] shrink-0">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Title <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">description</span>
                  <input
                    required
                    className="w-full border-border rounded-lg pl-12 pr-4 py-3 form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Grocery Shopping"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Amount <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-data-lg text-data-lg">{currencySymbol}</span>
                    <input
                      required
                      min="0.01"
                      step="any"
                      className="w-full border-border rounded-lg pl-10 pr-4 py-3 font-data-lg text-data-lg form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="0.00"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Date <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">calendar_today</span>
                    <input
                      required
                      className="w-full border-border rounded-lg pl-12 pr-4 py-3 form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Dropdown */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Type <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 ${
                      type === "expense" ? "text-error" : "text-primary"
                    }`}>
                      {type === "expense" ? "trending_down" : "trending_up"}
                    </span>
                    <select
                      className="w-full border-border rounded-lg pl-12 pr-10 py-3 form-input-focus transition-all text-on-surface appearance-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setType(newType);
                        setCategory(newType === "expense" ? "🍔 Food" : "💼 Salary");
                      }}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Category <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary" id="category-icon">
                      {getCategoryStyle(category).icon}
                    </span>
                    <select
                      className="w-full border-border rounded-lg pl-12 pr-10 py-3 form-input-focus transition-all text-on-surface appearance-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      id="category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {(type === "expense" ? expenseCategoriesList : incomeCategoriesList).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Description (Optional)</label>
                <textarea
                  className="w-full border-border rounded-lg px-4 py-3 form-input-focus transition-all text-on-surface resize-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Add a note about this transaction..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-1/2 py-4 border border-border text-text-muted hover:bg-slate-50 hover:text-on-surface rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                  type="button"
                  disabled={loading}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="w-full sm:w-1/2 py-4 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                      <span>Save Transaction</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Message */}
          <p className="text-center text-label-sm text-text-muted mt-8">
            Your transaction will be encrypted and synced across all devices.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AddTransaction;
