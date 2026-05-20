# Sprunky Games - 数据驱动的HTML5游戏平台

基于 https://fun.sprunky.org/ 的HTML5游戏平台仿站项目，采用 **数据驱动** 架构设计。

## 🎯 核心特色

**只需更新数据文件夹，即可创建全新网站！**

这是一个完全数据驱动的项目，所有内容都通过修改 `data/` 文件夹中的JSON文件来配置，无需修改任何代码。

## 📁 项目结构

```
sprunky-games/
├── data/                    # 🔑 核心数据文件夹 (修改这里即可定制网站)
│   ├── games.json          # 游戏数据配置
│   ├── categories.json     # 分类数据配置
│   └── site-config.json    # 网站全局配置
├── components/             # Vue组件
├── pages/                  # 页面文件
├── layouts/               # 布局模板
├── composables/           # 组合式函数
├── server/api/            # API路由
├── assets/                # 静态资源
└── public/                # 公共文件
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 构建生产版本
```bash
npm run build
```

## 🎮 如何定制你的游戏网站

### 1. 修改网站基本信息
编辑 `data/site-config.json`:
```json
{
  "site": {
    "name": "你的游戏网站名称",
    "title": "你的网站标题",
    "description": "你的网站描述",
    "logo": "/images/your-logo.png"
  }
}
```

### 2. 添加游戏
编辑 `data/games.json`:
```json
{
  "games": [
    {
      "id": "your-game-id",
      "title": "游戏名称",
      "slug": "game-url-slug",
      "description": "游戏描述",
      "category": "游戏分类ID",
      "gameUrl": "https://example.com/your-game",
      "thumbnail": "/images/games/your-game.jpg",
      "isHot": true
    }
  ]
}
```

### 3. 管理游戏分类
编辑 `data/categories.json`:
```json
{
  "categories": [
    {
      "id": "your-category",
      "name": "分类名称",
      "slug": "category-slug",
      "description": "分类描述",
      "icon": "🎮",
      "color": "#ef4444"
    }
  ]
}
```

## 📊 数据文件详解

### games.json - 游戏数据
- `id`: 唯一标识符
- `title`: 游戏标题
- `slug`: URL友好的路径
- `description`: 游戏描述
- `category`: 所属分类ID
- `gameUrl`: 游戏链接(支持iframe嵌入)
- `thumbnail`: 缩略图路径
- `isHot`: 是否为热门游戏
- `featured`: 是否为精选游戏

### categories.json - 分类数据
- `id`: 分类唯一标识
- `name`: 分类显示名称
- `slug`: URL路径
- `icon`: 分类图标(emoji)
- `color`: 主题颜色
- `order`: 排序权重

### site-config.json - 网站配置
- `site`: 网站基本信息
- `social`: 社交媒体链接
- `analytics`: 统计代码配置
- `features`: 功能开关

## 🎯 数据驱动优势

1. **零代码修改**: 只需编辑JSON文件即可定制整个网站
2. **快速部署**: 修改数据后重新构建即可部署新版本
3. **易于维护**: 内容与代码分离，便于非技术人员管理
4. **安全可靠**: 数据文件在构建时读取，不暴露在公共访问中

## 🔧 技术栈

- **框架**: Nuxt.js 3
- **样式**: TailwindCSS
- **部署**: Cloudflare Pages (静态生成)
- **数据**: JSON文件 + 组合式函数

## 📝 部署到Cloudflare Pages

1. 将项目推送到GitHub
2. 在Cloudflare Pages中连接仓库
3. 设置构建命令: `npm run build`
4. 设置输出目录: `dist`
5. 部署完成！

## 🎨 自定义样式

项目使用TailwindCSS，可以在 `tailwind.config.js` 中自定义主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'game-primary': '#your-color',
        'game-secondary': '#your-color'
      }
    }
  }
}
```

## 📋 更新日志

- **v1.0**: 基础功能实现，数据驱动架构
- **v1.1**: 优化SEO，添加分类筛选
- **v1.2**: 移动端适配，性能优化

---

**记住：这是一个数据驱动的项目，只需修改 `data/` 文件夹即可定制你的游戏网站！**
