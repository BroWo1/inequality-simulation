<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
    <main class="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
      <header class="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 class="font-display text-3xl font-semibold text-slate-900">Life Restart</h1>
        </div>

      </header>
      <RouterView />
    </main>
  </div>
</template>
