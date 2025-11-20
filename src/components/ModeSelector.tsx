import type { TimerMode } from '../hooks/useTimer'

interface ModeSelectorProps {
  mode: TimerMode
  onModeChange: (mode: TimerMode) => void
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const modes: { value: TimerMode; label: string }[] = [
    { value: 'work', label: 'Pomodoro' },
    { value: 'shortBreak', label: 'Short Break' },
    { value: 'longBreak', label: 'Long Break' },
  ]

  return (
    <div className="flex gap-1 md:gap-2 bg-black/20 p-1 rounded-full">
      {modes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          className={`px-3 md:px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-200 ${
            mode === value
              ? 'bg-white/30 text-white shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20'
          }`}
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
