import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event).query?.toLowerCase() || ''
    const gamesPath = join(process.cwd(), 'data', 'games.json')
    const gamesContent = readFileSync(gamesPath, 'utf-8')
    const { games } = JSON.parse(gamesContent)

    // 模糊搜索
    let results = []
    if (query) {
      results = games.filter(game =>
        game.title.toLowerCase().includes(query) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (game.category && game.category.toLowerCase().includes(query))
      )
    }

    // 热门推荐（按plays降序，取前8个）
    const hotGames = games
      .filter(g => g.stats && g.stats.plays)
      .sort((a, b) => b.stats.plays - a.stats.plays)
      .slice(0, 8)

    return {
      success: true,
      data: results,
      hot: results.length === 0 ? hotGames : []
    }
  } catch (error) {
    console.error('搜索游戏失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '无法搜索游戏'
    })
  }
}) 