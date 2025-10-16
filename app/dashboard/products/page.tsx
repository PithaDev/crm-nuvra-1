'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { mockProducts } from '@/data/seed';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem('nuvra_products');
    const allProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
    setProducts(allProducts);
  }, []);

  const handleGenerateApiKey = (productId: string) => {
    const mockApiKey = `nvr_${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, apiKey: mockApiKey } : p
      )
    );

    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, apiKey: mockApiKey } : p
    );
    sessionStorage.setItem('nuvra_products', JSON.stringify(updatedProducts));
  };

  return (
    <div>
      <Header
        title="Produtos & Serviços"
        subtitle="Gerencie seus produtos e APIs"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onGenerateApiKey={handleGenerateApiKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
