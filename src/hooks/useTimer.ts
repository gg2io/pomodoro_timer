import { useState, useEffect, useCallback, useRef } from 'react'

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface TimerSettings {
  work: number
  shortBreak: number
  longBreak: number
  autoSequence: boolean
  bellSound: boolean
}

interface UseTimerReturn {
  timeLeft: number
  isRunning: boolean
  mode: TimerMode
  completedPomodoros: number
  start: () => void
  pause: () => void
  reset: () => void
  setMode: (mode: TimerMode) => void
  settings: TimerSettings
  updateSettings: (newSettings: TimerSettings) => void
}

const DEFAULT_SETTINGS: TimerSettings = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  autoSequence: true,
  bellSound: true,
}

// Play a bell sound using Web Audio API
async function playBellSound() {
  try {
    const audioContext = new AudioContext()

    // Resume if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    // Create a pleasant bell-like sound
    const playTone = (frequency: number, startTime: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      // Bell-like envelope
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.6, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.8)
    }

    // Play 3 ascending tones
    const now = audioContext.currentTime
    playTone(523, now)        // C5
    playTone(659, now + 0.3)  // E5
    playTone(784, now + 0.6)  // G5

  } catch (error) {
    console.warn('Could not play bell sound:', error)
  }
}

export function useTimer(): UseTimerReturn {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('pomodoroSettings')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  const [mode, setModeState] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(settings.work)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const saved = localStorage.getItem('completedPomodoros')
    return saved ? parseInt(saved, 10) : 0
  })

  const intervalRef = useRef<number | null>(null)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('completedPomodoros', completedPomodoros.toString())
  }, [completedPomodoros])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Play bell sound if enabled
      if (settings.bellSound) {
        playBellSound()
      }

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: mode === 'work'
            ? 'Work session complete! Take a break.'
            : 'Break is over! Time to focus.',
          icon: '/favicon.ico'
        })
      }

      // Count pomodoros when work session completes
      if (mode === 'work') {
        setCompletedPomodoros((prev) => prev + 1)
      }

      // Auto-switch modes if enabled
      if (settings.autoSequence) {
        if (mode === 'work') {
          const newCount = completedPomodoros + 1
          if (newCount % 4 === 0) {
            setModeState('longBreak')
            setTimeLeft(settings.longBreak)
          } else {
            setModeState('shortBreak')
            setTimeLeft(settings.shortBreak)
          }
        } else {
          setModeState('work')
          setTimeLeft(settings.work)
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, mode, settings, completedPomodoros])

  const start = useCallback(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(settings[mode])
    hasCompletedRef.current = false
  }, [settings, mode])

  const setMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    setModeState(newMode)
    setTimeLeft(settings[newMode])
    hasCompletedRef.current = false
  }, [settings])

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings)
    if (!isRunning) {
      setTimeLeft(newSettings[mode])
    }
  }, [isRunning, mode])

  return {
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
  }
}
