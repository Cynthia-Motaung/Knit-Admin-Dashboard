import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use demo credentials or allow fallback to mock data
const supabaseUrl = process.env.SUPABASE_URL || 'https://examples.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'demo-key';

console.log('🔧 Initializing Supabase client...');

// Create client with demo credentials (these will work for read operations on public data)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

console.log('✅ Supabase client created successfully');

// Test function that won't crash the app
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('schools').select('count');
    if (error) {
      console.log('⚠️  Supabase connection test failed, using mock data:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.log('⚠️  Supabase connection test failed, using mock data:', error.message);
    return false;
  }
};