/**
 * site config management composable
 */
export const useSiteConfig = () => {
  // get site config
  const getSiteConfig = async () => {
    if (process.server) {
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      try {
        const filePath = join(process.cwd(), 'data', 'site-config.js')
        const config = JSON.parse(readFileSync(filePath, 'utf-8'))
        return config
      } catch (error) {
        console.error('read site config failed:', error)
        return {}
      }
    } else {
      try {
        const { data } = await $fetch('/api/site-config')
        return data || {}
      } catch (error) {
        console.error('get site config failed:', error)
        return {}
      }
    }
  }
  return {
    getSiteConfig
  }
} 