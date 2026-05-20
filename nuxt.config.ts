// https://nuxt.com/docs/api/configuration/nuxt-config
import { siteConfig } from './data/site-config.js'


export default defineNuxtConfig({
  compatibilityDate: '2025-06-18',
  devtools: { enabled: true },
  
  // Runtime Config
  runtimeConfig: {
    public: {
      siteUrl: siteConfig.site.url,
    }
  },
  
  // TailwindCSS模块
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  // CSS配置
  css: ['~/assets/css/main.css'],
  
  // Cloudflare Pages 静态生成配置
  nitro: {
    preset: 'cloudflare-pages'
  },
  
  // Cloudflare Pages 兼容性配置
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/' : '/',
    cdnURL: process.env.NODE_ENV === 'production' ? '/' : '/',
    head: {
      titleTemplate: '%s - ' + siteConfig.site.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteConfig.site.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/assets/favicon-64x64.png' },
        { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/assets/favicon-128x128.png' },
      ],
      /*script: [
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1610957264301343',
          async: true,
          crossorigin: 'anonymous'
        }*/
      ]
    }
  },

  // router config
  router: {
    options: {
      linkActiveClass: 'active',
      linkExactActiveClass: 'exact-active'
    }
  }
})
