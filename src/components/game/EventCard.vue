<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const effects = computed(() => props.event.effects || {})
</script>

<template>
  <article class="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <header class="flex items-center justify-between text-xs text-slate-600">
      <span>Age {{ event.age }}</span>
    </header>
    <p class="mt-1 text-base text-slate-900 leading-relaxed">{{ event.text }}</p>
    <div v-if="Object.keys(effects).length" class="mt-2 flex flex-wrap gap-2 text-xs text-slate-700">
      <span
        v-for="(value, key) in effects"
        :key="key"
        class="rounded border border-slate-200 bg-slate-50 px-2 py-0.5"
      >
        {{ key }} {{ value > 0 ? '+' : '' }}{{ value }}
      </span>
    </div>
  </article>
</template>
