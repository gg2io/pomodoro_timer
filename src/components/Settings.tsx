import { useState } from 'react'
import { X } from 'lucide-react'

interface SettingsProps {
  settings: {
    work: number
    shortBreak: number
    longBreak: number
    autoSequence: boolean
    bellSound: boolean
  }
  onSave: (settings: { work: number; shortBreak: number; longBreak: number; autoSequence: boolean; bellSound: boolean }) => void
  onClose: () => void
}

export function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [work, setWork] = useState(Math.floor(settings.work / 60).toString())
  const [shortBreak, setShortBreak] = useState(Math.floor(settings.shortBreak / 60).toString())
  const [longBreak, setLongBreak] = useState(Math.floor(settings.longBreak / 60).toString())
  const [autoSequence, setAutoSequence] = useState(settings.autoSequence)
  const [bellSound, setBellSound] = useState(settings.bellSound)

  const handleSave = () => {
    onSave({
      work: (parseInt(work) || 1) * 60,
      shortBreak: (parseInt(shortBreak) || 1) * 60,
      longBreak: (parseInt(longBreak) || 1) * 60,
      autoSequence,
      bellSound,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 w-full max-w-sm border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Focus Duration (min)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Short Break (min)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={shortBreak}
              onChange={(e) => setShortBreak(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Long Break (min)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={longBreak}
              onChange={(e) => setLongBreak(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="block text-sm text-white/90">
                Auto Sequence
              </label>
              <span className="text-xs text-white/50">
                4x Pomodoro → Short Break, then Long Break
              </span>
            </div>
            <button
              onClick={() => setAutoSequence(!autoSequence)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoSequence ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  autoSequence ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="block text-sm text-white/90">
                Bell Sound
              </label>
              <span className="text-xs text-white/50">
                Play sound when timer finishes
              </span>
            </div>
            <button
              onClick={() => setBellSound(!bellSound)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                bellSound ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  bellSound ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white/80 transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium text-white transition-colors border border-white/20"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
