import { createClient } from '@supabase/supabase-js';
import { seedData } from '../data/seed';

async function seedDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  console.log('🌱 Starting database seed...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('\n📦 Seeding products...');
    let productsInserted = 0;
    let productsSkipped = 0;

    for (const product of seedData.products) {
      const { error } = await supabase
        .from('products')
        .insert(product);

      if (error) {
        if (error.message.includes('duplicate') || error.code === '23505') {
          productsSkipped++;
          console.log(`  ⏭️  Skipped: ${product.name} (already exists)`);
        } else {
          console.error(`  ❌ Error inserting ${product.name}:`, error.message);
        }
      } else {
        productsInserted++;
        console.log(`  ✅ Inserted: ${product.name}`);
      }
    }

    console.log(`\n📊 Products: ${productsInserted} inserted, ${productsSkipped} skipped`);

    console.log('\n👥 Seeding leads...');
    let leadsInserted = 0;
    let leadsSkipped = 0;

    for (const lead of seedData.leads) {
      const { error } = await supabase
        .from('leads')
        .insert(lead);

      if (error) {
        if (error.message.includes('duplicate') || error.code === '23505') {
          leadsSkipped++;
          console.log(`  ⏭️  Skipped: ${lead.name} (already exists)`);
        } else {
          console.error(`  ❌ Error inserting ${lead.name}:`, error.message);
        }
      } else {
        leadsInserted++;
        console.log(`  ✅ Inserted: ${lead.name}`);
      }
    }

    console.log(`\n📊 Leads: ${leadsInserted} inserted, ${leadsSkipped} skipped`);

    console.log('\n✅ Database seed completed successfully!');
    console.log(`\n📈 Total: ${productsInserted + leadsInserted} records inserted`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
