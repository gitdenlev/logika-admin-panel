import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "Supabase URL or Service Role Key not set in environment variables"
      );
    }

    const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await client.from("students").select("*");

    if (error) {
      console.error("Помилка Supabase:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при отриманні студентів з бази даних",
        data: error,
      });
    }

    return data || [];
  } catch (err) {
    console.error("Помилка сервера при отриманні студентів:", err);
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Невідома помилка сервера",
      data: err.message || "Невідома помилка",
    });
  }
});
