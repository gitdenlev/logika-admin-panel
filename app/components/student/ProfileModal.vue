<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Мій профіль
        </DialogTitle>
        <DialogDescription class="text-gray-500 dark:text-gray-400">
          Основна інформація про ваш акаунт.
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col space-y-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-[#7B68EE] dark:bg-[#8B7EFF] transition-colors duration-200"
        >
          {{ getInitials(studentProfile?.student_name) }}
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {{ studentProfile?.student_name || "Невідомий користувач" }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Курс</p>
            <p class="text-gray-800 dark:text-gray-200 font-semibold">
              {{ studentProfile?.student_course || "Не визначено" }}
            </p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400 font-medium">
              Час занять
            </p>
            <p class="text-gray-800 dark:text-gray-200 font-semibold">
              {{ studentProfile?.student_schedule || "Не визначено" }}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

interface Emits {
  "update:open": [value: boolean];
}

const emit = defineEmits<Emits>();

const user = useSupabaseUser();
const client = useSupabaseClient();
const studentProfile = ref<any>(null);

// НОВА ФУНКЦІЯ: для отримання ініціалів
function getInitials(name: string | null): string {
  if (!name) return "NN";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  } else if (parts.length === 1 && parts[0]) {
    return parts[0].charAt(0).toUpperCase();
  }
  return "NN";
}

const handleOpenChange = (value: boolean) => {
  console.log("ProfileModal: handleOpenChange called with:", value);
  emit("update:open", value);
};

const closeModal = () => {
  console.log("ProfileModal: closeModal called");
  emit("update:open", false);
};

async function fetchStudentProfile() {
  console.log(
    "ProfileModal: fetchStudentProfile called, user:",
    user.value?.email
  );

  if (!user.value) {
    console.log("ProfileModal: Користувач не авторизований");
    return;
  }

  try {
    const { data, error } = await client
      .from("students")
      .select("student_name, student_course, student_balance, student_schedule")
      .eq("student_login", user.value.email)
      .single();

    if (error) {
      console.error(
        "ProfileModal: Помилка отримання даних студента:",
        error.message
      );
      studentProfile.value = {
        student_name: "Невідомий користувач",
        student_course: "Не визначено",
        student_balance: 0,
        student_schedule: "Не визначено",
      };
    } else {
      console.log("ProfileModal: Дані студента отримано:", data);
      studentProfile.value = data;
    }
  } catch (err) {
    console.error("ProfileModal: Виняток при отриманні даних:", err);
    studentProfile.value = {
      student_name: "Невідомий користувач",
      student_course: "Не визначено",
      student_balance: 0,
      student_schedule: "Не визначено",
    };
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    console.log("ProfileModal: Modal open state changed to:", isOpen);
    if (isOpen) {
      await fetchStudentProfile();
    }
  },
  { immediate: false }
);

watch(
  user,
  async (newUser) => {
    console.log("ProfileModal: User changed:", newUser?.email);
    if (newUser && props.open) {
      await fetchStudentProfile();
    } else if (!newUser) {
      studentProfile.value = null;
    }
  },
  { immediate: true }
);
</script>