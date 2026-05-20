<template>
  <footer class="bg-white border-t border-gray-200 mt-16" @click="handleFooterJump" style="cursor:pointer;">
    <div class="page-container">
      <div class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- site info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <span class="font-game font-bold text-xl text-primary-600">
                {{ siteConfig?.site.name }}
              </span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ siteConfig?.site.description }}
            </p>
          </div>
          
          <!-- quick links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul class="space-y-2">
              <li v-for="item in navigation" :key="item.href">
                <NuxtLink
                  :to="item.href"
                  class="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200"
                >
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
          
          <!-- legal links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal Information
            </h3>
            <ul class="space-y-2">
              <li v-for="link in footerLinks" :key="link.href">
                <div 
                  class="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200"
                >
                  {{ link.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- bottom border and copyright info -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <p class="text-gray-500 text-sm">
              {{ siteConfig?.footer.copyright }}
            </p>
            <div class="mt-4 md:mt-0 flex space-x-6">
              <span class="text-gray-400 text-xs">
                Focus on HTML5 game experience
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// get site config
import { siteConfig } from '@/data/site-config.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 异步获取分类数据
const categories = ref([])

onMounted(async () => {
  try {
    const res = await $fetch('/api/categories')
    categories.value = res?.data || []
  } catch (e) {
    categories.value = []
  }
})

const handleFooterJump = () => {
  const path = route.path
  if (path === '/' && categories.value.length) {
    // 首页，跳转到第一个分类
    router.push(`/category/${categories.value[0].id}`)
  } else if (path.startsWith('/category/') || path.startsWith('/game/')) {
    // 分类页或游戏页，跳转到首页
    router.push('/')
  } else {
    // 其他情况默认跳转首页
    router.push('/')
  }
}

const navigation = computed(() => siteConfig?.navigation || [])
const footerLinks = computed(() => siteConfig?.footer.links || [])

</script> 