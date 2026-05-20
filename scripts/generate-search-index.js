import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取游戏数据
const gamesPath = join(__dirname, '../data/games.json');
const games = JSON.parse(readFileSync(gamesPath, 'utf-8')).games;

// 输出到 public 目录
const outputPath = join(__dirname, '../public/games-search-index.json');
writeFileSync(outputPath, JSON.stringify({ games }, null, 2));
console.log('静态搜索数据已生成: public/games-search-index.json'); 