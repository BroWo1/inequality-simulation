<script setup>
import { computed } from 'vue'

const props = defineProps({
  statKey: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 10,
  },
  remaining: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['change'])

const canDecrease = computed(() => props.value > 0)
const canIncrease = computed(() => props.value < props.max && props.remaining > 0)
</script>

<template>
  <div class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div class="flex items-center gap-3">
      <span class="text-base font-semibold text-slate-900">{{ label }}</span>
      <span class="text-xs text-slate-600">Remaining {{ remaining }}</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="h-9 w-9 rounded-md border border-slate-300 bg-white text-lg text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        :disabled="!canDecrease"
        type="button"
        @click="emit('change', { statKey, delta: -1 })"
      >
        −
      </button>
      <div class="flex h-9 min-w-[64px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900">
        {{ value }}
      </div>
      <button
        class="h-9 w-9 rounded-md border border-slate-300 bg-white text-lg text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        :disabled="!canIncrease"
        type="button"
        @click="emit('change', { statKey, delta: 1 })"
      >
        +
      </button>
    </div>
  </div>
</template>
