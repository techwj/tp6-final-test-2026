<template>
  <div>
    <Header />
    <AdUnit 
      :key="$forceUpdate.fullPath"
      type="adsense" 
      :configs="[
        {min:0, client: 'ca-pub-1610957264301343', slot: '5437356986', width: 340, height: 200},
      ]"
    />
    <main class="page-container py-8">
      <div v-if="pending" class="text-center py-12 text-lg text-gray-500">Loading...</div>
      <div v-else-if="!category">
        <div class="text-center py-12 text-lg text-gray-500">分类不存在</div>
      </div>
      <div v-else>
        <div class="mb-6 bg-white rounded-lg shadow-sm p-4 flex items-center gap-2">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 text-white"
            :style="{ backgroundColor: category.color }"
            @click="goHome"
          >
            <span class="text-2xl">{{ category.icon }}</span>
            <span class="text-xl font-bold">{{ category.name }}</span>
          </button>
        </div>
        <GameGrid 
          :games="filteredGames"
          :loading="pending"
          :categories="categories"
          empty-message="该分类下暂无游戏"
          :page-size="24"
          @play="handlePlayGame"
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
import { useRoute, useRouter } from 'vue-router'
import { siteConfig } from '@/data/site-config.js'

const route = useRoute()
const categoryId = route.params.id

const { data, pending, error } = await useAsyncData(`category-data-${categoryId}`, async () => {
  const [gamesResponse, categoriesResponse] = await Promise.all([
    $fetch('/api/games'),
    $fetch('/api/categories')
  ])
  return {
    games: gamesResponse?.data || [],
    categories: categoriesResponse?.data || []
  }
})

const allGames = computed(() => data.value?.games || [])
const categories = computed(() => data.value?.categories || [])
const category = computed(() => categories.value.find(c => c.id == categoryId))
const filteredGames = computed(() => allGames.value.filter(game => game.category == categoryId))

const router = useRouter()
const handlePlayGame = (game) => {
  router.push(`/game/${game.slug}`)
}

const goHome = () => {
  router.push('/')
}

// SEO meta
useSeoMeta({
  title: () => `${category.value?.name || ''} - ${siteConfig.site.title}`,
  description: siteConfig.site.description,
  ogTitle: () => `${category.value?.name || ''} - ${siteConfig.site.title}`,
  ogDescription: siteConfig.site.description,
  ogImage: siteConfig.site.logo,
  twitterCard: siteConfig.site.twitterCard
})
</script>