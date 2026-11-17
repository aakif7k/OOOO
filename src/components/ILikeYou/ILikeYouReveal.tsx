import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playHeartbeat } from '../../lib/audio';

interface Props {
  onComplete: () => void;
}

const LETTERS = 'I LIKE YOU.'.split('');

export function ILikeYouReveal({ onComplete }: Props) {
  const [phase, setPhase] = useState<'dimming' | 'letters' | 'pulse' | 'done'>('dimming');
  const [visibleLetters, setVisibleLetters] = useState(0);
  const calledRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('letters');
      playHeartbeat();
    }, 700);

    const t2 = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleLetters(count);
        if (count >= LETTERS.length) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('pulse');
            setTimeout(() => {
              if (!calledRef.current) {
                calledRef.current = true;
                setPhase('done');
                onComplete();
              }
            }, 2000);
          }, 500);
        }
      }, 150);
      return () => clearInterval(interval);
    }, 1100);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="relative my-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Letters */}
      <div className="flex flex-wrap justify-center items-center">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.2rem, 10vw, 2.8rem)',
              color: '#FF5D8F',
              display: 'inline-block',
              width: letter === ' ' ? '0.4em' : undefined,
              textShadow: phase === 'pulse'
                ? '0 0 30px rgba(255,93,143,0.9), 0 0 60px rgba(255,93,143,0.5)'
                : '0 0 16px rgba(255,93,143,0.5)',
              lineHeight: 1.1,
            }}
            initial={{ opacity: 0, y: 24, scale: 0.6 }}
            animate={i < visibleLetters
              ? {
                  opacity: 1,
                  y: 0,
                  scale: phase === 'pulse' ? [1, 1.1, 1] : 1,
                }
              : { opacity: 0, y: 24, scale: 0.6 }
            }
            transition={
              phase === 'pulse'
                ? { duration: 1, repeat: 2, ease: 'easeInOut' }
                : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {letter}
          </motion.span>
        ))}

        {visibleLetters >= LETTERS.length && (
          <motion.span
            style={{ fontSize: '2rem', marginLeft: '4px' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 0.1 }}
          >
            ❤️
          </motion.span>
        )}
      </div>

      {/* Heart particles */}
      {phase === 'pulse' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{
                left: `${15 + i * 8}%`,
                top: '60%',
              }}
              animate={{
                y: [0, -(50 + Math.random() * 60)],
                x: [(Math.random() - 0.5) * 30],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.2],
              }}
              transition={{ duration: 1.4, delay: i * 0.09, ease: 'easeOut' }}
            >
              {['❤️', '💕', '🌸', '✨'][i % 4]}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
