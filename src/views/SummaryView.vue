<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ScoreDisplay from '../components/game/ScoreDisplay.vue'
import { useGame } from '../composables/useGame'

const router = useRouter()
const { gameStore, score, ai, init } = useGame()
const summary = ref('Generating summary...')

onMounted(async () => {
  summary.value = await ai.summarizeLife({
    stats: gameStore.stats,
    maxStats: gameStore.maxStats,
    age: gameStore.age,
    score: score.value,
  })
})

async function restart() {
  await init()
  router.push('/talents')
}
</script>

<template>
  <section class="space-y-6">
    <header class="text-center">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-600">Life Summary</p>
      <h2 class="mt-2 font-display text-3xl font-semibold text-slate-900">Run Complete</h2>
      <p class="mt-1 text-sm text-slate-600">This summary is a static template for now; AI text can be added later.</p>
    </header>

    <ScoreDisplay
      :age="gameStore.age"
      :max-stats="gameStore.maxStats"
      :score="score"
      :stats="gameStore.stats"
    />

    <div class="rounded-xl border border-slate-200 bg-white p-5 text-base text-slate-800 shadow-sm">
      {{ summary }}
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        class="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="restart"
      >
        Restart
      </button>
      <button
        class="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        @click="restart"
      >
        Play Again
      </button>
    </div>
  </section>
</template>
