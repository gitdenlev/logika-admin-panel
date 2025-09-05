import { createClient } from '@supabase/supabase-js';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  // Використовуємо сервісний ключ, щоб обійти RLS для публічного рейтингу
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase URL or Service Role Key is not configured.',
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { data, error } = await supabase
      .from('students')
      .select('student_name, student_balance, total_donated');

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching rating data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rating data.',
      data: error.message,
    });
  }
});
