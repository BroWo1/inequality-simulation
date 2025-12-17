import { STAT_KEYS } from './constants'

export function calculateScore(stats, age = 0) {
  const safeAge = Number.isFinite(age) ? age : 0
  const total = STAT_KEYS.reduce((sum, key) => sum + (Number(stats?.[key]) || 0), 0)
  return total * 2 + Math.max(safeAge, 0) / 2
}

export function getJudgmentTitle(score) {
  if (score >= 140) return 'Godlike'
  if (score >= 110) return 'Excellent'
  if (score >= 80) return 'Pretty Good'
  return 'Average'
}
