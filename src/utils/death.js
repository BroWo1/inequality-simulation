import { clamp } from './random'

export const NATURAL_DEATH_START_AGE = 60
export const NATURAL_DEATH_MAX_CHANCE = 0.35

export function getStrengthQuality(strength) {
  const value = Number(strength) || 0
  return clamp(value / 10, 0, 1)
}

export function getNaturalDeathChance(age, strength) {
  const numericAge = Number(age) || 0
  if (numericAge < NATURAL_DEATH_START_AGE) return 0

  const yearsOver = numericAge - (NATURAL_DEATH_START_AGE - 1)
  const baseChance = clamp(0.01 * yearsOver, 0, NATURAL_DEATH_MAX_CHANCE)

  const strengthQuality = getStrengthQuality(strength)
  const strengthMultiplier = clamp(1 - 0.6 * strengthQuality, 0.4, 1)

  return baseChance * strengthMultiplier
}

export function rollNaturalDeath(age, strength, rng = Math.random) {
  const chance = getNaturalDeathChance(age, strength)
  if (chance <= 0) return false
  return rng() < chance
}

