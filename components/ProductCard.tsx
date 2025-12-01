import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-lg mb-3">
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            新品
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-gray-900 leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <span className="font-bold text-gray-900 whitespace-nowrap">¥{product.price}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{product.category}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Star className="w-3 h-3 fill-current text-yellow-400" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;