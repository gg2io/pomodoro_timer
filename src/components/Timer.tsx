interface TimerProps {
  timeLeft: number
  mode: 'work' | 'shortBreak' | 'longBreak'
}

export function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col items-center">
      <div
        className="text-7xl sm:text-8xl md:text-9xl font-semibold text-white tracking-tight"
        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}
      >
        {String(minutes).padStart(2, '0')}
        <span className="animate-pulse">:</span>
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  )
}
