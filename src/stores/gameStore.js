import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { DEFAULT_SETTINGS, INITIAL_POINTS, MAX_POINTS_PER_STAT, STAT_KEYS } from '../utils/constants'
import { clamp } from '../utils/random'
import { calculateScore } from '../utils/score'

const createStatObject = (value = 0) => Object.fromEntries(STAT_KEYS.map((key) => [key, value]))
const createInitialStats = () => ({
  ...createStatObject(0),
  SPR: 5,
})

export const useGameStore = defineStore('game', () => {
  const age = ref(0)
  const stats = reactive(createInitialStats())
  const maxStats = reactive(createInitialStats())
  const selectedTalents = ref([])
  const log = ref([])
  const eventCounts = ref({})
  const pendingEvents = ref([])
  const death = ref(null)
  const availablePoints = ref(INITIAL_POINTS)
  const state = ref('idle') // idle | selecting | allocating | running | finished
  const settings = reactive({ ...DEFAULT_SETTINGS })

  const score = computed(() => calculateScore(stats, age.value))

  function resetGame() {
    age.value = 0
    Object.assign(stats, createInitialStats())
    Object.assign(maxStats, createInitialStats())
    selectedTalents.value = []
    availablePoints.value = INITIAL_POINTS
    log.value = []
    eventCounts.value = {}
    pendingEvents.value = []
    death.value = null
    state.value = 'idle'
  }

  function setTalents(talents) {
    selectedTalents.value = talents
  }

  function setState(nextState) {
    state.value = nextState
  }

  function endRun(payload = {}) {
    const cause = payload && typeof payload === 'object' ? payload : {}
    death.value = {
      age: age.value,
      eventId: cause.eventId ?? null,
      text: cause.text ?? null,
      type: cause.type ?? null,
      timestamp: Date.now(),
    }
    pendingEvents.value = []
    settings.autoplay = false
    state.value = 'finished'
  }

  function allocate(statKey, delta) {
    if (!STAT_KEYS.includes(statKey)) return
    if (statKey === 'SPR') return
    const nextValue = clamp(stats[statKey] + delta, 0, MAX_POINTS_PER_STAT)
    const diff = nextValue - stats[statKey]

    if (diff > 0 && availablePoints.value - diff < 0) return

    stats[statKey] = nextValue
    availablePoints.value -= diff
    recordMaxes()
  }

  function applyEffects(effects = {}) {
    for (const key of STAT_KEYS) {
      const delta = Number(effects[key]) || 0
      if (key === 'SPR' && delta > 0) continue
      stats[key] = clamp(stats[key] + delta, -20, 999)
    }
    recordMaxes()
  }

  function recordMaxes() {
    STAT_KEYS.forEach((key) => {
      maxStats[key] = Math.max(maxStats[key], stats[key])
    })
  }

  function addLogEntry(entry) {
    const timestamp = Date.now()
    log.value.unshift({ ...entry, timestamp })
  }

  function recordEventOccurrence(eventId) {
    if (!eventId) return
    const counts = eventCounts.value
    counts[eventId] = (counts[eventId] || 0) + 1
  }

  function getEventCount(eventId) {
    return Number(eventCounts.value[eventId]) || 0
  }

  function advanceAge(step = 1) {
    age.value += step
  }

  function setAge(nextAge) {
    age.value = nextAge
  }

  return {
    age,
    stats,
    maxStats,
    selectedTalents,
    log,
    eventCounts,
    pendingEvents,
    death,
    availablePoints,
    state,
    settings,
    score,
    resetGame,
    setTalents,
    setState,
    endRun,
    allocate,
    applyEffects,
    recordMaxes,
    addLogEntry,
    recordEventOccurrence,
    getEventCount,
    advanceAge,
    setAge,
  }
})
