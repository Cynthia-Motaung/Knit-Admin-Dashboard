import { supabase } from './config/supabase.js';

async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('schools').select('count');
    
    if (error) {
      console.log('Database connection test failed. Please run the SQL schema first.');
      console.log('Error:', error.message);
    } else {
      console.log('✅ Database connection successful!');
      console.log('📊 Existing schools count:', data);
    }
  } catch (error) {
    console.log('❌ Database setup failed:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. You have created the Supabase tables using the provided SQL schema');
    console.log('2. Your .env file has correct SUPABASE_URL and SUPABASE_SERVICE_KEY');
    console.log('3. Your Supabase project is running');
  }
}

setupDatabase();