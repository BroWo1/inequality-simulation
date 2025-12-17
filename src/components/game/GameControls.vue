<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  speed: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['next', 'toggle-autoplay', 'speed-change'])
</script>

<template>
  <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
    <button
      class="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      :disabled="disabled"
      type="button"
      @click="emit('next')"
    >
      Next Year
    </button>

    <button
      class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
      @click="emit('toggle-autoplay')"
    >
      Autoplay: {{ autoplay ? 'On' : 'Off' }}
    </button>

    <label class="flex flex-1 items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
      <span class="font-semibold text-slate-700">Speed</span>
      <input
        class="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
        max="3"
        min="0.25"
        step="0.25"
        type="range"
        :value="speed"
        @input="emit('speed-change', Number($event.target.value))"
      />
      <span class="w-12 text-right font-semibold text-slate-800">{{ speed.toFixed(2) }}x</span>
    </label>
  </div>
</template>
