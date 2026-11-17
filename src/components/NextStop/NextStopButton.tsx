import { motion } from 'framer-motion';
import { playTap } from '../../lib/audio';

interface Props {
  label: string;
  onClick: () => void;
  isConfession?: boolean;
  waitForILikeYou?: boolean;
  isLocked?: boolean;
  remainingSeconds?: number;
  progress?: number;
}

export function NextStopButton({
  label,
  onClick,
  waitForILikeYou,
  isLocked = false,
  remainingSeconds = 0,
  progress = 0,
}: Props) {
  const isDisabled = isLocked || !!waitForILikeYou;

  const handleClick = () => {
    if (isDisabled) return;
    playTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (e) {}
    }
    onClick();
  };

  return (
    <motion.div
      className="relative z-20 px-4"
      style={{
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        paddingTop: '8px',
      }}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: waitForILikeYou ? 0.4 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
    >
      <motion.button
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className="btn-ripple relative w-full overflow-hidden rounded-full font-semibold text-white"
        style={{
          minHeight: '56px',
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          letterSpacing: '0.03em',
          background: isLocked
            ? 'linear-gradient(135deg, rgba(65, 48, 80, 0.78) 0%, rgba(43, 42, 76, 0.88) 100%)'
            : 'linear-gradient(135deg, #FF5D8F 0%, #CDB4DB 50%, #BDE0FE 100%)',
          boxShadow: isLocked
            ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 4px 20px rgba(255,93,143,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
          border: isLocked
            ? '1px solid rgba(255,255,255,0.18)'
            : '1px solid rgba(255,255,255,0.4)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        }}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        whileHover={isDisabled ? {} : { scale: 1.01 }}
      >
        {/* Progress fill inside the pill while locked */}
        {isLocked && (
          <div
            className="absolute inset-y-0 left-0 pointer-events-none transition-all duration-100 ease-linear"
            style={{
              width: `${Math.min(100, Math.max(0, progress * 100))}%`,
              background: 'linear-gradient(90deg, rgba(255, 93, 143, 0.4) 0%, rgba(189, 224, 254, 0.4) 100%)',
              borderRight: '1.5px solid rgba(255, 255, 255, 0.75)',
            }}
          />
        )}

        {/* Shimmer sweep when unlocked */}
        {!isLocked && (
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {isLocked ? (
          <span className="relative z-10 flex items-center justify-center gap-2 text-white/95">
            <span className="text-xs opacity-80">🔒</span>
            <span>
              Next stop in <span className="font-mono font-bold text-pink-200">{remainingSeconds}s</span>
            </span>
          </span>
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>Next stop:</span>
            <span className="font-bold">{label}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
