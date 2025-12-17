import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const DATA_SOURCES = {
  events: '/data/events.json',
  talents: '/data/talents.json',
  ages: '/data/ages.json',
}

async function fetchJson(path) {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`)
  }
  return res.json()
}

export const useDataStore = defineStore('data', () => {
  const events = ref([])
  const talents = ref([])
  const ages = ref({})

  const loading = ref(false)
  const loaded = ref(false)
  const error = ref(null)

  const ageBuckets = computed(() => new Map(Object.entries(ages.value)))

  async function loadData() {
    if (loaded.value || loading.value) return
    loading.value = true
    error.value = null

    try {
      const [eventsJson, talentsJson, agesJson] = await Promise.all([
        fetchJson(DATA_SOURCES.events),
        fetchJson(DATA_SOURCES.talents),
        fetchJson(DATA_SOURCES.ages),
      ])
      events.value = eventsJson || []
      talents.value = talentsJson || []
      ages.value = agesJson || {}
      loaded.value = true
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  function getEventById(id) {
    return events.value.find((evt) => evt.id === id)
  }

  function getTalentById(id) {
    return talents.value.find((talent) => talent.id === id)
  }

  function getAgeConfig(age) {
    const key = String(age)
    const row = ages.value[key]

    if (!row) return { fixedEvents: [], randomEvents: [], talent: [] }

    // Backward compatibility: plain array means random events bucket
    if (Array.isArray(row)) {
      return { fixedEvents: [], randomEvents: row, talent: [] }
    }

    const fixedEvents = Array.isArray(row.fixedEvents) ? row.fixedEvents : []
    let randomEvents = row.randomEvents

    if (!randomEvents) {
      if (Array.isArray(row.event)) randomEvents = row.event
      else if (row.event != null) randomEvents = [row.event]
    }

    return {
      ...row,
      fixedEvents,
      randomEvents: Array.isArray(randomEvents) ? randomEvents : [],
    }
  }

  return {
    events,
    talents,
    ages,
    ageBuckets,
    loading,
    loaded,
    error,
    loadData,
    getEventById,
    getTalentById,
    getAgeConfig,
  }
})
