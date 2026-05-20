<script setup>
import { ref, watchEffect, computed } from 'vue'
import GameGrid from '@/components/GameGrid.vue'
const route = useRoute()
const q = computed(() => route.query.q || '')
const allGames = ref([])
const searchResults = ref([])

watchEffect(async () => {
  if (!q.value) {
    searchResults.value = []
    return
  }
  if (!allGames.value.length) {
    allGames.value = (await $fetch('/games-search-index.json')).games
  }
  const lowerQ = q.value.toLowerCase()
  searchResults.value = allGames.value.filter(g =>
    g.title.toLowerCase().includes(lowerQ) ||
    g.description.toLowerCase().includes(lowerQ) ||
    (g.tags && g.tags.some(tag => tag.toLowerCase().includes(lowerQ)))
  )
})
</script>

<template>
  <div class="page-container py-8">
    <h2 class="text-xl font-bold mb-4">Search: {{ q }}</h2>
    <GameGrid :games="searchResults" empty-message="No games found" />
  </div>
</template> 