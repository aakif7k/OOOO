import { useEffect, useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Chapter } from '../../config/content';
import { ParallaxWindow } from '../Window/ParallaxWindow';
import { NextStopButton } from '../NextStop/NextStopButton';
import { KineticText } from '../KineticText/KineticText';
import { ILikeYouReveal } from '../ILikeYou/ILikeYouReveal';
import { ProposalCard } from '../Proposal/ProposalCard';
import { content } from '../../config/content';
import { useStationLock } from '../../hooks/useStationLock';
import { playChapterSong, preloadChapterSong, setOnAudioBlocked } from '../../lib/music';
import { unlock } from '../../lib/audio';

interface Props {
  chapter: Chapter;
  stationIndex: number;
  isCompleted: boolean;
  onUnlockStation: (stationIndex: number) => void;
  onNext: () => void;
  onReplay: () => void;
}

const SCENE_GRADIENTS: Record<string, string> = {
  dawn:   'linear-gradient(180deg, #FFE8C0 0%, #FFC8DD 50%, #FFF7F0 100%)',
  day:    'linear-gradient(180deg, #BDE0FE 0%, #E9DDF7 50%, #FFF7F0 100%)',
  golden: 'linear-gradient(180deg, #FFD27D 0%, #FFAFCC 50%, #FFF7F0 100%)',
  dusk:   'linear-gradient(180deg, #4a3568 0%, #2B2A4C 60%, #CDB4DB 100%)',
  starry: 'linear-gradient(180deg, #0d0a1f 0%, #2B2A4C 60%, #CDB4DB 100%)',
};

