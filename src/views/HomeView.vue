<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGame } from '../composables/useGame'

const router = useRouter()
const { dataStore, init, gameStore } = useGame()

onMounted(() => {
  if (!dataStore.loaded) dataStore.loadData()
})

async function startRun() {
  await init()
  router.push('/talents')
}
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-3 text-center">
      <h2 class="font-display text-4xl font-semibold text-slate-900 flex items-center justify-center gap-3">
        Inequality Simulator
      </h2>
      <p class="text-sm text-slate-700">
        Pick talents, allocate stats, then click Start to watch your life play out.
      </p>
    </div>

    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <button
        class="w-full max-w-xs rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="startRun"
      >
        Start New Life
      </button>
      <button
        class="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="router.push('/talents')"
      >
        Choose Talents
      </button>
    </div>



    <div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
      Current state: {{ gameStore.state }} · Data {{ dataStore.loaded ? 'loaded' : 'not loaded' }}
    </div>
  </section>
</template>
