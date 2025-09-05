import { createError, defineEventHandler } from 'h3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async () => {
  try {
    // Отримуємо загальну та місячну суму донатів з однієї таблиці
    const { data, error } = await supabase
      .from('zsu_donations')
      .select('total_points, donated_monthly')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return {
      totalDonations: data.total_points || 0,
      monthlyDonations: data.donated_monthly || 0,
    };
  } catch (err: any) {
    console.error('Error fetching donation stats:', err);
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch donation statistics',
      data: err.message,
    });
  }
});
