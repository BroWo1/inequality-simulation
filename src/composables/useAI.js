import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { getJudgmentTitle } from '../utils/score'

export function useAI() {
  const gameStore = useGameStore()
  const enabled = computed(() => Boolean(gameStore.settings.aiEnabled))

  async function enhanceEventText(originalText) {
    // Stub: passthrough now, AI flavor text in the future.
    return originalText
  }

  async function summarizeLife(payload) {
    const { stats, age, score } = payload
    const title = getJudgmentTitle(score)
    return `[${title}] This run ended at age ${age}. Charm ${stats.CHR}, Intelligence ${stats.INT}, Strength ${stats.STR}, Wealth ${stats.MNY}, Happiness ${stats.SPR}.`
  }

  async function generateEvent() {
    return null
  }

  async function generateTalent() {
    return null
  }

  return {
    enabled,
    enhanceEventText,
    summarizeLife,
    generateEvent,
    generateTalent,
  }
}
