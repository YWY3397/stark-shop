import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

const Navbar: React.FC = () => {
  const { toggleCart, cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <Package className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-wide text-primary">斯塔克商城</span>
          </Link>
          
          <button 
            onClick={toggleCart}
            className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-800" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-primary rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;