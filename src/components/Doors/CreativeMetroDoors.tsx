import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  phase?: 'door-close' | 'accelerate' | 'cruise' | 'decelerate' | 'door-open';
  targetTitle?: string;
  speed?: number;
}

export function CreativeMetroDoors({ open, phase = 'door-close', targetTitle = '', speed = 0 }: Props) {
  const [heartSparkles, setHeartSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [heartPulsing, setHeartPulsing] = useState(false);

  // Tap on the misty window heart
  const handleWindowTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHeartPulsing(true);
    setTimeout(() => setHeartPulsing(false), 800);

    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
    }));
    setHeartSparkles(prev => [...prev.slice(-12), ...newSparkles]);
  }, []);

  const isClosing = phase === 'door-close';
  const isOpening = phase === 'door-open';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 25 }}>
      {/* Central light spill that floods out when doors open */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,210,125,0.7) 0%, rgba(255,200,221,0.4) 40%, transparent 70%)',
          transformOrigin: 'center center',
        }}
        initial={false}
        animate={{
          opacity: open ? 0.85 : 0,
          scaleX: open ? 1.4 : 0.02,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Overhead Door Transom & Warning Sign */}
      <div
        className="absolute left-0 right-0 z-30 flex flex-col items-center"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 38px)' }}
      >
        <div
          className="px-4 py-1 rounded-full flex items-center gap-2"
          style={{
            background: isClosing
              ? 'rgba(255,93,143,0.92)'
              : isOpening
              ? 'rgba(47,166,106,0.92)'
              : 'rgba(43,42,76,0.88)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: isClosing
              ? '0 0 16px rgba(255,93,143,0.8)'
              : isOpening
              ? '0 0 16px rgba(47,166,106,0.8)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Pulsing indicator bulb */}
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: isClosing ? '#FFF' : isOpening ? '#FFD27D' : '#A2D2FF',
            }}
            animate={isClosing || isOpening ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : { opacity: 0.8 }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8.5px',
              color: '#FFFFFF',
              letterSpacing: '0.15em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {isClosing
              ? '⚠ DOORS CLOSING · கதவுகள் மூடுகின்றன ⚠'
              : isOpening
              ? '✓ DOORS OPENING · கதவுகள் திறக்கின்றன ✓'
              : targetTitle
              ? `EN ROUTE · ${targetTitle.toUpperCase()}`
              : 'AUTOMATED METRO DOORS'}
          </span>
        </div>
      </div>

      {/* The Two Sliding Door Panels */}
      <div className="absolute inset-0 flex">
        {/* ============================================================== */}
        {/* LEFT DOOR PANEL */}
        {/* ============================================================== */}
        <motion.div
          className="relative h-full pointer-events-auto"
          style={{
            width: '50%',
            background: 'linear-gradient(135deg, #252440 0%, #353358 45%, #2a284c 85%, #1e1d35 100%)',
            borderRight: '3px solid #161528',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset -4px 0 12px rgba(0,0,0,0.6)',
          }}
          initial={false}
          animate={{ x: open ? '-101%' : '0%' }}
          transition={{
            type: 'spring',
            damping: 26,
            stiffness: 220,
            mass: 0.9,
          }}
        >
          {/* Metallic Door Shell Details */}
          <div className="absolute inset-2 border border-white border-opacity-10 rounded-xl pointer-events-none" />

          {/* Upper Door Window (Observation Glass) */}
          <div
            className="absolute left-3 right-4 rounded-2xl overflow-hidden cursor-pointer"
            style={{
              top: '20%',
              height: '38%',
              background: 'radial-gradient(circle at 40% 30%, rgba(189,224,254,0.18) 0%, rgba(43,42,76,0.92) 100%)',
              border: '2px solid rgba(255,255,255,0.22)',
              boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
            }}
            onClick={handleWindowTap}
          >
            {/* View through the glass: Rushing tunnel / night streaks */}
            {speed > 0 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute top-0 bottom-0"
                    style={{
                      width: '45px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,210,125,0.5), transparent)',
                    }}
                    animate={{ x: ['-100%', '350%'] }}
                    transition={{
                      duration: 0.45 / speed,
                      repeat: Infinity,
                      delay: i * 0.14,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Frosted condensation vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(205,180,219,0.22) 100%)',
                backdropFilter: 'blur(3px)',
              }}
            />

            {/* Specular Glare Diagonal Bar */}
            <motion.div
              className="absolute top-0 bottom-0 w-8 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                transform: 'skewX(-20deg)',
              }}
              animate={open ? { x: ['-100%', '300%'] } : { x: ['300%', '-100%'] }}
              transition={{ duration: 0.6 }}
            />

            {/* Laser-etched safety lines */}
            <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40 pointer-events-none">
              <div className="h-px bg-white border-t border-dashed border-white" />
              <div className="h-px bg-white" />
            </div>

            {/* Station Silhouette Decal inside left glass */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between opacity-50 pointer-events-none">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: '#BDE0FE' }}>
                SAFETY GLASS
              </span>
              <span style={{ fontSize: '9px' }}>🚇</span>
            </div>
          </div>

          {/* Ergonomic Brushed Stainless Handle Grip */}
          <div
            className="absolute rounded-full flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: '58%',
              right: '8px',
              width: '12px',
              height: '80px',
              background: 'linear-gradient(180deg, #6c6a8c 0%, #d8d6ea 50%, #525070 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), -2px 2px 6px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <div className="w-1 h-12 rounded-full bg-white opacity-40" />
          </div>

          {/* Lower Door Kick-Plate */}
          <div
            className="absolute left-3 right-3 rounded-lg overflow-hidden pointer-events-none"
            style={{
              bottom: '42px',
              height: '46px',
              background: 'linear-gradient(180deg, #302e4d 0%, #201e38 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            {/* Horizontal ribbed grooves */}
            {[8, 18, 28, 38].map(y => (
              <div key={y} className="absolute left-2 right-2 h-0.5 bg-black opacity-40" style={{ top: `${y}px` }} />
            ))}
          </div>

          {/* Yellow Hazard Line at base */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: '10px',
              background: 'repeating-linear-gradient(45deg, #FFD27D, #FFD27D 8px, #2B2A4C 8px, #2B2A4C 16px)',
              boxShadow: '0 -2px 6px rgba(0,0,0,0.4)',
            }}
          />

          {/* Left Vertical Rubber Gasket Seal */}
          <div
            className="absolute top-0 bottom-0 right-0 w-2.5 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #1b1a2c 0%, #0d0c18 100%)',
              boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.1)',
            }}
          />
        </motion.div>

        {/* ============================================================== */}
        {/* RIGHT DOOR PANEL */}
        {/* ============================================================== */}
        <motion.div
          className="relative h-full pointer-events-auto"
          style={{
            width: '50%',
            background: 'linear-gradient(225deg, #252440 0%, #353358 45%, #2a284c 85%, #1e1d35 100%)',
            borderLeft: '3px solid #161528',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 4px 0 12px rgba(0,0,0,0.6)',
          }}
          initial={false}
          animate={{ x: open ? '101%' : '0%' }}
          transition={{
            type: 'spring',
            damping: 26,
            stiffness: 220,
            mass: 0.9,
          }}
        >
          {/* Metallic Door Shell Details */}
          <div className="absolute inset-2 border border-white border-opacity-10 rounded-xl pointer-events-none" />

          {/* Upper Door Window (Observation Glass) with Finger-Drawn Heart ❤️ */}
          <div
            className="absolute left-4 right-3 rounded-2xl overflow-hidden cursor-pointer"
            style={{
              top: '20%',
              height: '38%',
              background: 'radial-gradient(circle at 60% 30%, rgba(189,224,254,0.18) 0%, rgba(43,42,76,0.92) 100%)',
              border: '2px solid rgba(255,255,255,0.22)',
              boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
            }}
            onClick={handleWindowTap}
            title="Tap the misty heart on the window ✨"
          >
            {/* View through the glass: Rushing tunnel / night streaks */}
            {speed > 0 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute top-0 bottom-0"
                    style={{
                      width: '45px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,200,221,0.5), transparent)',
                    }}
                    animate={{ x: ['-100%', '350%'] }}
                    transition={{
                      duration: 0.45 / speed,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Frosted condensation vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(205,180,219,0.22) 100%)',
                backdropFilter: 'blur(3px)',
              }}
            />

            {/* Specular Glare Diagonal Bar */}
            <motion.div
              className="absolute top-0 bottom-0 w-8 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                transform: 'skewX(-20deg)',
              }}
              animate={open ? { x: ['-100%', '300%'] } : { x: ['300%', '-100%'] }}
              transition={{ duration: 0.6 }}
            />

            {/* FINGER-DRAWN HEART ETCHED INTO THE MISTY WINDOW ❤️ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.svg
                width="72"
                height="68"
                viewBox="0 0 72 68"
                className="overflow-visible"
                animate={heartPulsing ? { scale: [1, 1.25, 1], filter: 'drop-shadow(0 0 14px rgba(255,93,143,1))' } : { scale: [1, 1.05, 1] }}
                transition={{ duration: heartPulsing ? 0.6 : 2.5, repeat: heartPulsing ? 1 : Infinity, ease: 'easeInOut' }}
              >
                {/* Wobbly finger outline - transparent center clearing the fog */}
                <path
                  d="M36 58 C16 44, 4 30, 4 18 C4 8, 12 2, 22 2 C28 2, 33 6, 36 11 C39 6, 44 2, 50 2 C60 2, 68 8, 68 18 C68 30, 56 44, 36 58 Z"
                  fill="rgba(255,93,143,0.12)"
                  stroke="#FFC8DD"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255,93,143,0.8))',
                  }}
                />
                {/* Tiny sparkle stars on the drawn line */}
                <circle cx="22" cy="14" r="1.5" fill="#FFF" />
                <circle cx="50" cy="14" r="1.5" fill="#FFF" />
              </motion.svg>

              <span
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '10px',
                  color: '#FFAFCC',
                  textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                  marginTop: '2px',
                }}
              >
                our little ride ✨
              </span>
            </div>

            {/* Interactive tap sparkles */}
            <AnimatePresence>
              {heartSparkles.map(s => (
                <motion.span
                  key={s.id}
                  className="absolute text-sm pointer-events-none"
                  style={{ left: s.x, top: s.y }}
                  initial={{ scale: 0.4, opacity: 1, y: 0 }}
                  animate={{ scale: 1.2, opacity: 0, y: -28 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                  ✨
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Laser-etched safety lines */}
            <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40 pointer-events-none">
              <div className="h-px bg-white border-t border-dashed border-white" />
              <div className="h-px bg-white" />
            </div>

            {/* Decal */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between opacity-50 pointer-events-none">
              <span style={{ fontSize: '9px' }}>🚇</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: '#BDE0FE' }}>
                PUSH IN EMERGENCY
              </span>
            </div>
          </div>

          {/* Ergonomic Brushed Stainless Handle Grip */}
          <div
            className="absolute rounded-full flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: '58%',
              left: '8px',
              width: '12px',
              height: '80px',
              background: 'linear-gradient(180deg, #6c6a8c 0%, #d8d6ea 50%, #525070 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 2px 2px 6px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <div className="w-1 h-12 rounded-full bg-white opacity-40" />
          </div>

          {/* Lower Door Kick-Plate */}
          <div
            className="absolute left-3 right-3 rounded-lg overflow-hidden pointer-events-none"
            style={{
              bottom: '42px',
              height: '46px',
              background: 'linear-gradient(180deg, #302e4d 0%, #201e38 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            {[8, 18, 28, 38].map(y => (
              <div key={y} className="absolute left-2 right-2 h-0.5 bg-black opacity-40" style={{ top: `${y}px` }} />
            ))}
          </div>

          {/* Yellow Hazard Line at base */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: '10px',
              background: 'repeating-linear-gradient(45deg, #FFD27D, #FFD27D 8px, #2B2A4C 8px, #2B2A4C 16px)',
              boxShadow: '0 -2px 6px rgba(0,0,0,0.4)',
            }}
          />

          {/* Right Vertical Rubber Gasket Seal */}
          <div
            className="absolute top-0 bottom-0 left-0 w-2.5 pointer-events-none"
            style={{
              background: 'linear-gradient(270deg, #1b1a2c 0%, #0d0c18 100%)',
              boxShadow: 'inset -1px 0 2px rgba(255,255,255,0.1)',
            }}
          />
        </motion.div>
      </div>

      {/* Threshold Floor Decal: Illuminated "MIND THE GAP" */}
      <div
        className="absolute left-0 right-0 z-30 text-center pointer-events-none"
        style={{
          bottom: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          color: '#FFD27D',
          letterSpacing: '0.22em',
          fontWeight: 600,
          textShadow: '0 0 10px rgba(255,210,125,0.6)',
        }}
      >
        MIND THE GAP · இடைவெளியைக் கவனியுங்கள்
      </div>
    </div>
  );
}
