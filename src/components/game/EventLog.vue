<script setup>
import EventCard from './EventCard.vue'

defineProps({
  log: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="space-y-3">
    <EventCard v-for="item in log" :key="item.timestamp || item.id" :event="item" />
  </div>
</template>
