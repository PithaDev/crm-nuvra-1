'use client';

import { Product } from '@/types';
import { colors } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onGenerateApiKey?: (productId: string) => void;
}

export default function ProductCard({ product, onGenerateApiKey }: ProductCardProps) {
  const IconComponent = (Icons as any)[product.icon] || Icons.Package;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-6 border relative overflow-hidden"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.default,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: product.color }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: product.color + '20',
            }}
          >
            <IconComponent className="w-8 h-8" style={{ color: product.color }} />
          </div>
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              borderColor: colors.border.default,
              color: colors.text.tertiary,
            }}
          >
            {product.category}
          </Badge>
        </div>

        <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
          {product.name}
        </h3>

        <p className="text-sm mb-4" style={{ color: colors.text.tertiary }}>
          {product.description}
        </p>

        <div className="space-y-2 mb-4">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: colors.status.success }}
              />
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: colors.border.default }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
              Preço
            </p>
            <p className="text-lg font-bold" style={{ color: colors.accent.purple }}>
              {product.pricing}
            </p>
          </div>

          {product.apiEnabled && (
            <Button
              onClick={() => onGenerateApiKey?.(product.id)}
              className="gap-2 hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
                color: colors.text.primary,
              }}
            >
              <Key className="w-4 h-4" />
              API Key
            </Button>
          )}
        </div>

        {product.apiKey && (
          <div
            className="mt-4 p-3 rounded-lg"
            style={{ backgroundColor: colors.background.tertiary }}
          >
            <p className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
              Chave API (mock):
            </p>
            <code
              className="text-xs font-mono break-all"
              style={{ color: colors.accent.cyan }}
            >
              {product.apiKey}
            </code>
          </div>
        )}
      </div>
    </motion.div>
  );
}
