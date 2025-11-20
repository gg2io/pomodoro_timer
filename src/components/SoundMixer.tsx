import { Volume2, VolumeX } from 'lucide-react'
import type { Sound } from '../hooks/useAudio'

interface SoundMixerProps {
  sounds: Sound[]
  onToggle: (id: string) => void
  onVolumeChange: (id: string, volume: number) => void
}

export function SoundMixer({ sounds, onToggle, onVolumeChange }: SoundMixerProps) {
  return (
    <div className="w-full">
      <h3
        className="text-sm font-semibold mb-3 md:mb-4 text-white"
        style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
      >
        Ambient Sounds
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
        {sounds.map((sound, index) => (
          <div
            key={sound.id}
            className={`p-2 md:p-4 rounded-xl md:rounded-2xl transition-all duration-200 ${
              index >= 4 ? 'md:py-6' : ''
            } ${
              sound.isPlaying
                ? 'bg-black/40 border border-white/30'
                : 'bg-black/20 border border-white/10 hover:bg-black/30 active:bg-black/40'
            }`}
          >
            <button
              onClick={() => onToggle(sound.id)}
              className="w-full flex items-center justify-between mb-1 md:mb-2"
            >
              <span
                className="text-xs md:text-sm text-white font-medium"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
              >
                {sound.name}
              </span>
              {sound.isPlaying ? (
                <Volume2 size={12} className="text-white/80 flex-shrink-0 ml-1 md:w-[14px] md:h-[14px]" />
              ) : (
                <VolumeX size={12} className="text-white/40 flex-shrink-0 ml-1 md:w-[14px] md:h-[14px]" />
              )}
            </button>
            {sound.isPlaying && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sound.volume}
                onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
