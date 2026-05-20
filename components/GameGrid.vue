<template>
  <div class="game-grid-container">
    <!-- loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- empty state -->
    <div v-else-if="!games.length" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m1 4v6" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No games found</h3>
      <p class="mt-1 text-sm text-gray-500">{{ emptyMessage }}</p>
    </div>
    
    <!-- game grid -->
    <div v-else class="game-grid">
      <GameCard 
        v-for="game in displayedGames" 
        :key="game.id"
        :game="game"
        :categories="categories"
        @play="handlePlayGame"
      />
    </div>
    
    <!-- load more button -->
    <div v-if="hasMore && !loading" class="text-center mt-8">
      <button 
        class="btn-primary"
        @click="loadMore"
        :disabled="loadingMore"
      >
        <span v-if="loadingMore" class="flex items-center">
          <div class="loading-spinner w-4 h-4 mr-2"></div>
          Loading...
        </span>
        <span v-else>Load More</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  games: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 12
  },
  emptyMessage: {
    type: String,
    default: 'No games found, please check back later'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play', 'loadMore'])

// pagination logic
const currentPage = ref(1)
const loadingMore = ref(false)

const displayedGames = computed(() => {
  return props.games.slice(0, currentPage.value * props.pageSize)
})

const hasMore = computed(() => {
  return props.games.length > currentPage.value * props.pageSize
})

const categories = computed(() => props.categories || [])

// load more
const loadMore = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  loadingMore.value = false
  emit('loadMore', currentPage.value)
}

// game event handle
const handlePlayGame = (game) => {
  emit('play', game)
}

// reset pagination (when games changed)
watch(() => props.games, () => {
  currentPage.value = 1
}, { deep: true })
</script> 