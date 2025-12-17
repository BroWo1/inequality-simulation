<script setup>
const props = defineProps({
  talent: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const gradeMeta = {
  0: {
    label: 'Common',
    accentClass: 'border-l-slate-400',
    surfaceClass: 'border-slate-200 bg-white',
    chipClass: 'border-slate-200 bg-slate-50 text-slate-700',
  },
  1: {
    label: 'Rare',
    accentClass: 'border-l-blue-500',
    surfaceClass: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white',
    chipClass: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  2: {
    label: 'Epic',
    accentClass: 'border-l-purple-500',
    surfaceClass: 'border-purple-200 bg-gradient-to-br from-purple-50 to-white',
    chipClass: 'border-purple-200 bg-purple-50 text-purple-800',
  },
  3: {
    label: 'Legendary',
    accentClass: 'border-l-amber-500',
    surfaceClass: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
    chipClass: 'border-amber-200 bg-amber-50 text-amber-900',
  },
}

const meta = gradeMeta[props.talent.grade] || gradeMeta[0]
</script>

<template>
  <button
    class="group flex h-full flex-col gap-2 rounded-xl border border-l-4 p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    :class="[
      meta.surfaceClass,
      meta.accentClass,
      selected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-50' : '',
    ]"
    type="button"
    @click="emit('toggle', talent.id)"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="rarity-chip" :class="meta.chipClass">{{ meta.label }}</span>
        <h3 class="font-semibold text-slate-900">{{ talent.name }}</h3>
      </div>
    </div>
    <p class="text-sm text-slate-700">{{ talent.description }}</p>
    <div class="flex flex-wrap gap-2 text-xs text-slate-700">
      <span
        v-if="Number(talent.startingPointsBonus) > 0"
        class="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-semibold text-emerald-800"
      >
        +{{ Number(talent.startingPointsBonus) }} starting points
      </span>
      <template v-for="(value, key) in talent.effects" :key="key">
        <span class="rounded-full border border-slate-200 bg-white/80 px-2 py-1">
          {{ key }} {{ value > 0 ? '+' : '' }}{{ value }}
        </span>
      </template>
    </div>
  </button>
</template>
