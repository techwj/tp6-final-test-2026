const fs = require('fs');
const path = require('path');

const GFILES_HTML5 = path.join(__dirname, '../gfiles/gfiles/html5');
const GFILES_LIST = path.join(__dirname, '../gfiles/list.html');
const OUTPUT_PATH = path.join(__dirname, '../data/games.json');
const PLACEHOLDER_IMG = '/images/games/placeholder.jpg';

function getThumbnail(gameDir, slug) {
  const candidates = ['thumb.png', 'thumbnail.jpg', 'cover.png', 'logo.png'];
  for (const file of candidates) {
    if (fs.existsSync(path.join(gameDir, file))) {
      return `/gfiles/html5/${slug}/${file}`;
    }
  }
  return PLACEHOLDER_IMG;
}

// 1. HTML5
function getHtml5Games() {
  if (!fs.existsSync(GFILES_HTML5)) return [];
  const dirs = fs.readdirSync(GFILES_HTML5, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
  return dirs.map((dirent, idx) => {
    const slug = dirent.name;
    const gameDir = path.join(GFILES_HTML5, slug);
    if (!fs.existsSync(path.join(gameDir, 'index.html'))) return null;
    return {
      id: slug,
      title: slug,
      slug: slug,
      description: slug,
      category: 'arcade',
      tags: ['arcade'],
      thumbnail: getThumbnail(gameDir, slug),
      gameUrl: `/gfiles/html5/${slug}/index.html`,
      gameType: 'html5',
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
    };
  }).filter(Boolean);
}

// 2. Flash & Emulator
function getListHtmlGames() {
  if (!fs.existsSync(GFILES_LIST)) return [];
  const html = fs.readFileSync(GFILES_LIST, 'utf-8');
  const games = [];
  // Flash
  const flashRe = /<a href="\.\/gfiles\/flash\/\?swf=([a-zA-Z0-9_]+)\.swf">([^<]*)<\/a>/g;
  let m;
  while ((m = flashRe.exec(html))) {
    const slug = m[1];
    games.push({
      id: slug,
      title: m[2] || slug,
      slug: slug,
      description: m[2] || slug,
      category: 'flash',
      tags: ['flash'],
      thumbnail: PLACEHOLDER_IMG,
      gameUrl: `/gfiles/flash/?swf=${slug}.swf`,
      gameType: 'flash',
      isHot: false,
      featured: false,
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
  }
  // Emulator
  const emuRe = /<a href="\.\/gfiles\/rarch\/\?core=([a-zA-Z0-9_]+)">([^<]*)<\/a>/g;
  while ((m = emuRe.exec(html))) {
    const slug = m[1];
    games.push({
      id: slug,
      title: m[2] || slug,
      slug: slug,
      description: m[2] || slug,
      category: 'emulator',
      tags: ['emulator'],
      thumbnail: PLACEHOLDER_IMG,
      gameUrl: `/gfiles/rarch/?core=${slug}`,
      gameType: 'emulator',
      isHot: false,
      featured: false,
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
  }
  return games;
}

function main() {
  const html5Games = getHtml5Games();
  const listGames = getListHtmlGames();
  const allGames = [...html5Games, ...listGames];
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ games: allGames }, null, 2), 'utf-8');
  console.log(`已生成 ${allGames.length} 个游戏到 ${OUTPUT_PATH}`);
}

main(); 