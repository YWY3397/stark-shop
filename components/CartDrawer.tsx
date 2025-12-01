import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useStore();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={toggleCart}
      />
      
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-50">
          <h2 className="text-lg font-medium">购物车 ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
          <button onClick={toggleCart} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-10" />
              <p className="text-sm font-medium">您的购物车是空的</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 group">
                <div className="w-20 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                   <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-4">{item.title}</h3>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1 mb-auto">
                    {Object.values(item.selectedVariants).join(' / ')}
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.cartId, -1)}
                        className="p-1 hover:bg-gray-50 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="p-1 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-medium text-sm text-gray-900">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-50 bg-white">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">合计 (不含运费)</span>
              <span className="text-lg font-bold text-gray-900">¥{total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-primary text-white py-3.5 rounded-sm font-medium hover:bg-gray-800 transition-colors">
              立即结算
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;