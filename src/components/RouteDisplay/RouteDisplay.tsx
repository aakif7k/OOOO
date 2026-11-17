import { motion } from 'framer-motion';
import type { Chapter } from '../../config/content';

interface Props {
  currentStation: number;
  targetStation: number;
  isTraveling: boolean;
  chapters: Chapter[];
  onJumpBack: (idx: number) => void;
}

const STATION_COLORS = ['#FFC8DD', '#BDE0FE', '#FFD27D', '#CDB4DB', '#FF5D8F'];

export function RouteDisplay({ currentStation, targetStation, isTraveling, chapters, onJumpBack }: Props) {
  const activeIdx = isTraveling ? targetStation : currentStation;

  return (
    <motion.div
      className="absolute left-0 right-0 z-30"
      style={{
        top: 0,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: 'rgba(43,42,76,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.3 }}
    >
      <div className="px-4 py-2">
        {/* Route line */}
        <div className="relative flex items-center justify-between gap-1">
          {/* Background track */}
          <div
            className="absolute left-4 right-4 h-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', top: '50%', transform: 'translateY(-50%)' }}
          />

          {/* Progress fill */}
          <motion.div
            className="absolute left-4 h-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #2F6FED, #FF5D8F)',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            animate={{ width: `${(activeIdx / 4) * (100 - 8)}%` }}
            transition={{ duration: isTraveling ? 3.8 : 0.4, ease: 'linear' }}
          />

          {/* Station nodes */}
          {chapters.map((ch, idx) => {
            const isPast = idx < activeIdx;
            const isActive = idx === activeIdx;
            const isVisitable = idx < currentStation;

            return (
              <button
                key={ch.id}
                onClick={() => isVisitable ? onJumpBack(idx) : undefined}
                className="relative z-10 flex flex-col items-center gap-1"
                style={{ cursor: isVisitable ? 'pointer' : 'default', minWidth: 0 }}
                aria-label={isVisitable ? `Go back to ${ch.titleEn}` : ch.titleEn}
              >
                {/* Node circle */}
                <motion.div
                  className="rounded-full border-2 flex items-center justify-center"
                  style={{
                    width: isActive ? 18 : 12,
                    height: isActive ? 18 : 12,
                    background: isPast || isActive ? STATION_COLORS[idx] : 'transparent',
                    borderColor: isPast || isActive ? STATION_COLORS[idx] : 'rgba(255,255,255,0.3)',
                    boxShadow: isActive ? `0 0 12px ${STATION_COLORS[idx]}88` : 'none',
                  }}
                  animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                >
                  {isPast && (
                    <span style={{ fontSize: '6px', color: '#2B2A4C' }}>✓</span>
                  )}
                </motion.div>

                {/* Station number */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    color: isActive ? STATION_COLORS[idx] : 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ch.stationNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current station name — flip animation */}
        <div className="mt-1.5 text-center">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isTraveling ? (
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: '#FFD27D', fontFamily: 'var(--font-mono)' }}
              >
                Next stop · {chapters[targetStation].titleEn}
                {chapters[targetStation].titleTa && (
                  <span style={{ fontFamily: 'var(--font-tamil)', opacity: 0.7, marginLeft: '6px' }}>
                    · {chapters[targetStation].titleTa}
                  </span>
                )}
              </span>
            ) : (
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)' }}
              >
                {chapters[currentStation].titleEn}
                {chapters[currentStation].titleTa && (
                  <span
                    lang="ta"
                    style={{ fontFamily: 'var(--font-tamil)', opacity: 0.6, marginLeft: '6px', fontSize: '10px' }}
                  >
                    · {chapters[currentStation].titleTa}
                  </span>
                )}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

