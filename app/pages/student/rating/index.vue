<template>
  <NuxtLayout>
    <div class="min-h-screen transition-all duration-500">
      <div class="mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-600 dark:text-gray-100">
            {{
              activeRatingType === "balance"
                ? "Таблиця успіху"
                : "Герої донатів"
            }}
          </h1>
          <StudentRatingTypeSwitcher v-model="activeRatingType" />
        </div>

        <div class="fixed inset-0" v-if="isLoading">
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Loader />
          </div>
        </div>
        <StudentRatingTable
          v-else
          :students="sortedStudents"
          :rating-type="activeRatingType"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAsyncData } from "#app";

useHead({
  title: "Рейтинг",
  meta: [
    {
      name: "description",
      content: "Статистика, рейтинг, досягнення та магазини ЛКГ",
    },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/logika-invest-logo.svg" },
    { rel: "apple-touch-icon", href: "/logika-invest-logo.svg" },
  ],
});

const { data: students, pending: isLoading } = await useAsyncData(
  "rating-fetch",
  () => $fetch("/api/getRating")
);

const activeRatingType = ref<"balance" | "donated">("balance");

const sortedStudents = computed(() => {
  if (!students.value) {
    return [];
  }
  const property =
    activeRatingType.value === "balance" ? "student_balance" : "total_donated";

  const filtered = students.value.filter((student) => student[property] > 0);

  return [...filtered].sort((a, b) => b[property] - a[property]);
});
</script>
