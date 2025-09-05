import { createError, defineEventHandler } from 'h3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    return createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    // Крок 1: Скидаємо monthly_donated для всіх студентів
    const { error: studentsError } = await supabase
      .from('students')
      .update({ monthly_donated: 0 })
      .neq('monthly_donated', 0);

    if (studentsError) {
      console.error('Error resetting monthly donations for students:', studentsError);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        data: studentsError.message,
      });
    }

    // Крок 2: Скидаємо donated_monthly в таблиці zsu_donations
    const { error: zsuError } = await supabase
      .from('zsu_donations')
      .update({ donated_monthly: 0 })
      .eq('id', 1);

    if (zsuError) {
      console.error('Error resetting monthly donations in zsu_donations:', zsuError);
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        data: zsuError.message,
      });
    }

    return {
      statusCode: 200,
      statusMessage: 'Monthly donations reset successfully',
    };
  } catch (err: any) {
    console.error('An unexpected error occurred:', err);
    return createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred',
      data: err.message,
    });
  }
});
