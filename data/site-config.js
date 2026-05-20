const site = {
  "name": "game.qcpvyfp.com",
  "title": "qcpvyfp365 Games - Online HTML5 Games Platform",
  "description": "The best small HTML5&flash online game platform, no download required, including puzzle, arcade, casual, strategy, action, racing, and more.",
  "logo": "/images/logo.png",
  "favicon": "/favicon.ico",
  "keywords": ["HTML5 Games","Online Games","Free Games","Browser Games","qcpvyfp365","Puzzle Games","Arcade Games"],
  "author": "game.qcpvyfp.com Team",
  "language": "en",
  "url": "https://game.qcpvyfp.com",
  "twitterCard": "/images/summary_large_image.png",
  "ogImage": "/images/og-image.png",
};

export const siteConfig = {
  site,
  "social": {
    "facebook": `https://www.facebook.com/${site.name}`,
    "twitter": `https://twitter.com/${site.name}`,
    "instagram": `https://www.instagram.com/${site.name}`,
    "youtube": `https://www.youtube.com/${site.name}`,
    "discord": "https://discord.gg/your-invite-code"
  },
  "analytics": {
    "googleAnalytics": "",
    "baiduAnalytics": "",
    "cloudflareAnalytics": true
  },
  "features": {
    "search": true,
    "comments": false,
    "ratings": true,
    "favorites": false,
    "darkMode": true,
    "newsletter": false
  },
  "navigation": [
    {
      "name": "Home",
      "href": "/",
      "icon": "🏠"
    }
  ],
  "footer": {
    "copyright": `© 2024 ${site.name}. All rights reserved.`,
    "links": [
      {
        "name": "Privacy Policy",
        "href": "/privacy"
      },
      {
        "name": "Terms of Service",
        "href": "/terms"
      },
      {
        "name": "Contact Us",
        "href": "/contact"
      }
    ]
  }
};