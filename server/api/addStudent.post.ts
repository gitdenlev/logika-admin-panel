import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event); // Отримуємо клієнт Supabase
    const studentData = await readBody(event); // Отримуємо дані про студента з тіла POST-запиту

    // Перевірка на наявність даних
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

    // Додаємо нового студента до таблиці 'students'
    const { data, error } = await client
      .from("students")
      .insert([studentData])
      .select(); // Повертаємо доданий запис

    if (error) {
      console.error("Помилка Supabase при додаванні студента:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при збереженні студента в базу даних.",
        data: error,
      });
    }

    return { message: "Студент успішно доданий!", student: data[0] }; // Повертаємо успішне повідомлення та доданого студента
  } catch (err: any) {
    console.error("Помилка сервера при додаванні студента:", err);

    if (err.statusCode) {
      throw err; // Прокидаємо помилку, якщо вона вже створена через createError
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Внутрішня помилка сервера.",
      data: err.message || "Невідома помилка.",
    });
  }
});
