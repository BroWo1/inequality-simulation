import { computed } from 'vue'
import { useDataStore } from '../stores/dataStore'
import { useGameStore } from '../stores/gameStore'
import { useAI } from './useAI'
import { useEvents } from './useEvents'
import { useTalents } from './useTalents'
import { rollNaturalDeath } from '../utils/death'

export function useGame() {
  const dataStore = useDataStore()
  const gameStore = useGameStore()
  const events = useEvents()
  const talents = useTalents()
  const ai = useAI()

  const ownedTalentIds = computed(() => gameStore.selectedTalents.map((talent) => talent.id))
  const score = computed(() => gameStore.score)

  async function init() {
    await dataStore.loadData()
    gameStore.resetGame()
    talents.rollPool()
    gameStore.setState('selecting')
  }

  function commitTalents() {
    gameStore.setTalents(talents.selectedTalents.value)
    talents.applyTalentEffects(gameStore)
    gameStore.recordMaxes()
    gameStore.setState('allocating')
  }

  function finalizeAllocation() {
    gameStore.setState('running')
  }

  async function stepYear() {
    if (gameStore.state === 'finished') return null

    if (!Array.isArray(gameStore.pendingEvents) || gameStore.pendingEvents.length === 0) {
      const targetAge = gameStore.age + 1
      const ageConfig = events.getAgeConfig(targetAge)
      const baseContext = {
        stats: gameStore.stats,
        talents: ownedTalentIds.value,
        eventCounts: gameStore.eventCounts,
      }

      const fixedList = events.getFixedEvents(ageConfig, baseContext)
      const fixedIds = fixedList.map((evt) => evt.id)
      const randomEventCount = ageConfig.randomEventCount ?? 1

      const queue = [...fixedList]
      const pickedIds = [...fixedIds]

      for (let i = 0; i < randomEventCount; i++) {
        const picked = events.pickEventFromAge(ageConfig, { ...baseContext, excludeEventIds: pickedIds })
        if (picked) {
          queue.push(picked)
          pickedIds.push(picked.id)
          if (Array.isArray(picked.repels)) {
            pickedIds.push(...picked.repels)
          }
          const branch = events.pickBranch(picked, baseContext)
          if (branch) queue.push(branch)
        }
      }

      if (rollNaturalDeath(targetAge, gameStore.stats.STR)) {
        const deathEvent = dataStore.getEventById('natural-death')
        if (deathEvent) queue.push(deathEvent)
        else queue.push({ id: 'natural-death', text: 'You died.', effects: {}, death: true })
      }

      gameStore.advanceAge()
      gameStore.pendingEvents = queue
    }

    const next = gameStore.pendingEvents.shift()
    if (!next) {
      gameStore.recordMaxes()
      return null
    }

    const text = await ai.enhanceEventText(next.text)
    events.applyEvent({ ...next, text }, gameStore)
    gameStore.recordMaxes()
    return next
  }

  return {
    dataStore,
    gameStore,
    talents,
    ai,
    score,
    init,
    commitTalents,
    finalizeAllocation,
    stepYear,
  }
}
