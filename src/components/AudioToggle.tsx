import { motion } from 'framer-motion';

interface Props {
  on: boolean;
  onToggle: () => void;
}

export function AudioToggle({ on, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed z-50 bottom-safe right-4 w-10 h-10 rounded-full flex items-center justify-center"
      style={{
        bottom: 'max(80px, calc(env(safe-area-inset-bottom) + 76px))',
        background: 'rgba(43,42,76,0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        color: '#fff',
        fontSize: '16px',
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
    >
      {on ? '🔊' : '🔇'}
    </motion.button>
  );
}
