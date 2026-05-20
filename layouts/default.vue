<template>
  <div class="min-h-screen bg-gray-50">
    <!-- header -->
    <Header />
    
    <!-- main content -->
    <main class="pt-16">
      <slot />
    </main>
    
    <!-- footer -->
    <Footer />
  </div>
</template>

<script setup>
// get site config
// const { getSiteConfig } = useSiteConfig()
// const siteConfig = await getSiteConfig()
import {siteConfig} from '@/data/site-config.js'

// set page head info
useHead({
  titleTemplate: (title) => title ? `${title} - ${siteConfig.site?.name || 'qcpvyfp365 Games'}` : siteConfig.site?.title || 'Online HTML5 Games Platform',
  meta: [
    { name: 'description', content: siteConfig.site?.description || 'The best HTML5 online game platform, no download required, including puzzle, arcade, casual, strategy, action, racing, and more.' },
    { name: 'keywords', content: siteConfig.site?.keywords?.join(',') || 'HTML5 Games, Online Games, Free Games, Browser Games, Puzzle Games, Arcade Games' },
    { name: 'author', content: siteConfig.site?.author || 'qcpvyfp365 Team' },
    { property: 'og:site_name', content: siteConfig.site?.name || 'qcpvyfp365 Games' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: siteConfig.site?.favicon || '/favicon.ico' }
  ]
})
</script> 