import { computed, ref } from 'vue'
import { useDataStore } from '../stores/dataStore'
import { MAX_SELECTED_TALENTS, TALENT_POOL_SIZE } from '../utils/constants'
import { weightedPick } from '../utils/random'

const GRADE_WEIGHTS = {
  0: 1,
  1: 0.45,
  2: 0.12,
  3: 0.02,
}

const pool = ref([])
const selectedIds = ref([])
const selectedTalents = computed(() =>
  selectedIds.value
    .map((id) => pool.value.find((talent) => talent.id === id))
    .filter(Boolean),
)

export function useTalents() {
  const dataStore = useDataStore()

  function rollPool(count = TALENT_POOL_SIZE) {
    const working = [...dataStore.talents]
    const results = []

    while (results.length < count && working.length) {
      const pick = weightedPick(
        working.map((talent) => {
          const overrideWeight = Number(talent.rollWeight)
          return {
            ...talent,
            weight:
              Number.isFinite(overrideWeight) && overrideWeight > 0
                ? overrideWeight
                : (GRADE_WEIGHTS[talent.grade] ?? 1),
          }
        }),
      )
      if (!pick) break
      results.push(pick)
      const removeIndex = working.findIndex((talent) => talent.id === pick.id)
      if (removeIndex >= 0) working.splice(removeIndex, 1)
    }

    pool.value = results
    selectedIds.value = []
  }

  function toggleTalent(id) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((item) => item !== id)
      return
    }

    if (selectedIds.value.length >= MAX_SELECTED_TALENTS) return
    const target = pool.value.find((talent) => talent.id === id)
    if (!target) return

    const conflict =
      target.exclusions?.some((other) => selectedIds.value.includes(other)) ||
      selectedTalents.value.some((talent) => talent.exclusions?.includes(target.id))

    if (conflict) return

    selectedIds.value.push(id)
  }

  function isSelected(id) {
    return selectedIds.value.includes(id)
  }

  function applyTalentEffects(gameStore) {
    selectedTalents.value.forEach((talent) => {
      gameStore.applyEffects(talent.effects)
      const bonus = Number(talent.startingPointsBonus) || 0
      if (bonus > 0) gameStore.availablePoints += bonus
    })
  }

  return { pool, selectedIds, selectedTalents, rollPool, toggleTalent, isSelected, applyTalentEffects }
}
