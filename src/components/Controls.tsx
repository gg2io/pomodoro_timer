import { useState } from 'react'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface ControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSettings: () => void
  isFinished: boolean
}

export function Controls({ isRunning, onStart, onPause, onReset, onSettings, isFinished }: ControlsProps) {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleReset = () => {
    setIsSpinning(true)
    onReset()
    setTimeout(() => setIsSpinning(false), 500)
  }
  return (
    <div className="flex items-center gap-3 md:gap-4">
      {isRunning ? (
        <button
          onClick={onPause}
          className="flex items-center justify-center w-16 h-16 md:w-14 md:h-14 bg-black/30 hover:bg-black/40 active:bg-black/50 text-white rounded-full transition-all duration-200 border border-white/20 shadow-lg"
        >
          <Pause size={28} className="md:w-6 md:h-6" />
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={isFinished}
          className={`flex items-center justify-center w-16 h-16 md:w-14 md:h-14 rounded-full transition-all duration-200 border border-white/20 shadow-lg ${
            isFinished
              ? 'bg-black/10 text-white/30 cursor-not-allowed'
              : 'bg-black/30 hover:bg-black/40 active:bg-black/50 text-white'
          }`}
        >
          <Play size={28} className="ml-1 md:w-6 md:h-6" />
        </button>
      )}
      <button
        onClick={handleReset}
        className="flex items-center justify-center w-12 h-12 md:w-10 md:h-10 bg-black/20 hover:bg-black/30 active:bg-black/40 text-white/70 hover:text-white rounded-full transition-all duration-200 border border-white/10"
      >
        <RotateCcw size={20} className={`md:w-[18px] md:h-[18px] ${isSpinning ? 'animate-spin-reverse' : ''}`} />
      </button>
      <button
        onClick={onSettings}
        className="flex items-center justify-center w-12 h-12 md:w-10 md:h-10 bg-black/20 hover:bg-black/30 active:bg-black/40 text-white/70 hover:text-white rounded-full transition-all duration-200 border border-white/10"
      >
        <Settings size={20} className="md:w-[18px] md:h-[18px]" />
      </button>
    </div>
  )
}
