import { useEffect, useState, useRef } from 'react';
import { playChime } from '../lib/audio';

interface UseStationLockOptions {
  stationIndex: number;
  duration?: number;
  isCompleted: boolean;
  onUnlock?: (stationIndex: number) => void;
}

export function useStationLock({
  stationIndex,
  duration = 30,
  isCompleted,
  onUnlock,
}: UseStationLockOptions) {
  const [timeLeft, setTimeLeft] = useState<number>(() => (isCompleted ? 0 : duration));
  const unlockedTriggeredRef = useRef(isCompleted);
  const lastTickRef = useRef<number>(Date.now());
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  useEffect(() => {
    if (isCompleted) {
      setTimeLeft(0);
      unlockedTriggeredRef.current = true;
      return;
    }

    setTimeLeft(duration);
    unlockedTriggeredRef.current = false;
    lastTickRef.current = Date.now();

    const handleVisibility = () => {
      // Reset last tick on tab hide/show so hidden duration is not subtracted
      lastTickRef.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const interval = setInterval(() => {
      if (document.hidden) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setTimeLeft(prev => {
        const next = Math.max(0, prev - deltaSec);
        if (next <= 0 && !unlockedTriggeredRef.current) {
          unlockedTriggeredRef.current = true;
          // Soft chime on unlock
          playChime();
          // Haptic buzz on unlock
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([40, 50, 60]);
            } catch (e) {}
          }
          if (onUnlockRef.current) {
            onUnlockRef.current(stationIndex);
          }
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [stationIndex, duration, isCompleted]);

  const isLocked = !isCompleted && timeLeft > 0;
  const remainingSeconds = Math.ceil(timeLeft);
  const progress = duration > 0 ? Math.min(1, Math.max(0, 1 - timeLeft / duration)) : 1;

  return {
    isLocked,
    remainingSeconds,
    progress,
    totalDuration: duration,
  };
}

