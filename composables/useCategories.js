export const useCategories = () => {
  // 仅通过API获取所有分类
  const getAllCategories = async () => {
    try {
      const { data } = await useFetch('/api/categories')      
      return data.value?.data || []
    } catch (error) {
      console.error('获取分类数据失败:', error)
      return []
    }
  }
  
  // 按slug获取分类
  const getCategoryBySlug = async (slug) => {
    const categories = await getAllCategories()
    return categories.find(category => category.slug === slug)
  }
  
  // 获取分类统计信息（直接返回API的count字段）
  const getCategoriesWithStats = async () => {
    const categories = await getAllCategories()
    return categories.map(category => ({
      ...category,
      gameCount: category.count
    }))
  }
  
  return {
    getAllCategories,
    getCategoryBySlug,
    getCategoriesWithStats
  }
} 