export function MetroCarriage({
  chapter,
  stationIndex,
  isCompleted,
  onUnlockStation,
  onNext,
  onReplay,
}: Props) {
  const [textDone, setTextDone] = useState(false);
  const [showILikeYou, setShowILikeYou] = useState(false);
  const [iLikeYouDone, setILikeYouDone] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const isFinalStation = stationIndex === 4;
  const isConfession = stationIndex === 3;
  const isNightScene = chapter.sceneId === 'dusk' || chapter.sceneId === 'starry';

  // 30-second station lock
  const { isLocked, remainingSeconds, progress } = useStationLock({
    stationIndex,
    duration: chapter.song?.duration ?? 30,
    isCompleted,
    onUnlock: onUnlockStation,
  });

  // Play chapter song on mount, and preload next song
  useEffect(() => {
    setOnAudioBlocked(() => setAudioBlocked(true));
    playChapterSong(chapter.song);

    const nextCh = content.chapters[stationIndex + 1];
    if (nextCh?.song?.src) {
      preloadChapterSong(nextCh.song.src);
    }
  }, [chapter.id]);

  const handleAudioHintTap = () => {
    unlock();
    setAudioBlocked(false);
    playChapterSong(chapter.song);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        if (!isFinalStation && !isLocked && (!isConfession || iLikeYouDone)) {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, isFinalStation, isLocked, isConfession, iLikeYouDone]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (deltaY > 60) {
      if (!isFinalStation && !isLocked && (!isConfession || iLikeYouDone)) {
        onNext();
      }
    }
  };

  const handleTextDone = useCallback(() => {
    setTextDone(true);
    if (isConfession) {
      setTimeout(() => setShowILikeYou(true), 600);
    }
  }, [isConfession]);

  const handleILikeYouDone = useCallback(() => {
    setILikeYouDone(true);
  }, []);

  const bgGradient = SCENE_GRADIENTS[chapter.sceneId] ?? SCENE_GRADIENTS.dawn;
  const textColor = isNightScene ? '#FFF7F0' : '#2B2A4C';
  const cardBg = isNightScene
    ? 'rgba(43,42,76,0.72)'
    : 'rgba(255,255,255,0.72)';
  const cardBorder = isNightScene
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(255,255,255,0.8)';

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: bgGradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Route display top spacer */}
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 72px)', flexShrink: 0 }} />

      {/* Parallax window */}
      <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
        <ParallaxWindow sceneId={chapter.sceneId} />
      </div>

      {/* Grab handles decoration */}
      <GrabHandlesRow isNight={isNightScene} />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pb-2 min-h-0">
        {/* Station badge + divider */}
        <div className="flex items-center gap-3 mb-2 flex-shrink-0">
          <span
            className="px-2 py-0.5 rounded-lg text-xs tracking-widest uppercase font-mono"
            style={{
              background: 'rgba(43,42,76,0.75)',
              color: chapter.taglineColor || chapter.accentColor,
              backdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            STN {chapter.stationNum}
          </span>
          <div className="h-px flex-1" style={{ background: `${chapter.taglineColor || chapter.accentColor}40` }} />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 mb-1"
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: textColor,
              fontSize: 'clamp(1.8rem, 8vw, 2.4rem)',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {chapter.titleEn}
          </h2>
          {chapter.titleTa && (
            <p
              lang="ta"
              style={{
                fontFamily: 'var(--font-tamil)',
                color: textColor,
                opacity: 0.6,
                fontSize: '0.85rem',
                marginTop: '2px',
                marginBottom: 0,
              }}
            >
              {chapter.titleTa}
            </p>
          )}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 'clamp(0.95rem, 4vw, 1.05rem)',
            fontWeight: 600,
            color: chapter.taglineColor || chapter.accentColor,
            margin: '0 0 8px',
            flexShrink: 0,
          }}
        >
          {chapter.tagline}
        </motion.p>

        {/* Glass content card */}
        <div
          className="flex-1 min-h-0 rounded-3xl overflow-hidden"
          style={{
            background: cardBg,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: cardBorder,
            boxShadow: 'var(--shadow-glass)',
            fontFamily: 'var(--font-content)',
          }}
        >
          <div
            className="h-full overflow-y-auto scrollbar-hide fade-mask-y"
            style={{ padding: '16px 20px', fontFamily: 'var(--font-content)' }}
          >
            <KineticText
              lines={chapter.quoteLines}
              isNight={isNightScene}
              onComplete={handleTextDone}
              accentColor={chapter.accentColor}
            />

            {/* Chapter 2 ending line */}
            {chapter.endingLine && textDone && (
              <motion.p
                className="mt-5"
                style={{
                  fontFamily: 'var(--font-content)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: 'clamp(1.05rem, 4.5vw, 1.3rem)',
                  color: chapter.taglineColor || chapter.accentColor,
                  lineHeight: 1.5,
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              >
                {chapter.endingLine}
              </motion.p>
            )}

            {/* Chapter 4: I LIKE YOU reveal */}
            {isConfession && showILikeYou && !iLikeYouDone && (
              <ILikeYouReveal onComplete={handleILikeYouDone} />
            )}

            {/* Chapter 4: post-confession line */}
            {isConfession && iLikeYouDone && chapter.confessionPart2 && (
              <motion.p
                className="mt-5"
                style={{
                  fontFamily: 'var(--font-content)',
                  fontSize: 'clamp(0.92rem, 4vw, 1.05rem)',
                  color: '#CDB4DB',
                  lineHeight: 1.6,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {chapter.confessionPart2}
              </motion.p>
            )}

            {/* Chapter 5: proposal */}
            {isFinalStation && textDone && (
              <ProposalCard
                proposal={content.proposal}
                names={content.names}
                onReplay={onReplay}
              />
            )}
          </div>
        </div>
      </div>

      {/* Next stop button (locked for 30s on first visit) */}
      {!isFinalStation && (
        <NextStopButton
          label={content.chapters[stationIndex + 1].titleEn}
          onClick={onNext}
          isLocked={isLocked}
          remainingSeconds={remainingSeconds}
          progress={progress}
          waitForILikeYou={isConfession && !iLikeYouDone}
        />
      )}

      {/* Floating hint if autoplay was blocked */}
      {audioBlocked && (
        <button
          onClick={handleAudioHintTap}
          className="fixed z-50 left-4 text-xs px-3 py-1.5 rounded-full bg-black/70 text-white/95 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-black/85 transition-colors"
          style={{ bottom: 'max(80px, calc(env(safe-area-inset-bottom) + 76px))' }}
        >
          <span>🎵</span>
          <span>Tap to play music</span>
        </button>
      )}
    </motion.div>
  );
}

function GrabHandlesRow({ isNight }: { isNight: boolean }) {
  const strokeColor = isNight ? 'rgba(205,180,219,0.4)' : 'rgba(43,42,76,0.3)';
  const lineColor = isNight ? 'rgba(255,255,255,0.2)' : 'rgba(43,42,76,0.2)';
  return (
    <div
      className="absolute left-0 right-0 flex justify-around px-10 pointer-events-none"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 76px)', zIndex: 5 }}
    >
      {[0, 1, 2].map(i => (
        <div key={i} className="flex flex-col items-center" style={{ animationDelay: `${i * 0.4}s` }}>
          <div style={{ width: '1px', height: '18px', background: lineColor }} />
          <svg width="16" height="14" viewBox="0 0 16 14" className="handle-sway" style={{ animationDelay: `${i * 0.4}s` }}>
            <path d="M2 1.5 Q8 -2 14 1.5 L15 12.5 Q8 17 1 12.5 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}
