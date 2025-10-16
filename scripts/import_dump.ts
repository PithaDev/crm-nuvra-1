import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface ImportData {
  exported_at: string;
  version: string;
  tables: {
    products: any[];
    leads: any[];
    interactions: any[];
  };
  counts: {
    products: number;
    leads: number;
    interactions: number;
  };
}

async function importDump(filePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  if (!filePath) {
    console.error('❌ Usage: ts-node scripts/import_dump.ts <path-to-backup.json>');
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log('📥 Starting database import...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log(`📂 Import file: ${absolutePath}`);

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const importData: ImportData = JSON.parse(fileContent);

    console.log(`\n📦 Backup info:`);
    console.log(`  Exported at: ${importData.exported_at}`);
    console.log(`  Version: ${importData.version}`);
    console.log(`  Products: ${importData.counts.products}`);
    console.log(`  Leads: ${importData.counts.leads}`);
    console.log(`  Interactions: ${importData.counts.interactions}`);

    console.log('\n📦 Importing products...');
    let productsInserted = 0;
    let productsSkipped = 0;

    for (const product of importData.tables.products) {
      const { error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'id' });

      if (error) {
        console.error(`  ❌ Error importing product ${product.id}:`, error.message);
      } else {
        productsInserted++;
        console.log(`  ✅ Imported: ${product.name}`);
      }
    }

    console.log(`\n📊 Products: ${productsInserted} imported`);

    console.log('\n👥 Importing leads...');
    let leadsInserted = 0;

    for (const lead of importData.tables.leads) {
      const { error } = await supabase
        .from('leads')
        .upsert(lead, { onConflict: 'id' });

      if (error) {
        console.error(`  ❌ Error importing lead ${lead.id}:`, error.message);
      } else {
        leadsInserted++;
        console.log(`  ✅ Imported: ${lead.name}`);
      }
    }

    console.log(`\n📊 Leads: ${leadsInserted} imported`);

    console.log('\n💬 Importing interactions...');
    let interactionsInserted = 0;

    for (const interaction of importData.tables.interactions) {
      const { error } = await supabase
        .from('interactions')
        .upsert(interaction, { onConflict: 'id' });

      if (error) {
        console.error(`  ❌ Error importing interaction ${interaction.id}:`, error.message);
      } else {
        interactionsInserted++;
        console.log(`  ✅ Imported interaction for lead ${interaction.lead_id}`);
      }
    }

    console.log(`\n📊 Interactions: ${interactionsInserted} imported`);

    console.log('\n✅ Database import completed successfully!');
    console.log(`\n📈 Total: ${productsInserted + leadsInserted + interactionsInserted} records imported`);
  } catch (error) {
    console.error('\n❌ Error importing database:', error);
    process.exit(1);
  }
}

const filePath = process.argv[2];
importDump(filePath);
