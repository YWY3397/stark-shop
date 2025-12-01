import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/mockData'; // 仅用于获取分类常量
import ProductCard from '../components/ProductCard';
import { useStore } from '../store';

const CATEGORIES = ['全部', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

const ProductList: React.FC = () => {
  const { 
    isLoading, 
    filters, 
    pagination, 
    initializeProducts, 
    setFilter, 
    setPage,
    getFilteredProducts
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  // 从 Store 获取过滤结果和分页数据
  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / pagination.itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 顶部工具栏 */}
      <div className="flex flex-col gap-6 mb-8 border-b border-gray-100 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">系列藏品</h1>
            <p className="text-sm text-gray-500 mt-1">
              斯塔克工业正品授权 · {filteredProducts.length} 件商品
            </p>
          </div>
          
          {/* 搜索框 */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-sm leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary transition-colors sm:text-sm"
              placeholder="搜索装甲型号、分类..."
              value={filters.query}
              onChange={(e) => setFilter({ query: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            className="md:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-50 rounded-md"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" /> 筛选
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span>当前展示: {filters.category}</span>
            {filters.query && <span> · 搜索: "{filters.query}"</span>}
          </div>
          
          <div className="relative ml-auto">
            <select 
              value={filters.sort}
              onChange={(e) => setFilter({ sort: e.target.value as any })}
              className="appearance-none bg-transparent font-medium text-sm text-gray-900 pr-6 py-1.5 focus:outline-none cursor-pointer hover:text-primary transition-colors text-right"
            >
              <option value="recommended">推荐排序</option>
              <option value="price-asc">价格: 低到高</option>
              <option value="price-desc">价格: 高到低</option>
              <option value="rating">好评优先</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-12 items-start">
        {/* 筛选侧边栏 (桌面端 + 移动端抽屉) */}
        <aside className={`
          ${mobileFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'} 
          md:static md:w-56 md:flex-shrink-0 md:bg-transparent md:p-0
        `}>
          {mobileFilterOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-lg font-bold">筛选条件</h2>
              <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
            </div>
          )}

          <div className="space-y-1 divide-y divide-gray-100">
            {/* 折叠面板: 分类 */}
            <details className="group py-4" open>
              <summary className="flex items-center justify-between font-medium text-gray-900 cursor-pointer list-none select-none">
                分类
                <span className="transform group-open:rotate-180 transition-transform duration-200">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </span>
              </summary>
              <div className="pt-4 space-y-2 text-sm text-gray-600 animate-fadeIn">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                    <input 
                      type="radio" 
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => setFilter({ category: cat })}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* 折叠面板: 价格 */}
            <details className="group py-4" open>
              <summary className="flex items-center justify-between font-medium text-gray-900 cursor-pointer list-none select-none">
                价格区间
                <span className="transform group-open:rotate-180 transition-transform duration-200">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </span>
              </summary>
              <div className="pt-4 animate-fadeIn">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>¥{filters.minPrice}</span>
                  <span>¥10000+</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="mt-2 text-right text-sm font-medium text-gray-900">
                  ¥0 - ¥{filters.maxPrice}
                </div>
              </div>
            </details>
          </div>
          
          {mobileFilterOpen && (
             <button 
               onClick={() => setMobileFilterOpen(false)}
               className="w-full bg-primary text-white py-3 rounded-none font-medium mt-8"
             >
               显示结果
             </button>
          )}
        </aside>

        {/* 商品网格 */}
        <div className="flex-1 min-w-0">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search className="w-8 h-8 mb-3 opacity-20" />
              <p>暂无符合条件的商品</p>
              <button 
                onClick={() => setFilter({ query: '', category: '全部', minPrice: 0, maxPrice: 10000 })}
                className="mt-4 text-primary text-sm font-medium hover:underline"
              >
                清除所有筛选
              </button>
            </div>
          )}

          {/* 简洁分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-16 gap-4 text-sm">
              <button 
                onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className="text-gray-500 disabled:opacity-30 hover:text-primary transition-colors font-medium"
              >
                上一页
              </button>
              <span className="text-gray-400 font-light">
                {pagination.currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setPage(Math.min(totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === totalPages}
                className="text-gray-500 disabled:opacity-30 hover:text-primary transition-colors font-medium"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
