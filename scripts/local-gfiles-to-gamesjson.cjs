// scripts/local-gfiles-to-gamesjson.cjs
const fs = require('fs');
const path = require('path');

const GFILES_DIR = path.join(__dirname, '../gfiles/gfiles');
const OUTPUT_PATH = path.join(__dirname, '../data/games.json');
const PLACEHOLDER_IMG = '/images/games/placeholder.jpg';

function getThumbnail(gameDir) {
  const candidates = ['thumb.png', 'thumbnail.jpg', 'cover.png', 'logo.png'];
  for (const file of candidates) {
    if (fs.existsSync(path.join(gameDir, file))) {
      return `/games/${path.basename(gameDir)}/${file}`;
    }
  }
  return PLACEHOLDER_IMG;
}

function main() {
  const games = [];
  const dirs = fs.readdirSync(GFILES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  dirs.forEach((slug, idx) => {
    const gameDir = path.join(GFILES_DIR, slug);
    games.push({
      id: slug,
      title: slug,
      slug: slug,
      description: slug,
      category: 'arcade',
      tags: ['arcade'],
      thumbnail: getThumbnail(gameDir),
      gameUrl: `/games/${slug}/index.html`,
      gameType: 'iframe',
      isHot: idx < 10,
      featured: idx < 5,
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
    });
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ games }, null, 2), 'utf-8');
  console.log(`已生成 ${games.length} 个游戏到 ${OUTPUT_PATH}`);
}

main();