<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EventLog from '../components/game/EventLog.vue'
import GameControls from '../components/game/GameControls.vue'
import { useGame } from '../composables/useGame'
import { STAT_KEYS } from '../utils/constants'

const router = useRouter()
const { dataStore, gameStore, stepYear } = useGame()
const busy = ref(false)

onMounted(async () => {
  if (!dataStore.loaded) await dataStore.loadData()
  gameStore.setState('running')
})

async function nextYear() {
  busy.value = true
  await stepYear()
  busy.value = false
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-600">In Progress</p>
        <h2 class="font-display text-2xl font-semibold text-slate-900">Age {{ gameStore.age }}</h2>
      </div>
      <button
        class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="router.push('/summary')"
      >
        View Summary
      </button>
    </header>

    <div
      v-if="gameStore.state === 'finished'"
      class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 shadow-sm"
    >
      <p class="font-semibold">You died at age {{ gameStore.death?.age ?? gameStore.age }}.</p>
      <p v-if="gameStore.death?.text" class="mt-1 text-rose-800">{{ gameStore.death.text }}</p>
    </div>
    

    <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <div
        v-for="key in STAT_KEYS"
        :key="key"
        class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
      >
        <span class="text-sm text-slate-600">{{ key }}</span>
        <span class="text-lg font-semibold text-slate-900">{{ gameStore.stats[key] }}</span>
      </div>
    </div>
    <GameControls
      :autoplay="gameStore.settings.autoplay"
      :disabled="busy || gameStore.state === 'finished'"
      :speed="gameStore.settings.speed"
      @next="nextYear"
      @speed-change="(speed) => (gameStore.settings.speed = speed)"
      @toggle-autoplay="() => (gameStore.settings.autoplay = !gameStore.settings.autoplay)"
    />

    <div class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <EventLog :log="gameStore.log" />
    </div>

    
  </section>
</template>
