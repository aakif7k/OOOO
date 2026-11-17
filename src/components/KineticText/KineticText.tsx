import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  lines: string[];
  isNight: boolean;
  onComplete: () => void;
  accentColor: string;
}

const TANGLISH_PATTERNS = [
  'eppadi', 'nee ', 'enakku', 'ivlo', 'aana nu', 'Unkitta',
  'pesura', 'ovvoru', 'unna ', 'andha', 'romba', 'konjam', 'bayama', 'dhaan',
];

function isTanglish(line: string): boolean {
  const lower = line.toLowerCase();
  return TANGLISH_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

export function KineticText({ lines, isNight, onComplete, accentColor }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);
  const tappedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const baseColor = isNight ? 'rgba(255,247,240,0.95)' : '#2B2A4C';

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setRevealedCount(0);
    tappedRef.current = false;

    lines.forEach((_, i) => {
      const t = setTimeout(() => {
        setRevealedCount(prev => {
          const next = prev + 1;
          if (next >= lines.length && !tappedRef.current) {
            setTimeout(onComplete, 300);
          }
          return next;
        });
      }, 300 + i * 480);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [lines.length]);

  const handleTap = useCallback(() => {
    if (revealedCount >= lines.length) return;
    tappedRef.current = true;
    timersRef.current.forEach(clearTimeout);
    setRevealedCount(lines.length);
    setTimeout(onComplete, 200);
  }, [revealedCount, lines.length]);

  return (
    <div onClick={handleTap} className="cursor-pointer select-none">
      {lines.map((line, i) => {
        const isTL = isTanglish(line);
        const isRevealed = i < revealedCount;

        return (
          <div key={i} className="overflow-hidden mb-3 last:mb-0">
            <motion.p
              initial={{ y: '110%', opacity: 0, filter: 'blur(4px)' }}
              animate={isRevealed
                ? { y: '0%', opacity: 1, filter: 'blur(0px)' }
                : { y: '110%', opacity: 0, filter: 'blur(4px)' }
              }
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: isTL ? 'var(--font-hand)' : 'var(--font-content)',
                fontSize: isTL ? '1.05rem' : '0.93rem',
                color: isTL ? accentColor : baseColor,
                lineHeight: 1.65,
                margin: 0,
                textDecoration: isTL ? 'underline wavy currentColor 1.5px' : 'none',
                textUnderlineOffset: isTL ? '4px' : undefined,
              }}
            >
              {line}
            </motion.p>
          </div>
        );
      })}

      {revealedCount < lines.length && (
        <motion.p
          className="text-center mt-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: baseColor,
            opacity: 0.4,
            letterSpacing: '0.1em',
          }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          tap to skip →
        </motion.p>
      )}
    </div>
  );
}
