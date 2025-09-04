interface StudentData {
  id: string | number;
  student_name: string;
  student_login: string;
  student_balance?: number;
  [key: string]: unknown;
}

/**
 * Composable для отримання даних студента з Supabase.
 * Повертає реактивний об'єкт studentData, функцію для оновлення та статуси завантаження/помилки.
 */
export function useStudentData() {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  const studentData = ref<StudentData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Отримати дані студента з Supabase за email (student_login)
   */
  async function fetchStudentData() {
    if (!user.value) {
      studentData.value = null;
      error.value = "Користувач не авторизований";
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await client
        .from("students")
        .select("*")
        .eq("student_login", user.value.email)
        .single();

      if (supabaseError) {
        error.value = supabaseError.message;
        studentData.value = null;
      } else {
        studentData.value = data as StudentData;
      }
    } catch (e: any) {
      error.value = e.message || "Невідома помилка";
      studentData.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // Автоматично отримувати дані при зміні користувача
  watch(
    user,
    (newUser) => {
      if (newUser) {
        fetchStudentData();
      } else {
        studentData.value = null;
      }
    },
    { immediate: true }
  );

  return {
    studentData,
    isLoading,
    error,
    fetchStudentData,
  };
}
