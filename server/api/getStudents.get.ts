import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    // ВАЖЛИВО: serverSupabaseClient повертає Promise, тому потрібен await
    const client = await serverSupabaseClient(event);

    // Виконуємо запит до бази даних
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

    // Якщо це вже createError помилка
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
