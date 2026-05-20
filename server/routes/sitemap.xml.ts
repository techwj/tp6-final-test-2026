import { defineEventHandler, setHeader } from 'h3'
import { games } from '../../data/games.json'

interface Game {
  slug: string
  updatedAt?: string // Assuming games might have this
  createdAt: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  const gameUrls = (games as Game[]).map(game => {
    return `
  <url>
    <loc>${siteUrl}/game/${game.slug}</loc>
    <lastmod>${new Date(game.createdAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${gameUrls}
</urlset>`

  setHeader(event, 'Content-Type', 'text/xml')
  return sitemap
})
