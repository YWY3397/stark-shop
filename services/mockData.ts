import { Product } from '../types';

const CATEGORIES = ['MK系列战甲', '反浩克装甲', '反应堆周边', '斯塔克工业'];

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    return {
      id: `prod-${i + 1}`,
      title: `${category} - 钢铁侠限定版 ${i + 1}`,
      price: Math.floor(Math.random() * 5000) + 299,
      category: category,
      image: 'https://picx.zhimg.com/v2-53cb4f66b9c9033ca8a254d295720b0d_r.jpg',
      description: `来自斯塔克工业的顶级工艺，${category}系列 ${i + 1} 号藏品。采用纳米科技涂层，1:1完美复刻，内置微型反应堆LED灯效。致敬托尼·斯塔克的传奇人生，漫威迷不可错过的终极收藏。`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      isNew: Math.random() > 0.8,
      variants: [
        { name: '战甲型号', options: ['Mark 3', 'Mark 42', 'Mark 50', 'Mark 85'] },
        { name: '版本', options: ['标准版', '战损版', '全息版', '合金版'] }
      ]
    };
  });
};

export const MOCK_PRODUCTS = generateProducts(40);

export const fetchProducts = async (delay = 500): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, delay);
  });
};

export const fetchProductById = async (id: string, delay = 300): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS.find(p => p.id === id));
    }, delay);
  });
};