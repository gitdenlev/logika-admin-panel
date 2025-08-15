export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  if (!user.value) {
    console.log(
      "Middleware: Користувач не авторизований, перенаправлення на /login."
    );
    return navigateTo("/login");
  }

  // Робимо запит до вашої таблиці `students`
  const { data: student, error } = await client
    .from("students")
    .select("student_login")
    .eq("student_login", user.value.email)
    .single();

  const isStudent = student !== null;

  // Визначення шляхів, до яких студенти мають доступ
  const studentPaths = [
    "/student/dashboard",
    "/student/transactions", // Додаємо шлях для сторінки транзакцій
    "/student/banks", // Додаємо шлях для сторінки баночок
    "/student/wishlist", // Додаємо шлях для сторінки вішліста
    "/student/store", // Додаємо шлях для сторінки магазину
    "/student/army", // Додаємо шлях для сторінки армії
  ];

  // Логіка перенаправлення
  if (isStudent) {
    if (!studentPaths.includes(to.path)) {
      // Якщо це студент, але він намагається перейти на заборонену сторінку
      console.warn(
        `Middleware: Користувач '${user.value.email}' є студентом, але спробував доступ до '${to.path}'. Перенаправлення на /student/dashboard.`
      );
      return navigateTo("/student/dashboard");
    }
  } else {
    // Якщо користувач не знайдений в таблиці students
    if (studentPaths.includes(to.path)) {
      // Забороняємо доступ до сторінок студента
      console.warn(
        `Middleware: Користувач '${user.value.email}' не є студентом. Доступ до '${to.path}' заборонено.`
      );
      return navigateTo("/access-denied");
    }
  }

  console.log(
    `Middleware: Користувач '${user.value.email}' отримав доступ до '${to.path}'.`
  );
});
