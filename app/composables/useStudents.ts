import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

export function useStudents() {
  const client = useSupabaseClient();
  const students = ref([]);
  const isLoading = ref(true);

  async function fetchStudents() {
    isLoading.value = true;
    try {
      const { data, error } = await client
        .from("students")
        .select("student_name, student_balance, donated_points");

      if (error) {
        console.error("Помилка при отриманні списку студентів:", error.message);
        return;
      }

      students.value = data || [];
    } catch (err) {
      console.error("Загальна помилка при отриманні даних:", err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    students,
    isLoading,
    fetchStudents,
  };
}
