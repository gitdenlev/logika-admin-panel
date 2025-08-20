export default defineNuxtRouteMiddleware(async (to, from) => {
  // Get the current authenticated user
  const user = useSupabaseUser();
  
  // Get Supabase client for database queries
  const client = useSupabaseClient();

  if (!user.value) {
    console.log(
      "Middleware: Користувач не авторизований, перенаправлення на /login."
    );
    return navigateTo("/login");
  }

  // Retrieve student data from Supabase based on user email
  const { data: student, error } = await client
    .from("students")
    .select("student_login")
    .eq("student_login", user.value.email)
    .single();

  // Check if the user is a student
  const isStudent = student !== null;

  // Define allowed paths for students and non-students separately
  const studentPaths = [
    "/student/dashboard",
    "/student/transactions",
    "/student/banks",
    "/student/wishlist",
    "/student/store",
    "/student/army",
  ];

  if (isStudent) {
    // Redirect to student dashboard if user is a student but tries unauthorized path
    if (!studentPaths.includes(to.path)) {
      console.warn(
        `Middleware: Користувач '${user.value.email}' є студентом, але спробував доступ до '${to.path}'. Перенаправлення на /student/dashboard.`
      );
      return navigateTo("/student/dashboard");
    }
  } else {
    // Redirect to access denied page if user is not a student and tries unauthorized path
    if (studentPaths.includes(to.path)) {
      console.warn(
        `Middleware: Користувач '${user.value.email}' не є студентом. Доступ до '${to.path}' заборонено.`
      );
      return navigateTo("/access-denied");
    }
  }

  // Log successful access for the user
  console.log(
    `Middleware: Користувач '${user.value.email}' отримав доступ до '${to.path}'.`
  );
});