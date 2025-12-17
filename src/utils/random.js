export function weightedPick(candidates = []) {
  const totalWeight = candidates.reduce((sum, item) => sum + (item.weight || 0), 0)
  if (totalWeight <= 0) return candidates[0] || null

  let roll = Math.random() * totalWeight
  for (const item of candidates) {
    roll -= item.weight || 0
    if (roll <= 0) return item
  }
  return candidates[candidates.length - 1] || null
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
