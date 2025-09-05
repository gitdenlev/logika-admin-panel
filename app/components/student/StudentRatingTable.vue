<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-500">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-100 uppercase tracking-wider">
              Позиція
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-100 uppercase tracking-wider">
              Студент
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-100 uppercase tracking-wider">
              {{ ratingType === 'balance' ? 'Баланс' : 'Донати' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in students"
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
                    'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300':
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
                  {{ getInitials(student.student_name) }}
                </div>
                <div class="flex flex-col">
                  <span class="text-base font-medium text-gray-600 dark:text-gray-100">
                    {{ student.student_name }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Баланс / Донати -->
            <td class="px-6 py-4 text-right">
              <div class="flex flex-col items-end gap-1">
                <div class="flex items-center gap-1 text-lg font-semibold text-gray-600 dark:text-gray-100">
                  {{
                    ratingType === "balance"
                      ? student.student_balance
                      : student.total_donated
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
</template>

<script setup lang="ts">
defineProps<{
  students: any[];
  ratingType: 'balance' | 'donated';
}>();

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
</script>
