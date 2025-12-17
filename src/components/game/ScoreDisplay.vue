<script setup>
import { computed } from 'vue'
import { STAT_KEYS } from '../../utils/constants'
import { getJudgmentTitle } from '../../utils/score'

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  maxStats: {
    type: Object,
    default: () => ({}),
  },
  age: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
})

const title = computed(() => getJudgmentTitle(props.score))
</script>

<template>
  <section class="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-600">This Run</p>
        <h2 class="font-display text-2xl font-semibold text-slate-900">Score {{ score.toFixed(1) }}</h2>
      </div>
      <div class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        {{ title }}
      </div>
    </div>
    <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="key in STAT_KEYS"
        :key="key"
        class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
      >
        <span class="text-sm text-slate-600">{{ key }}</span>
        <div class="text-right">
          <p class="text-lg font-semibold text-slate-900">{{ stats[key] ?? 0 }}</p>
          <p class="text-[11px] text-slate-600">Peak {{ maxStats?.[key] ?? stats[key] ?? 0 }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span class="text-sm text-slate-600">Lifespan</span>
        <p class="text-lg font-semibold text-slate-900">{{ age }} yrs</p>
      </div>
    </div>
  </section>
</template>
