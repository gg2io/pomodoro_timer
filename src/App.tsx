import { useState, useEffect, useMemo } from 'react'
import { useTimer } from './hooks/useTimer'
import { useAudio } from './hooks/useAudio'
import { Timer } from './components/Timer'
import { Controls } from './components/Controls'
import { ModeSelector } from './components/ModeSelector'
import { SoundMixer } from './components/SoundMixer'
import { Settings } from './components/Settings'

// Theme configurations for each ambient sound
const SOUND_THEMES = {
  rain: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)',
    accent: 'rgba(45, 90, 135, 0.3)',
    overlay: 'rgba(30, 58, 95, 0.6)',
    backgroundImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80',
  },
  fire: {
    gradient: 'linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #8b4513 100%)',
    accent: 'rgba(210, 105, 30, 0.3)',
    overlay: 'rgba(139, 69, 19, 0.5)',
    backgroundImage: 'https://images.unsplash.com/photo-1543393470-b2c833b98dce?w=1920&q=80',
  },
  cafe: {
    gradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 50%, #3e2723 100%)',
    accent: 'rgba(93, 64, 55, 0.3)',
    overlay: 'rgba(62, 39, 35, 0.6)',
    backgroundImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1920&q=80',
  },
  wind: {
    gradient: 'linear-gradient(135deg, #78909c 0%, #b0bec5 50%, #78909c 100%)',
    accent: 'rgba(176, 190, 197, 0.3)',
    overlay: 'rgba(120, 144, 156, 0.5)',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  },
  waves: {
    gradient: 'linear-gradient(135deg, #006064 0%, #00838f 50%, #006064 100%)',
    accent: 'rgba(0, 131, 143, 0.3)',
    overlay: 'rgba(0, 96, 100, 0.5)',
    backgroundImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
  },
  forest: {
    gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)',
    accent: 'rgba(46, 125, 50, 0.3)',
    overlay: 'rgba(27, 94, 32, 0.5)',
    backgroundImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  },
} as const

// Default off-grey theme
const DEFAULT_THEME = {
  gradient: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 50%, #2d2d2d 100%)',
  accent: 'rgba(61, 61, 61, 0.3)',
  overlay: 'rgba(45, 45, 45, 0.4)',
  backgroundImage: '',
}

function App() {
  const {
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    start,
    pause,
    reset,
    setMode,
    settings,
    updateSettings,
  } = useTimer()

  const { sounds, toggleSound, setVolume } = useAudio()
  const [showSettings, setShowSettings] = useState(false)

  // Calculate current theme based on active sounds
  const currentTheme = useMemo(() => {
    const activeSounds = sounds.filter(s => s.isPlaying)

    if (activeSounds.length === 0) {
      return DEFAULT_THEME
    }

    // Use the first active sound's theme (could be enhanced to blend multiple)
    const primarySound = activeSounds[0]
    return SOUND_THEMES[primarySound.id as keyof typeof SOUND_THEMES] || DEFAULT_THEME
  }, [sounds])

  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    document.title = `${timeString} - Pomodoro Timer`
  }, [timeLeft])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      if (e.code === 'Space') {
        e.preventDefault()
        if (isRunning) {
          pause()
        } else {
          start()
        }
      } else if (e.code === 'KeyR') {
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, start, pause, reset])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{
        background: currentTheme.gradient,
        transition: 'background 0.8s ease-in-out',
      }}
    >
      {/* Background Image */}
      {currentTheme.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
          style={{
            backgroundImage: `url(${currentTheme.backgroundImage})`,
          }}
        />
      )}

      {/* Light Overlay for readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          transition: 'background-color 0.8s ease-in-out',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer timeLeft={timeLeft} mode={mode} />
        </div>

        {/* Controls */}
        <div className="mb-4">
          <Controls
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSettings={() => setShowSettings(true)}
            isFinished={timeLeft === 0}
          />
        </div>

        {/* Completed Pomodoros */}
        <div className="text-center">
          <span
            className="text-white/80 text-base font-medium"
            style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
          >
            {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''} completed
          </span>
        </div>
      </div>

      {/* Sound Mixer - Bottom */}
      <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 z-10 w-auto md:w-80">
        <SoundMixer
          sounds={sounds}
          onToggle={toggleSound}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Keyboard shortcuts hint - hidden on mobile */}
      <div className="hidden md:block absolute bottom-6 right-6 z-10 text-xs text-white/40">
        <span className="px-2 py-1 bg-black/20 rounded">Space</span> start/pause
        <span className="mx-2">·</span>
        <span className="px-2 py-1 bg-black/20 rounded">R</span> reset
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
