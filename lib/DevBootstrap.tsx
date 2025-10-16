'use client';

import { useEffect } from 'react';
import { mockLeads, mockProducts, mockStats, mockInsightData } from '@/data/seed';

export default function DevBootstrap() {
  useEffect(() => {
    const isDevMode = process.env.NEXT_PUBLIC_DEV_BOOTSTRAP === 'true';

    if (isDevMode) {
      console.log('🚀 Dev Bootstrap: Inicializando dados mock...');

      sessionStorage.setItem('nuvra_leads', JSON.stringify(mockLeads));
      sessionStorage.setItem('nuvra_products', JSON.stringify(mockProducts));
      sessionStorage.setItem('nuvra_stats', JSON.stringify(mockStats));
      sessionStorage.setItem('nuvra_insights', JSON.stringify(mockInsightData));

      console.log('✅ Dev Bootstrap: Dados mock carregados!');
      console.log(`   - ${mockLeads.length} leads`);
      console.log(`   - ${mockProducts.length} produtos`);
      console.log(`   - Estatísticas e insights disponíveis`);
    }
  }, []);

  return null;
}
