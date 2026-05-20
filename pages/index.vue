<template>
  <div>
    <Header 
      @search="onSearch"
      :searchResults="searchResults"
      :hotGames="hotGames"
      :searching="searching"
      :searchError="searchError"
    />

    <main class="page-container py-8">
      <div v-if="searching" class="text-center py-12 text-lg text-gray-500">Searching...</div>
      <div v-else-if="searchResults.length">
        <h2 class="text-xl font-bold mb-4">Search Results</h2>
        <GameGrid :games="searchResults" :categories="categories" @play="goToGame" />
      </div>
      <div v-else-if="searchError">
        <div class="text-center py-12 text-lg text-gray-500">{{ searchError }}</div>
        <GameGrid v-if="hotGames.length" :games="hotGames" :categories="categories" @play="goToGame" />
      </div>
      <div v-else>
        <!-- category tag -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-1">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="selectCategory('all')"
            class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 truncate"
            :class="selectedCategory === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            🎮 All Games
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="goToCategory(category.id)"
            class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 truncate"
            :class="selectedCategory === category.id 
              ? 'text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            :style="selectedCategory === category.id ? { backgroundColor: category.color } : {}"
          >
            <span>{{ category.icon }}</span>
            <span class="truncate">{{ category.name }}</span>
          </button>
        </div>
      </div>


    <AdUnit 
      :key="$forceUpdate.fullPath"
      type="adsense" 
      :configs="[
        {min:0, client: 'ca-pub-1610957264301343', slot: '5437356986', width: 340, height: 200},
      ]"
    />

        <!-- game grid -->
        <GameGrid 
          :games="filteredGames"
          :loading="pending"
          :categories="categories"
          @play="handlePlayGame"
          empty-message="No games in this category"
          :page-size="24"
        />
      </div>
    </main>
    <AdUnit 
      :key="$forceUpdate.fullPath"
      type="adsense" 
      :configs="[
        {min:0, client: 'ca-pub-1610957264301343', slot: '4124275315', format: 'auto', fullWidthResponsive: true},
      ]"
    />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import GameGrid from '@/components/GameGrid.vue'
import { siteConfig } from '@/data/site-config.js'

// page meta
useSeoMeta({
  title: siteConfig.site.title,
  description: siteConfig.site.description,
  ogTitle: siteConfig.site.title,
  ogDescription: siteConfig.site.description,
  ogImage: siteConfig.site.logo,
  twitterCard: siteConfig.site.twitterCard
})

// Correct, Nuxt-idiomatic data fetching
const { data, pending, error: loadError } = await useAsyncData('home-data', async () => {
  const [gamesResponse, categoriesResponse] = await Promise.all([
    $fetch('/api/games'),
    $fetch('/api/categories')
  ])
  return {
    games: gamesResponse?.data || [],
    categories: categoriesResponse?.data || []
  }
})

// Handle potential errors during fetch
if (loadError.value) {
  console.error('Failed to load home page data:', loadError.value)
}

// reactive data
const allGames = computed(() => data.value?.games || [])
const categories = computed(() => data.value?.categories || [])
const selectedCategory = ref('all')
const searchResults = ref([])
const hotGames = ref([])
const searching = ref(false)
const searchError = ref('')

// computed: filter games by selected category
const filteredGames = computed(() => {
  if (selectedCategory.value === 'all') {
    return allGames.value
  }
  return allGames.value.filter(game => game.category === selectedCategory.value)
})

// category switch
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

// game play handle
const router = useRouter()
const handlePlayGame = (game) => {
  router.push(`/game/${game.slug}`)
}

const onSearch = (results, hot, loading, error) => {
  searchResults.value = results
  hotGames.value = hot
  searching.value = loading
  searchError.value = error
}

const goToGame = (game) => {
  router.push(`/game/${game.slug}`)
}
const goToCategory = (categoryId) => {
  router.push(`/category/${categoryId}`)
}
</script> 