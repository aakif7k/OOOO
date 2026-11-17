type SceneId = 'dawn' | 'day' | 'golden' | 'dusk' | 'starry';

interface Props {
  sceneId: SceneId;
}

export function ParallaxWindow({ sceneId }: Props) {
  return (
    <div
      className="relative mx-4 rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        height: '28vw',
        maxHeight: '140px',
        minHeight: '90px',
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      {/* Scene SVG */}
      <div className="absolute inset-0">
        {sceneId === 'dawn' && <DawnScene />}
        {sceneId === 'day' && <DayScene />}
        {sceneId === 'golden' && <GoldenScene />}
        {sceneId === 'dusk' && <DuskScene />}
        {sceneId === 'starry' && <StarryScene />}
      </div>

      {/* Glass glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
        }}
      />

      {/* Window frame corners */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white border-opacity-50 rounded-tl" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white border-opacity-50 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white border-opacity-50 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white border-opacity-50 rounded-br" />
    </div>
  );
}

/* ---- Dawn: Gopuram Silhouette at Sunrise ---- */
function DawnScene() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE8C0" />
          <stop offset="60%" stopColor="#FFC8DD" />
          <stop offset="100%" stopColor="#FFD27D" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="80%">
          <stop offset="0%" stopColor="#FFD27D" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFAFCC" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="400" height="140" fill="url(#dawnSky)" />
      <circle cx="200" cy="130" r="50" fill="url(#sunGlow)" />
      <circle cx="200" cy="140" r="22" fill="#FFD27D" opacity="0.9" />

      {/* Far hills */}
      <path d="M0 110 Q80 70 160 100 Q200 85 240 100 Q300 70 400 95 L400 140 L0 140Z" fill="#FFAFCC" opacity="0.4" />

      {/* Gopuram silhouette */}
      <g fill="#2B2A4C" opacity="0.7">
        {/* Base */}
        <rect x="150" y="60" width="100" height="80" />
        {/* Tiered pyramid - layer 1 */}
        <polygon points="140,60 260,60 250,45 150,45" />
        {/* Tiered pyramid - layer 2 */}
        <polygon points="150,45 250,45 242,32 158,32" />
        {/* Tiered pyramid - layer 3 */}
        <polygon points="158,32 242,32 236,22 164,22" />
        {/* Tiered pyramid - layer 4 */}
        <polygon points="164,22 236,22 230,14 170,14" />
        {/* Finial / Kalasha */}
        <ellipse cx="200" cy="10" rx="10" ry="6" />
        <rect x="197" y="4" width="6" height="8" />

        {/* Decorative niches */}
        {[160, 185, 210, 235].map(x => (
          <rect key={x} x={x} y="70" width="12" height="18" rx="6" fill="#2B2A4C" opacity="0.5" />
        ))}
      </g>

      {/* Palm tree silhouettes */}
      <g fill="#2B2A4C" opacity="0.5">
        <rect x="45" y="80" width="4" height="60" />
        <ellipse cx="47" cy="78" rx="18" ry="12" />
        <rect x="340" y="85" width="4" height="55" />
        <ellipse cx="342" cy="83" rx="16" ry="10" />
      </g>

      {/* Birds */}
      {[80, 120, 300, 340, 360].map((bx, i) => (
        <path
          key={i}
          d={`M${bx} ${35 + (i % 3) * 8} Q${bx + 7} ${28 + (i % 3) * 8} ${bx + 14} ${35 + (i % 3) * 8}`}
          fill="none"
          stroke="#2B2A4C"
          strokeWidth="1.5"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            values={`M${bx} ${35 + (i % 3) * 8} Q${bx + 7} ${28 + (i % 3) * 8} ${bx + 14} ${35 + (i % 3) * 8};M${bx} ${35 + (i % 3) * 8} Q${bx + 7} ${34 + (i % 3) * 8} ${bx + 14} ${35 + (i % 3) * 8};M${bx} ${35 + (i % 3) * 8} Q${bx + 7} ${28 + (i % 3) * 8} ${bx + 14} ${35 + (i % 3) * 8}`}
            dur={`${1.2 + i * 0.2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* Clouds */}
      {[30, 280].map((cx, i) => (
        <g key={i} opacity="0.6">
          <ellipse cx={cx + 20} cy={20 + i * 15} rx="28" ry="10" fill="white" />
          <ellipse cx={cx} cy={23 + i * 15} rx="18" ry="8" fill="white" />
          <ellipse cx={cx + 36} cy={24 + i * 15} rx="14" ry="7" fill="white" />
        </g>
      ))}
    </svg>
  );
}

/* ---- Day: Coconut Palms, Viaduct, Auto ---- */
function DayScene() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BDE0FE" />
          <stop offset="100%" stopColor="#E9DDF7" />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill="url(#daySky)" />
      {/* Sun */}
      <circle cx="340" cy="25" r="20" fill="#FFD27D" opacity="0.9" />
      <circle cx="340" cy="25" r="28" fill="#FFD27D" opacity="0.2" />

      {/* Clouds */}
      {[40, 180].map((cx, i) => (
        <g key={i} fill="white" opacity="0.85">
          <ellipse cx={cx + 20} cy={25 + i * 10} rx="30" ry="10" />
          <ellipse cx={cx} cy={28 + i * 10} rx="20" ry="9" />
          <ellipse cx={cx + 38} cy={29 + i * 10} rx="16" ry="8" />
        </g>
      ))}

      {/* Elevated metro viaduct */}
      <g opacity="0.65" fill="#2B2A4C">
        {/* Viaduct beams */}
        {[20, 90, 160, 230, 300, 370].map(px => (
          <g key={px}>
            <rect x={px} y="65" width="8" height="75" />
            <rect x={px - 10} y="62" width="28" height="6" rx="2" />
          </g>
        ))}
        {/* Rail track on top */}
        <rect x="0" y="58" width="400" height="6" rx="2" />
      </g>

      {/* Palm trees */}
      {[50, 320].map((px, i) => (
        <g key={i} fill="#2B2A4C" opacity="0.55">
          <rect x={px + 2} y="80" width="6" height="60" rx="3" />
          {/* Fronds */}
          {[-30, -15, 0, 15, 30].map((angle, fi) => (
            <path
              key={fi}
              d={`M${px + 5} 80 Q${px + 5 + Math.cos(angle * 0.07) * 25} ${75 + Math.sin(fi * 0.6) * 10} ${px + 5 + Math.cos(angle * 0.07) * 35} ${80 + Math.sin(fi * 0.8) * 15}`}
              stroke="#2B2A4C"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
            />
          ))}
        </g>
      ))}

      {/* Auto-rickshaw silhouette */}
      <g transform="translate(165,88)" fill="#2B2A4C" opacity="0.6">
        {/* Body */}
        <rect x="0" y="0" width="60" height="35" rx="8" />
        {/* Windscreen */}
        <rect x="8" y="4" width="22" height="20" rx="3" fill="#BDE0FE" opacity="0.4" />
        {/* Roof flap */}
        <path d="M0 0 Q30 -8 60 0" fill="#2B2A4C" />
        {/* Wheels */}
        <circle cx="12" cy="38" r="8" />
        <circle cx="48" cy="38" r="8" />
        <circle cx="12" cy="38" r="4" fill="#FFD27D" opacity="0.5" />
        <circle cx="48" cy="38" r="4" fill="#FFD27D" opacity="0.5" />
        {/* Handle */}
        <rect x="-8" y="8" width="10" height="4" rx="2" />
      </g>

      {/* Road/ground */}
      <rect x="0" y="122" width="400" height="18" fill="#E9DDF7" opacity="0.5" />
      <rect x="0" y="120" width="400" height="3" fill="#CDB4DB" opacity="0.4" />

      {/* Floating doodle hearts */}
      {[80, 200, 290].map((hx, i) => (
        <text key={i} x={hx} y={50 + i * 12} fontSize="12" opacity="0.5">
          ❤️
          <animate attributeName="y" values={`${50 + i * 12};${40 + i * 12};${50 + i * 12}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </text>
      ))}
    </svg>
  );
}

/* ---- Golden: Marina Beach & Lighthouse ---- */
function GoldenScene() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="goldenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD27D" />
          <stop offset="50%" stopColor="#FFAFCC" />
          <stop offset="100%" stopColor="#FFC8DD" />
        </linearGradient>
        <radialGradient id="sunsetGlow" cx="30%" cy="90%">
          <stop offset="0%" stopColor="#FFD27D" stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="140" fill="url(#goldenSky)" />
      <circle cx="80" cy="140" r="40" fill="url(#sunsetGlow)" />
      <circle cx="80" cy="142" r="20" fill="#FFD27D" opacity="0.85" />

      {/* Sea */}
      <path d="M0 100 Q100 92 200 100 Q300 108 400 98 L400 140 L0 140Z" fill="#A2D2FF" opacity="0.55" />
      <path d="M0 108 Q80 100 160 108 Q240 116 320 106 L320 140 L0 140Z" fill="#BDE0FE" opacity="0.4" />

      {/* Marina beach sand */}
      <path d="M0 115 Q200 108 400 115 L400 140 L0 140Z" fill="#FFD27D" opacity="0.35" />

      {/* Lighthouse */}
      <g fill="#2B2A4C" opacity="0.75">
        <rect x="310" y="45" width="20" height="75" />
        {/* Lighthouse stripes */}
        {[52, 68, 84, 100].map(y => (
          <rect key={y} x="310" y={y} width="20" height="6" fill="#FF5D8F" opacity="0.35" />
        ))}
        {/* Light housing */}
        <rect x="306" y="38" width="28" height="12" rx="4" />
        {/* Light beam */}
        <path d="M320 44 L360 20 L360 35Z" fill="#FFD27D" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" values="0 320 44;15 320 44;0 320 44;-15 320 44;0 320 44" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Base */}
        <rect x="300" y="118" width="40" height="22" rx="3" />
      </g>

      {/* Kites */}
      {[150, 230].map((kx, i) => (
        <g key={i}>
          <path d={`M${kx} 20 L${kx - 10} 36 L${kx} 50 L${kx + 10} 36Z`} fill={['#FFC8DD', '#BDE0FE'][i]} opacity="0.8" />
          <path d={`M${kx} 50 Q${kx + 5} 65 ${kx + 2} 80`} stroke="#2B2A4C" strokeWidth="1" fill="none" opacity="0.5" />
        </g>
      ))}

      {/* Waves */}
      {[0, 1, 2].map(i => (
        <path
          key={i}
          d={`M${i * 80} 105 Q${i * 80 + 20} 100 ${i * 80 + 40} 105`}
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/* ---- Dusk: Clock Tower, Jasmine Garlands ---- */
function DuskScene() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B2A4C" />
          <stop offset="50%" stopColor="#4a3568" />
          <stop offset="100%" stopColor="#CDB4DB" />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill="url(#duskSky)" />

      {/* Stars */}
      {[30, 70, 130, 200, 260, 300, 350, 380].map((sx, i) => (
        <circle key={i} cx={sx} cy={8 + (i % 4) * 7} r="1.5" fill="white" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Crescent moon */}
      <g transform="translate(340,20)">
        <circle cx="0" cy="0" r="16" fill="#FFD27D" opacity="0.9" />
        <circle cx="8" cy="-4" r="13" fill="#4a3568" />
      </g>

      {/* City skyline */}
      <g fill="#2B2A4C" opacity="0.8">
        {[0, 40, 90, 150, 210, 260, 310, 360].map((bx, i) => (
          <rect key={i} x={bx} y={60 + (i % 3) * 10} width={30 + (i % 2) * 15} height={80 - (i % 3) * 10} />
        ))}
        {/* Windows (glowing) */}
        {[20, 55, 100, 160, 220, 275].map((bx, i) => (
          <g key={i}>
            {[0, 1, 2].map(row => (
              [0, 1].map(col => (
                <rect key={`${row}-${col}`} x={bx + col * 10} y={70 + row * 12} width="6" height="8" fill="#FFD27D" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${2 + i * 0.4}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </rect>
              ))
            ))}
          </g>
        ))}
      </g>

      {/* Chennai Central clock tower */}
      <g fill="#1a1340" opacity="0.9">
        {/* Tower body */}
        <rect x="175" y="20" width="50" height="120" />
        {/* Arched windows */}
        {[35, 60, 85, 110].map(y => (
          <path key={y} d={`M180 ${y} h8 v10 Q184 ${y + 15} 183 ${y + 15} Q182 ${y + 15} 183 ${y + 15} Q182 ${y + 15} 180 ${y + 10}Z`}
            fill="#CDB4DB" opacity="0.3" />
        ))}
        {/* Clock face */}
        <circle cx="200" cy="30" r="14" fill="#FFF7F0" opacity="0.9" />
        <circle cx="200" cy="30" r="11" fill="none" stroke="#2B2A4C" strokeWidth="2" />
        {/* Clock hands */}
        <line x1="200" y1="30" x2="200" y2="22" stroke="#2B2A4C" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="30" x2="206" y2="30" stroke="#2B2A4C" strokeWidth="2" strokeLinecap="round" />
        {/* Top ornament */}
        <polygon points="175,20 200,5 225,20" fill="#1a1340" />
        <circle cx="200" cy="4" r="4" fill="#FFD27D" opacity="0.7" />
        {/* Base */}
        <rect x="165" y="128" width="70" height="12" rx="2" />
      </g>

      {/* Jasmine garland */}
      <path
        d="M60 90 Q100 80 140 90 Q180 100 220 85 Q260 75 300 88"
        stroke="#FFF7F0"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4,6"
        opacity="0.5"
      />
      {[80, 120, 160, 200, 240, 280].map((gx, i) => (
        <circle key={i} cx={gx} cy={88 - Math.sin(i * 0.5) * 8} r="3" fill="white" opacity="0.7" />
      ))}
    </svg>
  );
}

/* ---- Starry: Terminal Station at Night ---- */
function StarryScene() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="starrySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a1f" />
          <stop offset="60%" stopColor="#1a1340" />
          <stop offset="100%" stopColor="#2B2A4C" />
        </linearGradient>
        <radialGradient id="platformGlow" cx="50%" cy="100%">
          <stop offset="0%" stopColor="#FFD27D" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="140" fill="url(#starrySky)" />

      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.sin(i * 1.3) * 200 + 200}
          cy={Math.cos(i * 2.1) * 50 + 40}
          r={0.8 + (i % 3) * 0.6}
          fill="white"
          opacity={0.4 + (i % 5) * 0.1}
        >
          <animate
            attributeName="opacity"
            values={`${0.3 + (i % 4) * 0.1};${0.8 + (i % 3) * 0.1};${0.3 + (i % 4) * 0.1}`}
            dur={`${1.5 + (i % 7) * 0.5}s`}
            begin={`${(i % 5) * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Full moon */}
      <circle cx="80" cy="30" r="22" fill="#FFF7F0" opacity="0.95">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="30" r="30" fill="#FFF7F0" opacity="0.1" />
      {/* Moon craters */}
      <circle cx="74" cy="24" r="4" fill="#E9DDF7" opacity="0.4" />
      <circle cx="86" cy="34" r="3" fill="#E9DDF7" opacity="0.3" />

      {/* Terminal platform */}
      <rect x="0" y="110" width="400" height="30" fill="url(#platformGlow)" />
      <rect x="0" y="110" width="400" height="6" fill="#2B2A4C" opacity="0.9" />
      {/* Yellow safety strip */}
      <rect x="0" y="108" width="400" height="4" fill="#FFD27D" opacity="0.8" />

      {/* Platform lights / lanterns */}
      {[50, 130, 210, 290, 370].map((lx, i) => (
        <g key={i}>
          <line x1={lx} y1="60" x2={lx} y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx={lx} cy="60" r="6" fill="#FFD27D" opacity="0.9">
            <animate attributeName="r" values="5;7;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          {/* Glow */}
          <circle cx={lx} cy="60" r="14" fill="#FFD27D" opacity="0.15">
            <animate attributeName="r" values="12;18;12" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Fireflies */}
      {[90, 160, 230, 300].map((fx, i) => (
        <circle key={i} cx={fx} cy={85 + (i % 3) * 8} r="2" fill="#FFD27D">
          <animate attributeName="opacity" values="0;0.9;0" dur={`${1.5 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${fx};${fx + 8};${fx}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Shooting star */}
      <line x1="300" y1="15" x2="340" y2="35" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round">
        <animate attributeName="opacity" values="0;0.8;0" dur="4s" begin="2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0 0;-50 20;0 0" dur="4s" begin="2s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}
