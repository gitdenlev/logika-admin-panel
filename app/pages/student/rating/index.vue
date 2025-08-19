<template>
  <NuxtLayout>
    <div class="min-h-screen transition-all duration-500">
      <div class="mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ activeRatingType === 'balance' ? 'Таблиця успіху' : 'Герої донатів' }}
          </h1>
          <div class="flex justify-end">
            <div class="flex items-center gap-2">
              <!-- Balance -->
              <button
                @click="changeRatingType('balance')"
                class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none"
                :class="{
                  'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 text-indigo-600 dark:text-indigo-400':
                    activeRatingType === 'balance',
                  'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400':
                    activeRatingType !== 'balance',
                }"
                title="За балансом"
              >
                <NuxtImg src="/lgk.svg" width="20" />
              </button>

              <!-- Donated -->
              <button
                @click="changeRatingType('donated')"
                class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none"
                :class="{
                  'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 text-indigo-600 dark:text-indigo-400':
                    activeRatingType === 'donated',
                  'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400':
                    activeRatingType !== 'donated',
                }"
                title="За донатами"
              >
                <Icon
                  name="fluent-emoji-high-contrast:military-helmet"
                  size="20"
                  class="text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Таблиця рейтингу -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Позиція
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Студент
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ activeRatingType === 'balance' ? 'Баланс' : 'Донати' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in sortedStudents"
                  :key="student.id"
                  class="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border-b border-gray-100 dark:border-gray-700/50"
                >
                  <!-- Позиція -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      :class="[
                        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                        {
                          'bg-yellow-400 text-white': index === 0,
                          'bg-gray-400 text-white': index === 1,
                          'bg-orange-400 text-white': index === 2,
                          'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300':
                            index > 2,
                        },
                      ]"
                    >
                      {{ index + 1 }}
                    </div>
                  </td>

                  <!-- Ім'я -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 bg-[#7B68EE] rounded-full flex items-center justify-center text-white font-bold text-sm"
                      >
                        {{
                          student.student_name.charAt(0).toUpperCase() +
                          student.student_name.charAt(1).toUpperCase()
                        }}
                      </div>
                      <div class="flex flex-col">
                        <span class="text-base font-medium text-gray-900 dark:text-gray-100">
                          {{ student.student_name }}
                        </span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                          {{ index === 0 ? 'Лідер' : index === 1 ? 'Друге місце' : index === 2 ? 'Третє місце' : `${index + 1} місце` }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Баланс / Донати -->
                  <td class="px-6 py-4 text-right">
                    <div class="flex flex-col items-end gap-1">
                      <div class="flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {{
                          activeRatingType === "balance"
                            ? student.student_balance
                            : student.donated_points
                        }}
                        <NuxtImg src="/lgk.svg" width="18" />
                      </div>
                    
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
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
import { ref, onMounted, computed } from "vue";
import { useSupabaseClient } from "#imports";

// Supabase client instance
const client = useSupabaseClient();

// Reactive state variables
const students = ref([]);
const isLoading = ref(true);
const activeRatingType = ref("balance"); // 'balance' або 'donated'

// Computed property to sort and filter students
const sortedStudents = computed(() => {
  let filteredStudents = [];

  // Фільтруємо студентів, залишаючи лише тих, у кого показник більший за 0
  if (activeRatingType.value === "balance") {
    filteredStudents = students.value.filter(
      (student) => student.student_balance > 0
    );
  } else {
    filteredStudents = students.value.filter(
      (student) => student.donated_points > 0
    );
  }

  // Сортуємо відфільтрованих студентів
  if (activeRatingType.value === "balance") {
    return [...filteredStudents].sort(
      (a, b) => b.student_balance - a.student_balance
    );
  } else {
    return [...filteredStudents].sort(
      (a, b) => b.donated_points - a.donated_points
    );
  }
});

// Function to fetch students data from Supabase
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

// Function to change the rating type and re-fetch data
function changeRatingType(type: string) {
  activeRatingType.value = type;
}

onMounted(() => {
  fetchStudents();
});
</script>