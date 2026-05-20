// gfiles-to-gamesjson.js
// 用于批量采集 https://github.com/BinBashBanana/gfiles/tree/master/gfiles 下的游戏，生成本地 data/games.json

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

// gfiles 仓库静态资源URL前缀
const GFILES_BASE = 'https://binbashbanana.github.io/gfiles/gfiles/'

// 采集目标（可手动维护或自动爬取）
const GAME_LIST_URL = 'https://binbashbanana.github.io/gfiles/list.html'

// 生成本地games.json的目标路径
const OUTPUT_PATH = path.join(__dirname, '../data/games.json')

// 占位缩略图
const PLACEHOLDER_IMG = '/images/games/placeholder.jpg'

// 简单HTML解析工具
function extractGamesFromListHtml(html) {
  const games = []
  const regex = /<a href="gfiles\/(.*?)\/index.html".*?>(.*?)<\/a>/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const slug = match[1]
    const title = match[2].replace(/<.*?>/g, '').trim()
    games.push({ slug, title })
  }
  return games
}

async function main() {
  // 1. 获取list.html内容
  const res = await fetch(GAME_LIST_URL)
  const html = await res.text()
  const games = extractGamesFromListHtml(html)

  // 2. 组装games.json结构
  const gameEntries = games.map((g, idx) => ({
    id: g.slug,
    title: g.title || g.slug,
    slug: g.slug,
    description: g.title || g.slug,
    category: 'arcade',
    tags: ['arcade'],
    thumbnail: PLACEHOLDER_IMG, // 可后续补充真实缩略图
    gameUrl: `${GFILES_BASE}${g.slug}/index.html`,
    gameType: 'iframe',
    isHot: idx < 10, // 前10个标记为热门
    featured: idx < 5, // 前5个标记为精选
    difficulty: 'normal',
    players: 'single',
    createdAt: new Date().toISOString().slice(0, 10),
    stats: {
      plays: Math.floor(Math.random() * 10000) + 1000,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 100)
    },
    iframeSettings: {
      width: '100%',
      height: '600px',
      allowFullscreen: true
    }
  }))

  // 3. 写入本地games.json
  const output = { games: gameEntries }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`已生成 ${gameEntries.length} 个游戏到 ${OUTPUT_PATH}`)
}

main().catch(err => {
  console.error('采集失败:', err)
  process.exit(1)
}) 