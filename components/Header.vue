<template>
  <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
    <div class="page-container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and site name -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <span class="font-game font-bold text-xl text-primary-600">
              {{ siteConfig?.site?.name || 'qcpvyfp365 Games' }}
            </span>
          </NuxtLink>
        </div>
        
        <!-- desktop navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.href"
            :to="item.href"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            active-class="text-primary-600"
          >
            <span class="mr-1">{{ item.icon }}</span>
            {{ item.name }}
          </NuxtLink>
        </nav>
        
        <!-- search box -->
        <div class="hidden lg:flex items-center">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search games..."
              @keyup.enter="handleSearch"
            >
          </div>
        </div>
        
        <!-- mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <!-- search box -->
          <div class="px-3 py-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search games..."
                @keyup.enter="handleSearch"
              >
            </div>
          </div>
          
          <!-- navigation links -->
          <NuxtLink
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
            @click="showMobileMenu = false"
          >
            <span class="mr-2">{{ item.icon }}</span>
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
// get site config
import {siteConfig} from '@/data/site-config.js'

const navigation = computed(() => siteConfig?.navigation || [])

// search function
const searchQuery = ref('')
const router = useRouter()
const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return
  router.push({ path: '/search', query: { q } })
}

// mobile menu
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// close mobile menu when route changed
const route = useRoute()
watch(() => route.path, () => {
  showMobileMenu.value = false
})
</script> 