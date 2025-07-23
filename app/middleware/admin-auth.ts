export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    console.log(
      "Middleware: Користувач не авторизований, перенаправлення на /login."
    );
    return navigateTo("/login");
  }

  // Перевірка ролі з user_metadata
  const userRole = user.value.user_metadata?.role;

//   if (userRole !== "admin") {
//     console.warn(
//       `Middleware: Користувач '${user.value.email}' (роль: '${
//         userRole || "відсутня"
//       }') не є адміном. Доступ до '${to.path}' заборонено.`
//     );
//     // Якщо користувач авторизований, але не адмін, перенаправляємо його на сторінку доступу заборонено
//     return navigateTo("/access-denied");
//   }

  console.log(
    `Middleware: Адмін '${user.value.email}' отримав доступ до '${to.path}'.`
  );
});
