import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChime, playPneumaticHiss } from '../../lib/audio';
import { CreativeMetroDoors } from '../Doors/CreativeMetroDoors';

interface Props {
  onBoard: () => void;
}

export function IntroScreen({ onBoard }: Props) {
  const [phase, setPhase] = useState<'arriving' | 'ready'>('arriving');
  const [boarding, setBoarding] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleBoard = () => {
    setBoarding(true);
    playPneumaticHiss();
    setTimeout(() => {
      setDoorOpen(true);
      playChime();
      setTimeout(onBoard, 750);
    }, 250);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1340 0%, #2B2A4C 35%, #4a3568 60%, #FFC8DD 90%, #FFF7F0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stars */}
      <Stars />

      {/* Platform scene */}
      <div className="relative w-full flex-1 flex flex-col">
        {/* Platform SVG */}
        <PlatformScene phase={phase} />
      </div>

      {/* Title + CTA */}
      <motion.div
        className="relative z-10 w-full px-6 pb-safe-bottom flex flex-col items-center gap-6"
        style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2 opacity-70"
            style={{ color: '#CDB4DB', fontFamily: 'var(--font-mono)' }}
          >
            Platform 01 · Now Boarding
          </p>
          <h1
            className="text-5xl leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: '#FFF7F0',
              textShadow: '0 2px 20px rgba(255,93,143,0.4)',
            }}
          >
            Our Metro<br />Journey
          </h1>
        </div>

        <motion.button
          onClick={handleBoard}
          disabled={boarding}
          className="btn-ripple w-full py-5 rounded-full text-lg font-semibold tracking-wide"
          style={{
            fontFamily: 'var(--font-ui)',
            background: 'linear-gradient(135deg, #FF5D8F, #CDB4DB)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(255,93,143,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            cursor: boarding ? 'default' : 'pointer',
          }}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          animate={{
            boxShadow: [
              '0 4px 24px rgba(255,93,143,0.4)',
              '0 4px 32px rgba(255,93,143,0.7)',
              '0 4px 24px rgba(255,93,143,0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {boarding ? 'Boarding Carriage 01... 🚇' : 'Board the train 🚇'}
        </motion.button>
      </motion.div>

      {/* Boarding Creative Doors Transition */}
      <AnimatePresence>
        {boarding && (
          <motion.div
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CreativeMetroDoors
              open={doorOpen}
              phase={doorOpen ? 'door-open' : 'door-close'}
              targetTitle="The Beginning"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---- Stars ---- */
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    dur: 2 + Math.random() * 3,
  }));

  return (
    <svg className="absolute inset-0 w-full" style={{ height: '65%' }} viewBox="0 0 390 500" preserveAspectRatio="xMidYMid slice">
      {stars.map(s => (
        <circle key={s.id} cx={s.x * 3.9} cy={s.y * 5} r={s.size} fill="#fff">
          <animate attributeName="opacity" values="0.2;1;0.2" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ---- Platform Scene ---- */
function PlatformScene({ phase }: { phase: 'arriving' | 'ready' }) {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 390 420"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1340" />
          <stop offset="60%" stopColor="#4a3568" />
          <stop offset="100%" stopColor="#FFC8DD" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="platformGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B2A4C" />
          <stop offset="100%" stopColor="#1a1340" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Platform floor */}
      <rect x="0" y="300" width="390" height="120" fill="url(#platformGrad)" />

      {/* Yellow tactile strip */}
      <rect x="0" y="300" width="390" height="6" fill="#FFD27D" opacity="0.9" />

      {/* Platform edge highlights */}
      <rect x="0" y="302" width="390" height="2" fill="#fff" opacity="0.1" />

      {/* Overhead canopy struts */}
      {[60, 170, 280, 340].map(x => (
        <g key={x}>
          <rect x={x} y="80" width="4" height="220" fill="#3a3860" rx="2" />
          <rect x={x - 20} y="80" width="44" height="8" fill="#2B2A4C" rx="2" />
        </g>
      ))}

      {/* Canopy roof */}
      <rect x="0" y="72" width="390" height="16" fill="#2B2A4C" rx="2" />

      {/* LED strip lights on canopy */}
      {[40, 110, 190, 260, 330].map((x, i) => (
        <g key={x}>
          <rect x={x} y="82" width="50" height="4" rx="2" fill="#FFD27D" opacity="0.9">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}

      {/* Train arriving from right */}
      <motion.g
        style={{ x: phase === 'arriving' ? 500 : 0 }}
        animate={{ x: phase === 'ready' ? 0 : 500 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Train body */}
        <rect x="50" y="130" width="340" height="150" rx="20" fill="#2B2A4C" />
        {/* Front highlight */}
        <rect x="50" y="130" width="340" height="6" rx="3" fill="#FF5D8F" opacity="0.9" />
        {/* Windows */}
        {[80, 160, 240, 310].map(wx => (
          <g key={wx}>
            <rect x={wx} y="155" width="60" height="80" rx="10" fill="#BDE0FE" opacity="0.3" />
            <rect x={wx} y="155" width="60" height="4" rx="2" fill="#FFD27D" opacity="0.6" />
            <rect x={wx + 4} y="162" width="52" height="70" rx="8" fill="#FFF7F0" opacity="0.08" />
          </g>
        ))}
        {/* Stylized Exterior Door Set on train car */}
        <g>
          <rect x="172" y="206" width="46" height="72" rx="4" fill="#1b1a2f" />
          {/* Left panel */}
          <rect x="174" y="208" width="20" height="68" rx="2" fill="#353358" />
          {/* Right panel */}
          <rect x="196" y="208" width="20" height="68" rx="2" fill="#353358" />
          {/* Windows on exterior doors */}
          <rect x="176" y="214" width="16" height="30" rx="3" fill="#BDE0FE" opacity="0.4" />
          <rect x="198" y="214" width="16" height="30" rx="3" fill="#BDE0FE" opacity="0.4" />
          {/* Door handles */}
          <rect x="191" y="244" width="2" height="12" rx="1" fill="#FFD27D" />
          <rect x="197" y="244" width="2" height="12" rx="1" fill="#FFD27D" />
        </g>
        {/* Train undercarriage */}
        <rect x="70" y="278" width="300" height="10" rx="2" fill="#1a1340" />
        {/* Wheels */}
        {[110, 190, 270].map(wx => (
          <g key={wx}>
            <circle cx={wx} cy={295} r="12" fill="#2B2A4C" stroke="#FFD27D" strokeWidth="2" />
            <circle cx={wx} cy={295} r="4" fill="#FFD27D" opacity="0.7" />
          </g>
        ))}
      </motion.g>

      {/* Rail track */}
      <rect x="0" y="300" width="390" height="4" fill="#FFD27D" opacity="0.4" />
      {/* Track ties */}
      {Array.from({ length: 15 }).map((_, i) => (
        <rect key={i} x={i * 28} y="296" width="12" height="8" fill="#3a3860" rx="1" opacity="0.6" />
      ))}

      {/* "Mind the Gap" text */}
      <text x="195" y="320" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="#FFD27D" opacity="0.7" letterSpacing="3">
        MIND THE GAP
      </text>

      {/* Fireflies */}
      {[80, 150, 240, 310, 360].map((fx, i) => (
        <circle key={i} cx={fx} cy={260 + (i % 3) * 15} r="2" fill="#FFD27D">
          <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + i * 0.4}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${260 + (i % 3) * 15};${250 + (i % 3) * 15};${260 + (i % 3) * 15}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
