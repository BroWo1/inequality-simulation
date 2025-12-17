<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TalentCard from '../components/game/TalentCard.vue'
import { useGame } from '../composables/useGame'
import { MAX_SELECTED_TALENTS, TALENT_POOL_SIZE } from '../utils/constants'

const router = useRouter()
const { dataStore, talents, commitTalents, gameStore } = useGame()

const selectedCount = computed(() => talents.selectedTalents.value.length)
const talentPool = computed(() => {
  const raw = talents.pool?.value ?? talents.pool
  return Array.isArray(raw) ? raw.filter((item) => item && typeof item === 'object') : []
})

onMounted(async () => {
  if (!dataStore.loaded) await dataStore.loadData()
  if (!talents.pool.value.length) talents.rollPool()
  gameStore.setState('selecting')
})

function lockTalents() {
  if (selectedCount.value !== MAX_SELECTED_TALENTS) return
  commitTalents()
  router.push('/allocate')
}
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2 text-center">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-600">Step 1</p>
      <h2 class="font-display text-2xl font-semibold text-slate-900">Choose Talents</h2>
      <p class="text-sm text-slate-600">
        Pick {{ MAX_SELECTED_TALENTS }} out of {{ TALENT_POOL_SIZE }} random talents. Click to toggle selection.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
        <span class="rarity-chip border-slate-200 bg-white text-slate-700 shadow-sm">
          Selected {{ selectedCount }} / {{ MAX_SELECTED_TALENTS }}
        </span>
        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          :disabled="selectedCount !== MAX_SELECTED_TALENTS"
          type="button"
          @click="lockTalents"
        >
          Confirm
        </button>
      </div>
    </header>

    <div v-if="!dataStore.loaded" class="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
      Loading…
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <TalentCard
        v-for="talent in talentPool"
        :key="talent.id"
        :selected="talents.isSelected(talent.id)"
        :talent="talent"
        @toggle="talents.toggleTalent"
      />
    </div>
  </section>
</template>
