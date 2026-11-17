import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { ProposalConfig } from '../../config/content';
import { playCelebration } from '../../lib/audio';

interface Names {
  sender: string;
  recipient: string;
  pronoun: 'she' | 'he' | 'they';
}

interface Props {
  proposal: ProposalConfig;
  names: Names;
  onReplay: () => void;
}

export function ProposalCard({ proposal, onReplay }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'question' | 'answered'>('question');
  const [noIdx, setNoIdx] = useState(0);
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const handleYes = useCallback(() => {
    if (phase === 'answered') return;
    setPhase('answered');
    playCelebration();
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 120]);

    const shoot = (angle: number, origin: { x: number; y: number }) => {
      confetti({
        particleCount: 65,
        angle,
        spread: 55,
        origin,
        colors: ['#FFC8DD', '#CDB4DB', '#BDE0FE', '#FFD27D', '#FF5D8F', '#FFAFCC'],
        gravity: 1.1,
      });
    };
    setTimeout(() => shoot(60, { x: 0, y: 0.7 }), 0);
    setTimeout(() => shoot(120, { x: 1, y: 0.7 }), 150);
    setTimeout(() => shoot(90, { x: 0.5, y: 0.6 }), 300);
    setTimeout(() => shoot(60, { x: 0.15, y: 0.9 }), 500);
    setTimeout(() => shoot(120, { x: 0.85, y: 0.9 }), 650);
  }, [phase]);

  const handleNo = useCallback(() => {
    const nextIdx = Math.min(noIdx + 1, proposal.noStages.length - 1);
    setNoIdx(nextIdx);
    setNoScale(prev => Math.max(0.55, prev * 0.84));
    setYesScale(prev => Math.min(1.22, prev + 0.07));
    setNoPos({ x: (Math.random() - 0.5) * 90, y: (Math.random() - 0.5) * 44 });
    if (navigator.vibrate) navigator.vibrate(25);
  }, [noIdx, proposal.noStages.length]);

  if (phase === 'answered') {
    return <CelebrationView proposal={proposal} onReplay={onReplay} />;
  }

  return (
    <motion.div
      ref={cardRef}
      className="mt-6 flex flex-col items-center gap-5 pb-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* The question */}
      <motion.p
        className="text-center leading-snug font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          color: '#FF5D8F',
          fontSize: 'clamp(1.1rem, 5vw, 1.4rem)',
        }}
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {proposal.question}
      </motion.p>

      {/* Button area */}
      <div className="relative w-full flex justify-center items-center gap-5" style={{ minHeight: '96px' }}>
        {/* YES button */}
        <motion.button
          onClick={handleYes}
          className="btn-ripple relative z-10 py-4 px-8 rounded-full font-bold text-white"
          style={{
            fontFamily: 'var(--font-content)',
            fontSize: '1.05rem',
            background: 'linear-gradient(135deg, #FF5D8F, #FFAFCC)',
            boxShadow: '0 4px 24px rgba(255,93,143,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            scale: yesScale,
          }}
          animate={{
            boxShadow: [
              '0 4px 24px rgba(255,93,143,0.4)',
              '0 4px 36px rgba(255,93,143,0.75)',
              '0 4px 24px rgba(255,93,143,0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: yesScale * 0.94 }}
        >
          YES ❤️
        </motion.button>

        {/* NO button — dodge */}
        <motion.button
          onClick={handleNo}
          onMouseEnter={handleNo}
          className="py-3 px-5 rounded-full text-sm font-medium"
          style={{
            fontFamily: 'var(--font-content)',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.32)',
            color: '#FFFFFF',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            scale: noScale,
          }}
          animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          whileTap={{ scale: noScale * 0.9 }}
          aria-label={`${proposal.noStages[noIdx]} — tap YES instead`}
        >
          {proposal.noStages[noIdx]}
        </motion.button>
      </div>
    </motion.div>
  );
}

function CelebrationView({ proposal, onReplay }: { proposal: ProposalConfig; onReplay: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-4 py-4"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Couple illustration */}
      <CoupleOnPlatform />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem, 7vw, 2.2rem)',
            color: '#FF5D8F',
            margin: '0 0 6px',
          }}
        >
          {proposal.yesMessage}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-content)',
            fontSize: '0.88rem',
            color: '#FFFFFF',
            opacity: 0.92,
            lineHeight: 1.5,
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {proposal.yesSubtext}
        </p>
      </motion.div>

      {/* Floating hearts */}
      <div className="relative w-full overflow-hidden" style={{ height: '48px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            style={{ left: `${10 + i * 11}%`, bottom: 0 }}
            animate={{ y: [0, -50], opacity: [0.9, 0] }}
            transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity, repeatDelay: 0.8 }}
          >
            {['❤️', '🌸', '💕', '✨'][i % 4]}
          </motion.span>
        ))}
      </div>

      <motion.button
        onClick={onReplay}
        className="mt-1 py-3 px-6 rounded-full text-sm font-medium"
        style={{
          fontFamily: 'var(--font-content)',
          background: 'rgba(255,255,255,0.16)',
          border: '1px solid rgba(255,255,255,0.32)',
          color: '#FFFFFF',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Replay journey ↺
      </motion.button>
    </motion.div>
  );
}

function CoupleOnPlatform() {
  return (
    <motion.svg
      width="200"
      height="130"
      viewBox="0 0 200 130"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
    >
      {/* Platform */}
      <rect x="10" y="112" width="180" height="4" rx="2" fill="#FFD27D" opacity="0.65" />
      <rect x="10" y="116" width="180" height="10" rx="2" fill="#2B2A4C" opacity="0.35" />

      {/* Person A (left – dress silhouette) */}
      <g>
        <circle cx="72" cy="30" r="17" fill="#FFAFCC" />
        {/* Hair */}
        <path d="M55 26 Q72 12 89 26 Q89 20 72 15 Q55 20 55 26" fill="#2B2A4C" opacity="0.75" />
        {/* Body - dress */}
        <path d="M58 46 Q72 50 86 46 L90 112 L54 112 Z" fill="#CDB4DB" opacity="0.85" />
        {/* Arms */}
        <path d="M58 50 Q48 60 50 75" stroke="#FFAFCC" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M86 50 Q96 60 94 75" stroke="#FFAFCC" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      {/* Person B (right – suit silhouette) */}
      <g>
        <circle cx="128" cy="30" r="17" fill="#BDE0FE" />
        {/* Hair short */}
        <path d="M111 26 Q128 14 145 26 L143 20 Q128 10 113 20 Z" fill="#2B2A4C" opacity="0.75" />
        {/* Body */}
        <rect x="114" y="46" width="28" height="66" rx="6" fill="#2B2A4C" opacity="0.75" />
        {/* Collar/tie detail */}
        <path d="M128 48 L132 55 L128 68 L124 55 Z" fill="#FF5D8F" opacity="0.6" />
        {/* Arms */}
        <path d="M114 50 Q104 60 106 75" stroke="#BDE0FE" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M142 50 Q152 60 150 75" stroke="#BDE0FE" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      {/* Holding hands in the middle */}
      <ellipse cx="100" cy="78" rx="12" ry="8" fill="#FF5D8F" opacity="0.3" />
      <path d="M94 75 Q100 80 106 75" stroke="#FF5D8F" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Heart above */}
      <motion.text
        x="100"
        y="10"
        textAnchor="middle"
        fontSize="20"
        animate={{ y: [10, 2, 10], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ❤️
      </motion.text>
    </motion.svg>
  );
}
