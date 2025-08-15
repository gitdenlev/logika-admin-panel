<template>
  <div class="flex min-h-screen font-sans bg-gray-100 text-gray-800">
    <MobileSidebar />
    <Sidebar />

    <main class="flex-1 p-8 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import Sidebar from "@/components/student/Sidebar.vue";
import MobileSidebar from "@/components/student/MobileSidebar.vue";
import { ref, onMounted, watch } from "vue";

// Хуки та клієнти Supabase
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

// Реактивна змінна для зберігання даних профілю студента
const studentProfile = ref(null);

// Функція для отримання даних профілю
async function fetchStudentProfile() {
  if (user.value) {
    const { data, error } = await client
      .from("students")
      .select("student_name")
      .eq("student_login", user.value.email)
      .single();

    if (error) {
      console.error("Помилка отримання даних студента:", error.message);
      studentProfile.value = null;
    } else {
      studentProfile.value = data;
    }
  }
}

// Запускаємо функцію, коли компонент монтується
onMounted(() => {
  fetchStudentProfile();
});

// Спостерігаємо за зміною user, щоб оновлювати дані
watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchStudentProfile();
    } else {
      studentProfile.value = null;
    }
  },
  { immediate: true }
);

async function signOut() {
  const { error } = await client.auth.signOut();
  if (error) {
    console.error("Помилка при виході:", error.message);
  } else {
    router.push("/login");
  }
}
</script>

<style scoped>
/* Додаткові стилі, якщо потрібні */
</style>