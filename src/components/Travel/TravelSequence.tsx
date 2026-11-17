import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  playDoorBeep,
  playChime,
  playRailClack,
  startRailHum,
  playPneumaticHiss,
  playDoorLatch,
} from '../../lib/audio';
import { CreativeMetroDoors } from '../Doors/CreativeMetroDoors';

interface Props {
  toTitle: string;
  onComplete: () => void;
}

type Phase = 'door-close' | 'accelerate' | 'cruise' | 'decelerate' | 'door-open';

const PHASE_DURATIONS: Record<Phase, number> = {
  'door-close':  800,
  'accelerate':  900,
  'cruise':      1300,
  'decelerate':  700,
  'door-open':   700,
};

export function TravelSequence({ toTitle, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('door-close');
  const [doorOpen, setDoorOpen] = useState(false);
  const stopHumRef = useRef<(() => void) | null>(null);
  const clackRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const phases: Phase[] = ['door-close', 'accelerate', 'cruise', 'decelerate', 'door-open'];

    phases.forEach(p => {
      const delay = elapsed;
      timers.push(setTimeout(() => {
        setPhase(p);

        if (p === 'door-close') {
          setDoorOpen(false);
          playDoorBeep();
          setTimeout(() => {
            playPneumaticHiss();
            playDoorLatch();
          }, 350);
        }
        if (p === 'accelerate') {
          stopHumRef.current = startRailHum();
          let n = 0;
          clackRef.current = setInterval(() => {
            playRailClack();
            if (++n > 25) { clearInterval(clackRef.current!); clackRef.current = null; }
          }, 190);
        }
        if (p === 'door-open') {
          if (clackRef.current) { clearInterval(clackRef.current); clackRef.current = null; }
          stopHumRef.current?.();
          playPneumaticHiss();
          setDoorOpen(true);
          playChime();
          setTimeout(onComplete, PHASE_DURATIONS['door-open'] + 50);
        }
      }, delay));
      elapsed += PHASE_DURATIONS[p];
    });

    return () => {
      timers.forEach(clearTimeout);
      if (clackRef.current) clearInterval(clackRef.current);
      stopHumRef.current?.();
    };
  }, []);

  const speedFactor =
    phase === 'door-close' ? 0
    : phase === 'accelerate' ? 0.7
    : phase === 'cruise' ? 1
    : phase === 'decelerate' ? 0.35
    : 0;

  if (reduced) {
    return (
      <motion.div
        className="absolute inset-0"
        style={{ background: '#12101E' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.4 }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ background: '#12101E' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ceiling LED streaks */}
      {speedFactor > 0 && <LightStreaks speed={speedFactor} />}

      {/* Interior when in motion */}
      {!doorOpen && (
        <>
          {/* Camera shake when moving */}
          {speedFactor > 0.3 && (
            <motion.div
              className="absolute inset-0"
              animate={{
                x: [0, 0.7, -0.5, 0.4, 0],
                y: [0, -0.4, 0.5, -0.3, 0],
              }}
              transition={{ duration: 0.09, repeat: Infinity, ease: 'linear' }}
            >
              {/* Windows behind doors */}
              <WindowStreaks speed={speedFactor} />
            </motion.div>
          )}

          {/* Grab handles swinging */}
          <div
            className="absolute left-0 right-0 flex justify-around px-10 pointer-events-none"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 72px)', zIndex: 10 }}
          >
            {[0, 1, 2, 3].map(i => (
              <TravelHandle key={i} delay={i * 0.3} swing={speedFactor} />
            ))}
          </div>

          {/* Floor */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '90px',
              background: 'linear-gradient(to top, #0d0a1f, #1a1340)',
              zIndex: 5,
            }}
          />
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ bottom: '88px', height: '3px', background: '#FFD27D', opacity: 0.65, zIndex: 6 }}
          />

          {/* Floating hearts in cruise phase */}
          {phase === 'cruise' && <FloatingHearts />}
        </>
      )}

      {/* Creative Metro Door overlay */}
      <CreativeMetroDoors
        open={doorOpen}
        phase={phase}
        targetTitle={toTitle}
        speed={speedFactor}
      />
    </motion.div>
  );
}

function LightStreaks({ speed }: { speed: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '48px', zIndex: 8 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${50 + i * 25}px`,
            height: '2px',
            top: `${10 + i * 6}px`,
            background: 'linear-gradient(90deg, transparent, #FFD27D, #fff, transparent)',
            opacity: 0.35 * speed,
          }}
          animate={{ x: ['-100%', '600%'] }}
          transition={{
            duration: 0.55 / speed,
            repeat: Infinity,
            delay: i * 0.11,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function WindowStreaks({ speed }: { speed: number }) {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div
          key={side}
          className="absolute overflow-hidden rounded-2xl opacity-40"
          style={{
            top: '18%',
            [side]: '6%',
            width: '40%',
            height: '42%',
            background: 'rgba(189,224,254,0.1)',
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                width: '60px',
                background: 'linear-gradient(90deg, transparent, rgba(189,224,254,0.4), transparent)',
              }}
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 0.5 / speed, repeat: Infinity, delay: i * 0.16, ease: 'linear' }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function TravelHandle({ delay, swing }: { delay: number; swing: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={{ rotate: [-swing * 12, swing * 12, -swing * 12] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="w-px bg-white opacity-25" style={{ height: '32px' }} />
      <svg width="20" height="18" viewBox="0 0 20 18">
        <path d="M3 2 Q10 -3 17 2 L18 16 Q10 21 2 16 Z" fill="none" stroke="rgba(205,180,219,0.4)" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 12 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-xl"
          style={{ left: `${8 + i * 11}%`, bottom: '25%' }}
          animate={{ y: [0, -100, -160], opacity: [0, 0.9, 0], scale: [0.5, 1, 0.3] }}
          transition={{ duration: 2, delay: i * 0.28, repeat: Infinity, ease: 'easeOut' }}
        >
          {['❤️', '🌸', '💕', '✨'][i % 4]}
        </motion.span>
      ))}
    </div>
  );
}
