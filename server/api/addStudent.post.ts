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

    const studentData = await readBody(event);

    if (
      !studentData ||
      !studentData.student_name ||
      !studentData.student_login
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Неповні дані для додавання студента.",
      });
    }

    const { data, error } = await client
      .from("students")
      .insert([studentData])
      .select();

    if (error) {
      console.error("Помилка Supabase при додаванні студента:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при збереженні студента в базу даних.",
        data: error,
      });
    }

    return { message: "Студент успішно доданий!", student: data[0] };
  } catch (err: any) {
    console.error("Помилка сервера при додаванні студента:", err);

    if (err.statusCode) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Внутрішня помилка сервера.",
      data: err.message || "Невідома помилка.",
    });
  }
});
