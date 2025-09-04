<template>
  <NuxtLayout>
    <div class="min-h-screen transition-all duration-500">
      <div class="mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-600 dark:text-gray-100">
            {{ activeRatingType === 'balance' ? 'Таблиця успіху' : 'Герої донатів' }}
          </h1>
          <StudentRatingTypeSwitcher v-model="activeRatingType" />
        </div>

        <div v-if="isLoading">
          <!-- Можна додати компонент завантажувача -->
          <p>Завантаження...</p>
        </div>
        <StudentRatingTable v-else :students="sortedStudents" :rating-type="activeRatingType" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStudents } from '~/composables/useStudents';

useHead({
  title: "Рейтинг",
  meta: [
    { name: "description", content: "Статистика, рейтинг, досягнення та магазини ЛКГ" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/logika-invest-logo.svg" },
    { rel: "apple-touch-icon", href: "/logika-invest-logo.svg" },
  ],
});

const { students, isLoading, fetchStudents } = useStudents();
const activeRatingType = ref<'balance' | 'donated'>("balance");

const sortedStudents = computed(() => {
  const property = activeRatingType.value === 'balance' ? 'student_balance' : 'donated_points';
  
  const filtered = students.value.filter(student => student[property] > 0);
  
  return [...filtered].sort((a, b) => b[property] - a[property]);
});

onMounted(() => {
  fetchStudents();
});
</script>
