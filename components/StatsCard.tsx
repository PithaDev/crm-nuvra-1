'use client';

import { LucideIcon } from 'lucide-react';
import { colors } from '@/styles/design-tokens';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
}: StatsCardProps) {
  const changeColors = {
    positive: colors.status.success,
    negative: colors.status.error,
    neutral: colors.text.tertiary,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-6 border cursor-pointer"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.default,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
            {title}
          </p>
          <p className="text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
            {value}
          </p>
          {change && (
            <p className="text-sm font-medium" style={{ color: changeColors[changeType] }}>
              {change}
            </p>
          )}
        </div>

        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: iconColor ? iconColor + '20' : colors.background.tertiary,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor || colors.accent.purple }} />
        </div>
      </div>
    </motion.div>
  );
}
