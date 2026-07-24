import confetti from 'canvas-confetti'

export function triggerCompletionCelebration() {
  // Fire main confetti burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
  })

  // Follow-up side cannons
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6366f1', '#10b981', '#ec4899'],
    })
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#6366f1', '#10b981', '#ec4899'],
    })
  }, 250)
}
