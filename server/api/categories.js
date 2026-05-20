import gamesData from '~/data/games.json'

// category meta
const CATEGORY_META = {
  arcade: {
    name: 'Arcade Games',
    description: 'Classic arcade-style games with fast-paced action.',
    icon: '🕹️',
    color: '#ef4444',
    order: 1
  },
  puzzle: {
    name: 'Puzzle Games',
    description: 'Brain-training puzzle games.',
    icon: '🧩',
    color: '#3b82f6',
    order: 2
  },
  casual: {
    name: 'Casual Games',
    description: 'Relaxing and entertaining casual games.',
    icon: '🎮',
    color: '#10b981',
    order: 3
  },
  strategy: {
    name: 'Strategy Games',
    description: 'Games that require deep thinking and strategic planning.',
    icon: '♟️',
    color: '#8b5cf6',
    order: 4
  },
  action: {
    name: 'Action & Adventure',
    description: 'Exciting action and adventure games.',
    icon: '⚔️',
    color: '#f59e0b',
    order: 5
  },
  racing: {
    name: 'Racing Games',
    description: 'High-speed and thrilling racing games.',
    icon: '🏎️',
    color: '#ec4899',
    order: 6
  },
  shooter: {
    name: 'Shooter Games',
    description: 'First/third-person shooters and bullet hell games.',
    icon: '🔫',
    color: '#6366f1',
    order: 7
  },
  adventure: {
    name: 'Adventure & Puzzle',
    description: 'Games focused on exploration, story, and puzzles.',
    icon: '🗺️',
    color: '#fbbf24',
    order: 8
  },
  sports: {
    name: 'Sports Games',
    description: 'Various sports and competitive games.',
    icon: '🏀',
    color: '#22d3ee',
    order: 9
  },
  simulation: {
    name: 'Simulation & Management',
    description: 'Simulation, management, and nurturing games.',
    icon: '🏗️',
    color: '#a3e635',
    order: 10
  },
  platformer: {
    name: 'Platformer',
    description: 'Side/vertical scrolling platformer games.',
    icon: '🦘',
    color: '#f472b6',
    order: 11
  },
  fighting: {
    name: 'Fighting Games',
    description: '1v1 or multiplayer fighting and competitive games.',
    icon: '🥊',
    color: '#f87171',
    order: 12
  },
  rpg: {
    name: 'Role-Playing Games',
    description: 'RPGs focused on growth, development, and story.',
    icon: '🧙',
    color: '#a78bfa',
    order: 13
  }
}


export default defineEventHandler((event) => {
  try {
    // use imported games data
    const { games } = gamesData

    // count each category
    const categoryCountMap = {}
    games.forEach(game => {
      const cat = game.category
      if (cat) {
        categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1
      }
    })

    // merge category info
    const merged = Object.keys(categoryCountMap).map(id => {
      const meta = CATEGORY_META[id] || {}
      return {
        id,
        name: meta.name || id,
        slug: id,
        description: meta.description || '',
        icon: meta.icon || '',
        color: meta.color || '',
        order: meta.order || 999,
        count: categoryCountMap[id]
      }
    })
    // sort by order
    merged.sort((a, b) => (a.order || 999) - (b.order || 999))

    return {
      success: true,
      data: merged
    }
  } catch (error) {
    console.error('read category data failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'read category data failed'
    })
  }
}) 