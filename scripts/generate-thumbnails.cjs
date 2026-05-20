// 用 puppeteer 批量为本地 HTML5/Flash 游戏生成首屏截图，更新 games.json
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const gamesJsonPath = path.resolve(__dirname, '../data/games.json')
const imagesDir = path.resolve(__dirname, '../public/images/games')
const siteRoot = 'http://localhost:3000' // 本地开发服务地址

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function main() {
  await ensureDir(imagesDir)
  const raw = fs.readFileSync(gamesJsonPath, 'utf-8')
  const gamesData = JSON.parse(raw)
  const games = gamesData.games

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (const game of games) {
    try {
      // 只处理本地托管的游戏
      if (!game.gameUrl.startsWith('/gfiles/')) continue
      const url = siteRoot + game.gameUrl
      const imgPath = path.join(imagesDir, `${game.slug}.png`)
      // 跳过已存在图片
      if (fs.existsSync(imgPath)) {
        game.thumbnail = `/images/games/${game.slug}.png`
        continue
      }
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
      await page.setViewport({ width: 800, height: 600 })
      await page.waitForTimeout(2000) // 可调整等待时间
      await page.screenshot({ path: imgPath })
      game.thumbnail = `/images/games/${game.slug}.png`
      console.log(`截图完成: ${game.slug}`)
    } catch (e) {
      console.error(`截图失败: ${game.slug}`, e)
      // 失败兜底
      game.thumbnail = '/images/games/placeholder.jpg'
    }
  }
  await browser.close()
  fs.writeFileSync(gamesJsonPath, JSON.stringify(gamesData, null, 2), 'utf-8')
  console.log('全部处理完成')
}

main() 