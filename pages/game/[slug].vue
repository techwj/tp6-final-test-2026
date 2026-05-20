<template>
  <div v-if="pending" class="page-container py-16">
    <div class="flex justify-center items-center">
      <div class="loading-spinner"></div>
    </div>
  </div>
  
  <div v-else-if="error" class="page-container py-16 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Game not found</h1>
    <p class="text-gray-600 mb-8">Sorry, the game you are looking for does not exist</p>
    <NuxtLink to="/" class="btn-primary">Back to Home</NuxtLink>
  </div>
  
  <div v-else class="pb-16">
    <AdUnit 
      :key="$forceUpdate.fullPath"
      type="adsense" 
      :configs="[
        {min:0, client: 'ca-pub-1610957264301343', slot: '5437356986', width: 340, height: 200},
      ]"
    />
    <!-- breadcrumb navigation -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="page-container py-4">
        <nav class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-500 hover:text-primary-600">Home</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-medium">{{ game.title }}</span>
        </nav>
      </div>
    </div>

    <!-- game main area -->
    <div class="page-container py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- game play area -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- game header info -->
            <div class="p-6 border-b border-gray-200">
              <h1 class="text-3xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition" @click="goToCategory">{{ game.title }}</h1>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ game.stats.rating }}
                </span>
                <span>{{ game.stats.plays }} plays</span>
                <span v-if="game.isHot" class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  🔥 HOT
                </span>
              </div>
            </div>

            <!-- game player -->
            <div class="relative w-full" style="height:1000px;">
              <iframe
                :src="game.gameUrl"
                width="100%"
                height="100%"
                frameborder="0"
                class="w-full h-full rounded-b-xl"
                allowfullscreen
                title="Game Player"
              />
              <transition name="fade">
                <div v-if="!isPlaying" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60">
                  <button 
                    @click="startGame"
                    class="btn-game text-2xl px-8 py-4 bg-white/80 hover:bg-white/90 rounded-xl shadow-lg font-bold"
                  >
                    🎮 Click
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- sidebar -->
        <div class="space-y-6">
          <!-- game info -->
          <div class="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:bg-primary-50 transition" @click="goToCategory">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Game Info</h3>
            <div class="space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-500">Game Description:</span>
                <p class="text-gray-700 mt-1">{{ game.description }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Game Tags:</span>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span 
                    v-for="tag in game.tags" 
                    :key="tag"
                    class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- related games -->
    <section class="py-12 bg-gray-50">
      <div class="page-container">
        <h2 class="section-title mb-8">🎯 Related Games</h2>
        <GameGrid 
          :games="relatedGames"
          :loading="relatedLoading"
          @play="handlePlayGame"
          empty-message="No related games"
        />
      </div>
    </section>
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
const route = useRoute()
const router = useRouter()
const { getGameBySlug, getRelatedGames } = useGames()

// get game data
const { data: game, pending, error } = await useLazyAsyncData(`game-${route.params.slug}`, () => 
  getGameBySlug(route.params.slug)
)


// related games
const relatedGames = ref([])
const relatedLoading = ref(false)

// game play state
const isPlaying = ref(false)

// page meta data
watchEffect(() => {
  if (game.value) {
    useSeoMeta({
      title: `${game.value.title} - Online Play`,
      description: game.value.description,
      ogTitle: `${game.value.title} - qcpvyfp365 Games`,
      ogDescription: game.value.description,
      ogImage: game.value.thumbnail
    })
  }
})

// game control method
const startGame = () => {
  isPlaying.value = true
}

// handle play other game
const handlePlayGame = (newGame) => {
  router.push(`/game/${newGame.slug}`)
}

// load related games
const loadRelatedGames = async () => {
  relatedLoading.value = true
  if (!game.value) {
    relatedGames.value = []
    relatedLoading.value = false
    return
  }
  try {
    // priority same category recommendation
    const allGames = await useGames().getAllGames()
    const sameCategory = allGames.filter(g => g.category === game.value.category && g.id !== game.value.id)
    let recs = sameCategory.slice(0, 8)
    // if not enough 8, supplement other hot games
    if (recs.length < 8) {
      const others = allGames.filter(g => g.id !== game.value.id && !recs.includes(g))
      recs = recs.concat(others.slice(0, 8 - recs.length))
    }
    relatedGames.value = recs
  } catch (error) {
    console.error('load related games failed:', error)
    relatedGames.value = []
  } finally {
    relatedLoading.value = false
  }
}

watchEffect(() => {
  if (game.value) {
    loadRelatedGames()
  }
})

const goToCategory = () => {
  if (game.value && game.value.category) {
    router.push(`/category/${game.value.category}`)
  }
}
</script> 