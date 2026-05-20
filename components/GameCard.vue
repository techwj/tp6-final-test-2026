<template>
  <div class="game-card group relative" @click="$emit('play', game)">
    <!-- game thumbnail -->
    <div class="relative overflow-hidden rounded-t-xl">
      <img 
        :src="game.thumbnail" 
        :alt="game.title"
        class="game-card-image"
        loading="lazy"
      >
      
      <!-- HOT tag -->
      <div v-if="game.isHot" class="hot-badge">
        HOT
      </div>
      
      <!-- play overlay -->
      <div class="play-overlay">
        <button 
          class="play-button"
          @click.stop="$emit('play', game)"
          aria-label="Start Game"
        >
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- game info -->
    <div class="p-4">
      <div class="mb-2">
        <h3 class="font-semibold text-lg text-gray-900 line-clamp-1">
          {{ game.title }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-2 mt-1">
          {{ game.description }}
        </p>
      </div>
      
      <!-- category and rating -->
      <div class="flex items-center justify-between mt-3">
        <span 
          class="category-badge"
          :style="{ backgroundColor: getCategoryColor(game.category) + '20', color: getCategoryColor(game.category) }"
        >
          {{ getCategoryName(game.category) }}
        </span>
        
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ game.stats.rating }}
        </div>
      </div>
      
      <!-- game stats -->
      <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>{{ formatPlays(game.stats.plays) }} plays</span>
        <span>{{ getDifficultyText(game.difficulty) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play'])

const getCategoryName = (categoryId) => {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category?.name || categoryId
}

const getCategoryColor = (categoryId) => {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category?.color || '#6b7280'
}

// format plays
const formatPlays = (plays) => {
  if (plays >= 1000000) {
    return Math.floor(plays / 1000000) + 'M'
  } else if (plays >= 1000) {
    return Math.floor(plays / 1000) + 'K'
  }
  return plays.toString()
}

// get difficulty text
const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  }
  return difficultyMap[difficulty] || difficulty
}
</script> 