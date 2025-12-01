import { create } from 'zustand';
import { CartItem, Product, FilterState } from './types';
import { fetchProducts } from './services/mockData';

interface AppState {
  // 商品数据与状态
  products: Product[];
  isLoading: boolean;
  
  // 筛选与分页
  filters: FilterState;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };

  // 购物车状态
  cart: CartItem[];
  isCartOpen: boolean;
  
  // Actions
  initializeProducts: () => Promise<void>;
  setFilter: (partial: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  
  // Cart Actions
  toggleCart: () => void;
  addToCart: (product: Product, variants: Record<string, string>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  
  // Getters (computed)
  getFilteredProducts: () => Product[];
}

export const useStore = create<AppState>((set, get) => ({
  products: [],
  isLoading: false,
  
  filters: {
    query: '',
    category: '全部',
    minPrice: 0,
    maxPrice: 10000,
    sort: 'recommended',
  },
  
  pagination: {
    currentPage: 1,
    itemsPerPage: 8,
  },

  cart: [],
  isCartOpen: false,

  initializeProducts: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchProducts(500);
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error("Failed to load products", error);
      set({ isLoading: false });
    }
  },

  setFilter: (partial) => set((state) => ({
    filters: { ...state.filters, ...partial },
    pagination: { ...state.pagination, currentPage: 1 } // 重置分页
  })),

  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page }
  })),

  // 购物车逻辑
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product, variants) => set((state) => {
    const variantKey = Object.entries(variants)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}:${v}`)
      .join('-');
    
    const cartId = `${product.id}|${variantKey}`;
    const existingItem = state.cart.find(item => item.cartId === cartId);

    if (existingItem) {
      return {
        cart: state.cart.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        isCartOpen: true
      };
    }

    const newItem: CartItem = {
      ...product,
      cartId,
      selectedVariants: variants,
      quantity: 1
    };

    return {
      cart: [...state.cart, newItem],
      isCartOpen: true
    };
  }),

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId)
  })),

  updateQuantity: (cartId, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    })
  })),

  clearCart: () => set({ cart: [] }),

  // 计算过滤后的商品
  getFilteredProducts: () => {
    const state = get();
    const { products, filters } = state;
    const { query, category, minPrice, maxPrice, sort } = filters;

    let result = [...products];

    // 1. 搜索过滤
    if (query) {
      const q = query.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // 2. 分类过滤
    if (category !== '全部') {
      result = result.filter(p => p.category === category);
    }

    // 3. 价格过滤
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 4. 排序
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break; // recommended (default order)
    }

    return result;
  }
}));
