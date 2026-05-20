import gamesData from '~/data/games.json'

export default defineEventHandler((event) => {
  try {
    return {
      success: true,
      data: gamesData.games
    }
  } catch (error) {
    console.error('读取游戏数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '无法读取游戏数据'
    })
  }
}) 