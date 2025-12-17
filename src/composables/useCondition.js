export function useCondition() {
  function evaluate(conditions = [], context = {}) {
    if (!conditions.length) return true

    const stats = context.stats || {}
    const ownedTalents = context.talents || []
    const eventCounts = context.eventCounts || {}

    return conditions.every((condition) => {
      if (Array.isArray(condition?.talents)) {
        const missing = condition.talents.some((talent) => !ownedTalents.includes(talent))
        if (missing) return false
      }

      if (Array.isArray(condition?.events)) {
        const missingEvent = condition.events.some((eventId) => !eventCounts[eventId])
        if (missingEvent) return false
      }

      return Object.entries(condition)
        .filter(([key]) => key !== 'talents' && key !== 'events')
        .every(([key, rule]) => checkStatRule(stats[key] ?? 0, rule))
    })
  }

  function checkStatRule(value, rule) {
    if (rule == null) return true
    if (typeof rule !== 'object') return value >= rule

    if (rule.min != null && value < rule.min) return false
    if (rule.max != null && value > rule.max) return false
    return true
  }

  return { evaluate }
}
