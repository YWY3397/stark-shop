export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  isNew?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  selectedVariants: Record<string, string>;
  quantity: number;
}

export interface FilterState {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: 'recommended' | 'price-asc' | 'price-desc' | 'rating';
}
