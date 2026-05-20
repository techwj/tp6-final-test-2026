import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  try {
    const filePath = join(process.cwd(), 'data', 'site-config.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const config = JSON.parse(fileContent)
    
    return {
      success: true,
      data: config
    }
  } catch (error) {
    console.error('读取网站配置失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '无法读取网站配置'
    })
  }
}) 