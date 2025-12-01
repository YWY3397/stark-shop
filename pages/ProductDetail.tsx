import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Plus, Minus, ChevronDown } from 'lucide-react';
import { fetchProductById } from '../services/mockData';
import { Product } from '../types';
import { useStore } from '../store';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen }) => (
  <details className="group border-b border-gray-100" open={defaultOpen}>
    <summary className="flex items-center justify-between py-4 cursor-pointer list-none select-none text-gray-900 font-medium hover:text-primary transition-colors">
      {title}
      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
    </summary>
    <div className="pb-4 text-sm text-gray-600 leading-relaxed text-justify animate-fadeIn">
      {children}
    </div>
  </details>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const { addToCart } = useStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (id) {
        const data = await fetchProductById(id);
        setProduct(data || null);
        if (data && data.variants) {
          const defaults: Record<string, string> = {};
          data.variants.forEach(v => {
            defaults[v.name] = v.options[0];
          });
          setSelectedVariants(defaults);
        }
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-medium text-gray-900">未找到商品</h2>
      <Link to="/" className="text-sm text-primary hover:underline">返回商城</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* 左侧图片区域 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden aspect-[4/3] lg:aspect-square">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-gray-50 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={`https://image.pollinations.ai/prompt/iron%20man%20tech%20detail%20${product.id}${i}?width=200&height=200&nodelay=true`} 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* 右侧信息区域 */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {product.category}
              </span>
              {product.isNew && (
                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-sm uppercase">NEW</span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-4 text-sm">
               <span className="text-xl font-medium text-gray-900">¥{product.price}</span>
               <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-medium text-gray-900">{product.rating}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8 flex-1">
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  {variant.name}: <span className="text-gray-900">{selectedVariants[variant.name]}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleVariantChange(variant.name, option)}
                      className={`
                        px-3 py-1.5 text-sm border rounded-md transition-all
                        ${selectedVariants[variant.name] === option 
                          ? 'border-primary bg-primary text-white shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                        }
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 mb-10">
            <button 
              onClick={() => addToCart(product, selectedVariants)}
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-none font-medium hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-between group"
            >
              <span>加入购物车</span>
              <span className="group-hover:translate-x-1 transition-transform">¥{(product.price).toFixed(2)} &rarr;</span>
            </button>
          </div>

          {/* 折叠信息区：简洁高效 */}
          <div className="border-t border-gray-100">
            <AccordionItem title="商品描述" defaultOpen>
              {product.description}
            </AccordionItem>
            <AccordionItem title="规格参数">
              <ul className="list-disc pl-4 space-y-1">
                <li>材质：钛合金/纳米材料</li>
                <li>动力源：小型冷聚变反应堆</li>
                <li>操作系统：J.A.R.V.I.S / F.R.I.D.A.Y</li>
                <li>产地：美国斯塔克工业实验室</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="物流与配送">
              <p>所有订单均通过斯塔克工业专用物流通道配送。大中华区预计 1-2 个工作日送达。支持次日达服务。</p>
            </AccordionItem>
            <AccordionItem title="售后保障">
               <p>享受斯塔克工业终身维保服务。任何非人为战损，均可申请免费修复或更换核心组件。</p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;