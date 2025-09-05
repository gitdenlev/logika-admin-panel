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

    const { studentId, amount } = await readBody(event);

    if (!studentId || !amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Некоректні дані для донату.",
      });
    }

    // 1. Отримати поточний баланс студента та поточні донати
    const { data: studentProfile, error: fetchStudentError } = await client
      .from("students")
      .select("student_balance, total_donated, monthly_donated")
      .eq("id", studentId)
      .single();

    if (fetchStudentError) {
      console.error("Помилка отримання даних студента:", fetchStudentError);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при отриманні даних студента.",
        data: fetchStudentError,
      });
    }

    if (studentProfile.student_balance < amount) {
      throw createError({
        statusCode: 400,
        statusMessage: "Недостатньо балів на рахунку студента.",
      });
    }

    const newBalance = studentProfile.student_balance - amount;
    const newTotalDonated = studentProfile.total_donated + amount;
    const newMonthlyDonated = studentProfile.monthly_donated + amount;

    // 2. Оновити дані студента
    const { error: updateStudentError } = await client
      .from("students")
      .update({
        student_balance: newBalance,
        total_donated: newTotalDonated,
        monthly_donated: newMonthlyDonated,
      })
      .eq("id", studentId);

    if (updateStudentError) {
      console.error("Помилка оновлення даних студента:", updateStudentError);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при оновленні даних студента.",
        data: updateStudentError,
      });
    }

    // 3. Оновити загальну та місячну суму донатів на ЗСУ
    const { data: zsuDonations, error: fetchZsuError } = await client
      .from("zsu_donations")
      .select("total_points, donated_monthly")
      .eq("id", 1)
      .single();

    if (fetchZsuError) {
      console.error("Помилка отримання даних ZSU донатів:", fetchZsuError);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при отриманні даних ZSU донатів.",
        data: fetchZsuError,
      });
    }

    const newZsuTotalPoints = zsuDonations.total_points + amount;
    const newZsuMonthlyPoints = (zsuDonations.donated_monthly || 0) + amount;

    const { error: updateZsuError } = await client
      .from("zsu_donations")
      .update({
        total_points: newZsuTotalPoints,
        donated_monthly: newZsuMonthlyPoints,
      })
      .eq("id", 1);

    if (updateZsuError) {
      console.error("Помилка оновлення ZSU донатів:", updateZsuError);
      throw createError({
        statusCode: 500,
        statusMessage: "Помилка при оновленні ZSU донатів.",
        data: updateZsuError,
      });
    }

    return { message: "Донат успішно здійснено!" };
  } catch (err: any) {
    console.error("Помилка сервера при донаті:", err);

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
