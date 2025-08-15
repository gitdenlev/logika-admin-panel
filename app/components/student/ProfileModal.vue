<!-- ProfileModal.vue - покращена версія з діагностикою -->
<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold">Мій профіль</DialogTitle>
        <DialogDescription>
          Основна інформація про ваш акаунт.
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col items-center space-y-4">
        <Icon name="ion:person-circle-outline" size="80" class="text-gray-400" />
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {{ studentProfile?.student_name || 'Невідомий користувач' }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
        </div>
      </div>

      <div class="space-y-4 pt-4">
        <div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Курс</p>
          <p class="text-gray-800 dark:text-gray-200 font-semibold">
            {{ studentProfile?.student_course || 'Не визначено' }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Баланс балів</p>
          <p class="text-[#7B68EE] font-bold text-xl">{{ studentProfile?.student_balance || 0 }}</p>
        </div>
      </div>

      <DialogFooter class="sm:justify-start pt-4">
        <DialogClose as-child>
          <Button type="button" variant="secondary" @click="closeModal">
            Закрити
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from '#imports';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean]
}>();

const user = useSupabaseUser();
const client = useSupabaseClient();
const studentProfile = ref(null);

// Функція для обробки зміни стану відкриття модального вікна
const handleOpenChange = (value: boolean) => {
  console.log('ProfileModal: handleOpenChange called with:', value);
  emit('update:open', value);
};

// Функція для закриття модального вікна
const closeModal = () => {
  console.log('ProfileModal: closeModal called');
  emit('update:open', false);
};

async function fetchStudentProfile() {
  console.log('ProfileModal: fetchStudentProfile called, user:', user.value?.email);
  if (user.value) {
    try {
      const { data, error } = await client
        .from('students')
        .select('student_name, student_course, student_balance')
        .eq('student_login', user.value.email)
        .single();
      
      if (error) {
        console.error('ProfileModal: Помилка отримання даних студента:', error.message);
      } else {
        console.log('ProfileModal: Дані студента отримано:', data);
        studentProfile.value = data;
      }
    } catch (err) {
      console.error('ProfileModal: Виняток при отриманні даних:', err);
    }
  } else {
    console.log('ProfileModal: Користувач не авторизований');
  }
}

// Відстеження відкриття модального вікна для завантаження даних
watch(() => props.open, (isOpen) => {
  console.log('ProfileModal: Modal open state changed to:', isOpen);
  if (isOpen && user.value) {
    fetchStudentProfile();
  }
});

onMounted(() => {
  console.log('ProfileModal: Component mounted');
  if (user.value) {
    fetchStudentProfile();
  }
});

watch(user, (newUser) => {
  console.log('ProfileModal: User changed:', newUser?.email);
  if (newUser) {
    fetchStudentProfile();
  } else {
    studentProfile.value = null;
  }
}, { immediate: true });
</script>