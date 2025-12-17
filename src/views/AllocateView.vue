<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatBar from '../components/game/StatBar.vue'
import { useGame } from '../composables/useGame'
import { MAX_POINTS_PER_STAT, STAT_KEYS } from '../utils/constants'

const router = useRouter()
const { dataStore, gameStore, finalizeAllocation } = useGame()

const labels = {
  CHR: 'Charm',
  INT: 'Intelligence',
  STR: 'Strength',
  MNY: 'Wealth',
  SPR: 'Happiness',
}

const allocatableStatKeys = STAT_KEYS.filter((key) => key !== 'SPR')

onMounted(async () => {
  if (!dataStore.loaded) await dataStore.loadData()
  gameStore.setState('allocating')
})

function handleChange({ statKey, delta }) {
  gameStore.allocate(statKey, delta)
}

function proceed() {
  finalizeAllocation()
  router.push('/life')
}
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2 text-center">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-600">Step 2</p>
      <h2 class="font-display text-2xl font-semibold text-slate-900">Allocate Starting Stats</h2>
      <p class="text-sm text-slate-600">Each stat can be up to {{ MAX_POINTS_PER_STAT }} points. Adjust within 0–10.</p>
      <div class="flex items-center justify-center gap-3 text-sm text-slate-700">
        <span class="rarity-chip border-slate-200 bg-white text-slate-700 shadow-sm">Remaining points {{ gameStore.availablePoints }}</span>
        <button
          class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          @click="proceed"
        >
          Done
        </button>
      </div>
    </header>

    <div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
      <div class="mb-2 text-slate-600">Selected Talents</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="talent in gameStore.selectedTalents"
          :key="talent.id"
          class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-800"
        >
          {{ talent.name }}
        </span>
        <span v-if="!gameStore.selectedTalents.length" class="text-slate-500">No talents selected yet</span>
      </div>
    </div>

    <div class="grid gap-3 lg:grid-cols-2">
      <StatBar
        v-for="statKey in allocatableStatKeys"
        :key="statKey"
        :label="labels[statKey]"
        :max="MAX_POINTS_PER_STAT"
        :remaining="gameStore.availablePoints"
        :stat-key="statKey"
        :value="gameStore.stats[statKey]"
        @change="handleChange"
      />
    </div>

  </section>
</template>
