export const useGames = () => {
  // 获取所有游戏
  const getAllGames = async () => {
    try {
      const { data } = await useFetch('/api/games')
      return data.value?.data || []
    } catch (error) {
      console.error('获取游戏数据失败:', error)
      return []
    }
  }
  
  // 按分类获取游戏
  const getGamesByCategory = async (category) => {
    const games = await getAllGames()
    return games.filter(game => game.category === category)
  }
  
  // 获取热门游戏
  const getHotGames = async () => {
    const games = await getAllGames()
    return games.filter(game => game.isHot)
  }
  
  // 获取精选游戏
  const getFeaturedGames = async () => {
    const games = await getAllGames()
    return games.filter(game => game.featured)
  }
  
  // 按slug获取游戏
  const getGameBySlug = async (slug) => {
    const games = await getAllGames()
    return games.find(game => game.slug === slug)
  }
  
  // 搜索游戏
  const searchGames = async (keyword) => {
    const games = await getAllGames()
    if (!keyword) return games
    
    const lowerKeyword = keyword.toLowerCase()
    return games.filter(game => 
      game.title.toLowerCase().includes(lowerKeyword) ||
      game.description.toLowerCase().includes(lowerKeyword) ||
      (game.tags && game.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    )
  }
  
  // 获取相关游戏（相同分类，排除自身）
  const getRelatedGames = async (currentGame, limit = 4) => {
    const games = await getGamesByCategory(currentGame.category)
    return games.filter(game => game.id !== currentGame.id).slice(0, limit)
  }
  
  // 按难度筛选游戏
  const getGamesByDifficulty = async (difficulty) => {
    const games = await getAllGames()
    return games.filter(game => game.difficulty === difficulty)
  }
  
  // 获取游戏统计信息
  const getGamesStats = async () => {
    const games = await getAllGames()
    return {
      total: games.length,
      hot: games.filter(g => g.isHot).length,
      featured: games.filter(g => g.featured).length,
      totalPlays: games.reduce((sum, g) => sum + (g.stats?.plays || 0), 0),
      averageRating: games.length ? (games.reduce((sum, g) => sum + (g.stats?.rating || 0), 0) / games.length) : 0
    }
  }
  
  return {
    getAllGames,
    getGamesByCategory,
    getHotGames,
    getFeaturedGames,
    getGameBySlug,
    searchGames,
    getRelatedGames,
    getGamesByDifficulty,
    getGamesStats
  }
} 