export interface MotivationalContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  productivityScore: number
  hasCompletedAllTasks: boolean
  hasCompletedGoal: boolean
  hasMissedHabits: boolean
}

const morningQuotes = [
  "Good morning! Ready to tackle your top priorities and set the tone for a productive day?",
  "Rise and focus! Consistency is built one small daily win at a time.",
  "Morning focus session ahead. Let's make today count across LifeOS!",
  "A fresh day to build momentum. Review your tasks and start your first focus sprint.",
]

const afternoonQuotes = [
  "Afternoon energy boost! Keep your momentum strong and review your progress.",
  "Midday check-in: small steps taken continuously yield massive long-term results.",
  "Stay focused and stay steady. A 25-minute Pomodoro session will keep you on track.",
  "Keep driving forward. You've made progress today—finish your afternoon strong!",
]

const eveningQuotes = [
  "Good evening! Time to wrap up your remaining tasks and celebrate today's progress.",
  "Reflect on today's wins. Rest and recovery fuel tomorrow's productivity.",
  "Evening review: check off completed habits and prepare your workspace for tomorrow.",
  "Great effort today! Take time to recharge your mind for peak performance tomorrow.",
]

const highProductivityQuotes = [
  "🔥 Incredible momentum! Your productivity efficiency score is operating at peak performance.",
  "⚡ High performance mode unlocked! You are crushing your daily habits and focus targets.",
  "🌟 Outstanding focus! Every completed task brings your long-term goals closer to reality.",
]

const lowProductivityQuotes = [
  "💡 Progress starts with a single step. Start a quick 5-minute task or a 25-minute focus session.",
  "🌱 Don't worry about yesterday. Focus on completing just one high-priority task right now.",
  "🚀 Small actions build momentum. Open your Pomodoro timer and kickstart your focus.",
]

const allTasksCompletedQuotes = [
  "🎉 Task list cleared! You have completed every task scheduled for today. Fantastic work!",
  "🏆 Zero pending tasks for today! Enjoy your well-earned free time or plan ahead for tomorrow.",
]

let lastReturnedIndex = -1

export function getMotivationalMessage(context: MotivationalContext): string {
  let pool: string[] = []

  if (context.hasCompletedAllTasks) {
    pool = allTasksCompletedQuotes
  } else if (context.productivityScore >= 80) {
    pool = highProductivityQuotes
  } else if (context.productivityScore <= 40) {
    pool = lowProductivityQuotes
  } else {
    if (context.timeOfDay === 'morning') pool = morningQuotes
    else if (context.timeOfDay === 'afternoon') pool = afternoonQuotes
    else pool = eveningQuotes
  }

  // Select pseudo-random index avoiding immediate repetition
  let index = Math.floor(Math.random() * pool.length)
  if (pool.length > 1 && index === lastReturnedIndex) {
    index = (index + 1) % pool.length
  }
  lastReturnedIndex = index

  return pool[index]
}
