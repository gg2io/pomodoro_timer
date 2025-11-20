import { useState, useRef, useEffect, useCallback } from 'react'

export interface Sound {
  id: string
  name: string
  volume: number
  isPlaying: boolean
}

interface UseAudioReturn {
  sounds: Sound[]
  toggleSound: (id: string) => void
  setVolume: (id: string, volume: number) => void
  stopAll: () => void
}

// Google's Action Sound Library URLs
const SOUND_URLS: Record<string, string> = {
  rain: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg',
  fire: 'https://actions.google.com/sounds/v1/ambiences/fire.ogg',
  cafe: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
  wind: 'https://actions.google.com/sounds/v1/weather/strong_wind.ogg',
  waves: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  forest: 'https://actions.google.com/sounds/v1/ambiences/spring_day_forest.ogg',
}

const DEFAULT_SOUNDS: Omit<Sound, 'volume' | 'isPlaying'>[] = [
  { id: 'rain', name: 'Rain' },
  { id: 'fire', name: 'Fireplace' },
  { id: 'cafe', name: 'Cafe' },
  { id: 'wind', name: 'Wind' },
  { id: 'waves', name: 'Ocean Waves' },
  { id: 'forest', name: 'Forest' },
]

export function useAudio(): UseAudioReturn {
  const [sounds, setSounds] = useState<Sound[]>(() =>
    DEFAULT_SOUNDS.map(s => ({ ...s, volume: 0.5, isPlaying: false }))
  )

  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  // Initialize audio elements
  useEffect(() => {
    DEFAULT_SOUNDS.forEach(sound => {
      const audio = new Audio(SOUND_URLS[sound.id])
      audio.loop = true
      audio.volume = 0.5
      audio.preload = 'auto'
      audioElementsRef.current.set(sound.id, audio)
    })

    return () => {
      // Cleanup
      audioElementsRef.current.forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      audioElementsRef.current.clear()
    }
  }, [])

  const toggleSound = useCallback((id: string) => {
    const audio = audioElementsRef.current.get(id)
    if (!audio) return

    // Check current state to determine action
    const currentSound = sounds.find(s => s.id === id)
    const isStarting = currentSound && !currentSound.isPlaying

    // If starting a new sound, stop ALL other sounds first
    if (isStarting) {
      audioElementsRef.current.forEach((otherAudio, otherId) => {
        if (otherId !== id) {
          otherAudio.pause()
          otherAudio.currentTime = 0
        }
      })
    }

    // Now update the clicked sound
    if (currentSound?.isPlaying) {
      // Stop the sound
      audio.pause()
      audio.currentTime = 0
    } else {
      // Start the sound
      audio.play().catch(err => console.warn('Audio play failed:', err))
    }

    // Update state
    setSounds(prev => prev.map(sound => {
      if (sound.id === id) {
        return { ...sound, isPlaying: !sound.isPlaying }
      }
      // Stop other sounds when starting a new one
      if (isStarting) {
        return { ...sound, isPlaying: false }
      }
      return sound
    }))
  }, [sounds])

  const setVolume = useCallback((id: string, volume: number) => {
    const audio = audioElementsRef.current.get(id)
    if (audio) {
      audio.volume = volume
    }

    setSounds(prev => prev.map(sound =>
      sound.id === id ? { ...sound, volume } : sound
    ))
  }, [])

  const stopAll = useCallback(() => {
    audioElementsRef.current.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })

    setSounds(prev => prev.map(sound => ({ ...sound, isPlaying: false })))
  }, [])

  return {
    sounds,
    toggleSound,
    setVolume,
    stopAll,
  }
}
