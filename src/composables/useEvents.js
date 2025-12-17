import { useDataStore } from '../stores/dataStore'
import { weightedPick } from '../utils/random'
import { useCondition } from './useCondition'

export function useEvents() {
  const dataStore = useDataStore()
  const { evaluate } = useCondition()

  function getMaxOccurrences(event) {
    const maxFromJson = Number(event?.maxOccurrences)
    if (Number.isFinite(maxFromJson) && maxFromJson > 0) return maxFromJson
    if (event?.repeatable) return Infinity
    return 1
  }

  function isEventAvailable(event, context = {}) {
    if (!event?.id) return false

    const excludeIds = context.excludeEventIds
    if (Array.isArray(excludeIds) && excludeIds.includes(event.id)) return false

    const counts = context.eventCounts && typeof context.eventCounts === 'object' ? context.eventCounts : {}
    const occurred = Number(counts[event.id]) || 0
    const limit = getMaxOccurrences(event)
    return occurred < limit
  }

  function normalizeRef(ref) {
    if (ref == null) return null
    if (typeof ref === 'string' || typeof ref === 'number') return { id: ref }
    if (typeof ref === 'object' && ref.id)
      return {
        id: ref.id,
        weight: ref.weight,
        priority: ref.priority,
        repeatable: ref.repeatable,
        maxOccurrences: ref.maxOccurrences,
      }
    return null
  }

  function getAgeConfig(age) {
    const base = dataStore.getAgeConfig(age)
    const randomDisabled = Boolean(base.randomDisabled)
    const randomOverride = Boolean(base.randomEventsOverride)
    const derivedRandom = randomDisabled || randomOverride ? [] : getScheduleRefsForAge(age)
    const legacyRandom = randomDisabled ? [] : Array.isArray(base.randomEvents) ? base.randomEvents : []

    const merged = []
    const seenIds = new Set()

    for (const ref of derivedRandom) {
      const key = String(ref.id)
      if (seenIds.has(key)) continue
      seenIds.add(key)
      merged.push(ref)
    }

    for (const rawRef of legacyRandom) {
      const ref = normalizeRef(rawRef)
      if (!ref) continue
      const key = String(ref.id)
      if (seenIds.has(key)) continue
      seenIds.add(key)
      merged.push(ref)
    }

    return { ...base, randomEvents: merged }
  }

  function getScheduleRefsForAge(age) {
    const numAge = Number(age)
    if (!Number.isFinite(numAge)) return []

    const eventsRaw = dataStore.events?.value ?? dataStore.events
    if (!Array.isArray(eventsRaw)) return []

    const refs = []

    for (const event of eventsRaw) {
      if (!event?.id) continue

      if (Array.isArray(event.schedule)) {
        for (const entry of event.schedule) {
          const entryAge = Number(entry?.age)
          if (!Number.isFinite(entryAge) || entryAge !== numAge) continue
          refs.push({
            id: event.id,
            weight: entry.weight ?? event.weight ?? 1,
            repeatable: entry.repeatable,
            maxOccurrences: entry.maxOccurrences,
          })
        }
        continue
      }

      if (Array.isArray(event.ages)) {
        for (const legacyAge of event.ages) {
          if (Number(legacyAge) === numAge) {
            refs.push({
              id: event.id,
              weight: event.weight ?? 1,
              repeatable: event.repeatable,
              maxOccurrences: event.maxOccurrences,
            })
            break
          }
        }
        continue
      }

      const legacyAge = Number(event.age)
      if (Number.isFinite(legacyAge) && legacyAge === numAge) {
        refs.push({
          id: event.id,
          weight: event.weight ?? 1,
          repeatable: event.repeatable,
          maxOccurrences: event.maxOccurrences,
        })
      }
    }

    return refs
  }

  function getFixedEvents(ageConfig, context = {}) {
    const normalized = (ageConfig.fixedEvents || []).map(normalizeRef).filter(Boolean)
    return normalized
      .map((ref) => {
        const event = dataStore.getEventById(ref.id)
        if (!event) return null
        if (ref.repeatable != null || ref.maxOccurrences != null) {
          return { ...event, repeatable: ref.repeatable, maxOccurrences: ref.maxOccurrences }
        }
        return event
      })
      .filter(Boolean)
      .filter((event) => evaluate(event.conditions || [], context))
      .filter((event) => isEventAvailable(event, context))
  }

  function getRandomCandidates(ageConfig, context = {}) {
    const normalized = (ageConfig.randomEvents || []).map(normalizeRef).filter(Boolean)
    return normalized
      .map((ref) => {
        const event = dataStore.getEventById(ref.id)
        if (!event) return null
        const merged =
          ref.repeatable != null || ref.maxOccurrences != null
            ? { ...event, repeatable: ref.repeatable, maxOccurrences: ref.maxOccurrences }
            : event
        return {
          ...merged,
          weight: ref.weight ?? merged.weight ?? 1,
          priority: ref.priority ?? merged.priority ?? 0,
        }
      })
      .filter(Boolean)
      .filter((event) => evaluate(event.conditions || [], context))
      .filter((event) => isEventAvailable(event, context))
  }

  function pickEventFromAge(ageConfig, context = {}) {
    const candidates = getRandomCandidates(ageConfig, context)
    const maxPriority = candidates.reduce((max, item) => Math.max(max, Number(item.priority) || 0), 0)
    if (maxPriority > 0) {
      return weightedPick(candidates.filter((item) => (Number(item.priority) || 0) === maxPriority))
    }
    return weightedPick(candidates)
  }

  function pickBranch(event, context = {}) {
    if (!event?.branches?.length) return null

    const branchCandidates = event.branches
      .map((branch) => {
        const candidate = dataStore.getEventById(branch.id)
        if (!candidate) return null
        return { ...candidate, weight: branch.weight ?? candidate.weight ?? 1 }
      })
      .filter(Boolean)
      .filter((candidate) => evaluate(candidate.conditions || [], context))
      .filter((candidate) => isEventAvailable(candidate, context))

    return weightedPick(branchCandidates)
  }

  function applyEvent(event, gameStore) {
    if (!event || !gameStore) return null
    gameStore.recordEventOccurrence(event.id)
    gameStore.applyEffects(event.effects)
    gameStore.addLogEntry({
      id: event.id,
      age: gameStore.age,
      text: event.text,
      effects: event.effects,
    })
    if (event.death) {
      gameStore.endRun({ type: 'event', eventId: event.id, text: event.text })
    }
    return event
  }

  return {
    getAgeConfig,
    getFixedEvents,
    getRandomCandidates,
    pickEventFromAge,
    pickBranch,
    applyEvent,
  }
}
