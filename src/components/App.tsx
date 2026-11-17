import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import { content } from '../config/content';
import { IntroScreen } from './Intro/IntroScreen';
import { MetroCarriage } from './Carriage/MetroCarriage';
import { TravelSequence } from './Travel/TravelSequence';
import { RouteDisplay } from './RouteDisplay/RouteDisplay';
import { AudioToggle } from './AudioToggle';
import { unlock, setEnabled } from '../lib/audio';
import { fadeOutActiveSong, stopAllMusic } from '../lib/music';

type AppState = 'intro' | 'station' | 'traveling';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [currentStation, setCurrentStation] = useState(0);
  const [travelTarget, setTravelTarget] = useState(1);
  const [audioOn, setAudioOn] = useState(false);
  const [completedStations, setCompletedStations] = useState<Set<number>>(() => new Set());
  const travelLock = useRef(false);

  const handleUnlockStation = useCallback((idx: number) => {
    setCompletedStations(prev => new Set(prev).add(idx));
  }, []);

  const handleBoard = useCallback(() => {
    unlock();
    setAudioOn(true);
    setEnabled(true);
    setAppState('station');
    setCurrentStation(0);
  }, []);

  const handleNextStation = useCallback(() => {
    if (travelLock.current || currentStation >= 4) return;
    travelLock.current = true;
    fadeOutActiveSong(1.5);
    setCompletedStations(prev => new Set(prev).add(currentStation));
    const target = currentStation + 1;
    setTravelTarget(target);
    setAppState('traveling');
  }, [currentStation]);

  const handleTravelComplete = useCallback(() => {
    setCurrentStation(travelTarget);
    setAppState('station');
    travelLock.current = false;
  }, [travelTarget]);

  const handleJumpBack = useCallback((idx: number) => {
    if (idx >= currentStation || travelLock.current) return;
    travelLock.current = true;
    fadeOutActiveSong(1.5);
    setTravelTarget(idx);
    setAppState('traveling');
  }, [currentStation]);

  const toggleAudio = useCallback(() => {
    unlock();
    const next = !audioOn;
    setAudioOn(next);
    setEnabled(next);
  }, [audioOn]);

  const handleReplay = useCallback(() => {
    stopAllMusic();
    setCompletedStations(new Set());
    setCurrentStation(0);
    setAppState('intro');
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: '100dvh',
        maxWidth: '480px',
        margin: '0 auto',
        background: 'var(--color-cream)',
      }}
    >
      {/* Soft desktop backdrop (outside the mobile frame) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: 'radial-gradient(ellipse at 50% 40%, #E9DDF7 0%, #FFC8DD 40%, #FFF7F0 80%)',
          display: 'none',
        }}
        className="sm:block"
      />

      <AnimatePresence mode="wait">
        {appState === 'intro' && (
          <IntroScreen key="intro" onBoard={handleBoard} />
        )}
        {appState === 'traveling' && (
          <TravelSequence
            key={`travel-${travelTarget}`}
            toTitle={content.chapters[travelTarget].titleEn}
            onComplete={handleTravelComplete}
          />
        )}
        {appState === 'station' && (
          <MetroCarriage
            key={`station-${currentStation}`}
            chapter={content.chapters[currentStation]}
            stationIndex={currentStation}
            isCompleted={completedStations.has(currentStation)}
            onUnlockStation={handleUnlockStation}
            onNext={handleNextStation}
            onReplay={handleReplay}
          />
        )}
      </AnimatePresence>

      {(appState === 'station' || appState === 'traveling') && (
        <RouteDisplay
          currentStation={currentStation}
          targetStation={appState === 'traveling' ? travelTarget : currentStation}
          isTraveling={appState === 'traveling'}
          chapters={content.chapters}
          onJumpBack={handleJumpBack}
        />
      )}

      {appState !== 'intro' && (
        <AudioToggle on={audioOn} onToggle={toggleAudio} />
      )}
    </div>
  );
}
