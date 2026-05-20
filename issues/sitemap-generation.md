# 任务：实现动态 `sitemap.xml` 生成

## 计划

1.  **配置 `siteUrl`**
    *   **文件**: `sprunky-games/data/site-config.js`
    *   **操作**: 使用该文件中已有的 `site.url` 字段。
    *   **文件**: `sprunky-games/nuxt.config.ts`
    *   **操作**:
        *   添加 `runtimeConfig` 配置，将 `siteUrl` 暴露给服务端路由。

2.  **更新 Sitemap 生成逻辑**
    *   **文件**: `sprunky-games/server/routes/sitemap.xml.ts`
    *   **操作**:
        *   重写路由，移除旧的 `fs` 读取逻辑。
        *   改为直接导入 `data/games.json`。
        *   遍历游戏数据，为每个游戏生成 `<url>` 条目，路径为 `/game/{slug}`。
        *   添加静态页面（首页 `/`）的 URL 条目。
        *   从 `runtimeConfig` 读取 `siteUrl` 作为 URL 前缀。
        *   设置正确的 `Content-Type` header 并返回生成的 XML 字符串。

## 状态
- [x] 已完成 