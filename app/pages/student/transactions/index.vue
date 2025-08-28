<template>
  <NuxtLayout>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200"
    >
      <div>
        <div class="mb-6">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введіть ім'я студента"
              class="w-full bg-white dark:bg-gray-800 border-2 border-transparent text-gray-800 dark:text-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#7B68EE] dark:focus:border-[#8B7EFF] transition-all duration-300 shadow-sm dark:shadow-gray-900/20"
            />
            <div
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              <Icon name="lucide:search" size="20" />
            </div>
          </div>
        </div>

        <div
          v-if="transactionMessage && transactionStatus === 'error'"
          class="mb-6"
        >
          <div
            class="bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-400 text-red-700 dark:text-red-400 border-l-4 p-4 rounded-r-lg transition-colors duration-200"
          >
            <div class="flex items-center">
              <Icon name="lucide:x-circle" size="20" class="mr-2" />
              <p class="font-medium">{{ transactionMessage }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="!searchQuery && !selectedRecipient"
          class="mt-8 text-center transition-colors duration-200"
        >
          <Icon
            name="lucide:arrow-up-circle"
            size="48"
            class="text-[#7B68EE] dark:text-[#8B7EFF] mb-4 animate-bounce"
          />
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-400">
            Почни шукати друга, щоб надіслати логіки!
          </p>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Логіки — це не тільки нагорода, а й можливість ділитися.
          </p>
        </div>

        <div v-if="searchQuery" class="mb-8 w-full">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="student in filteredStudents"
              :key="student.id"
              @click="selectRecipient(student)"
              class="bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-gray-900/20"
              :class="{
                'ring-2 ring-purple-500 dark:ring-[#8B7EFF] shadow-lg':
                  selectedRecipient && selectedRecipient.id === student.id,
              }"
            >
              <div
                class="w-12 h-12 bg-[#7B68EE] dark:bg-[#8B7EFF] rounded-full flex items-center justify-center mb-2 text-xl font-bold text-white transition-colors duration-200"
              >
                {{ getInitials(student.student_name) }}
              </div>
              <p class="text-sm font-semibold text-center truncate w-full">
                {{ student.student_name }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="searchQuery && filteredStudents.length === 0"
          class="text-xl text-center text-gray-500 dark:text-gray-400"
        >
          <p>Нічого не знайдено. Спробуй інше ім'я.</p>
        </div>

        <div v-if="selectedRecipient">
          <div
            v-if="!showSuccessView"
            class="bg-white dark:bg-gray-800 w-full md:w-2/3 lg:w-1/2 mx-auto rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-gray-900/20 flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div class="w-full flex items-center justify-between gap-4 mb-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 bg-[#7B68EE] dark:bg-[#8B7EFF] rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 transition-colors duration-200"
                >
                  {{ getInitials(selectedRecipient.student_name) }}
                </div>
                <p class="text-xl font-semibold text-gray-600 dark:text-gray-300 truncate">
                  {{ selectedRecipient.student_name }}
                </p>
              </div>
            </div>

            <div class="w-full flex flex-col items-center mt-6">
              <div
                class="flex gap-1 text-sm text-gray-500 dark:text-gray-300 mb-2 rounded-full px-2 py-1 bg-[#7B68EE]/30 dark:bg-[#8B7EFF]/30 transition-colors duration-200"
              >
                <span class="flex items-center gap-1"
                  >Доступно: {{ studentProfile?.student_balance || 0 }}
                  <NuxtImg src="/lgk.svg" width="15"
                /></span>
              </div>

              <div class="relative w-full my-4">
                <div class="flex items-center justify-center w-full">
                  <input
                    type="number"
                    v-model="amount"
                    placeholder="0"
                    min="1"
                    :max="studentProfile?.student_balance"
                    class="w-full bg-transparent border-none text-gray-800 dark:text-gray-200 text-6xl font-bold text-center p-2 focus:outline-none focus:ring-0 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div class="flex gap-2 mb-4">
                <button
                  v-for="quickAmount in quickAmounts"
                  :key="quickAmount"
                  @click="amount = quickAmount"
                  :disabled="
                    quickAmount > (studentProfile?.student_balance || 0)
                  "
                  class="cursor-pointer px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-[#7B68EE] dark:hover:bg-[#8B7EFF] hover:text-white dark:hover:text-white rounded-full text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  {{ quickAmount }}
                </button>
              </div>

              <div class="h-6 mb-2">
                <p
                  v-if="amount > studentProfile?.student_balance"
                  class="text-sm font-medium text-center text-red-500 dark:text-red-400"
                >
                  {{ randomMessage }}
                </p>
              </div>

              <button
                @click="sendTransaction"
                :disabled="
                  !amount ||
                  amount <= 0 ||
                  amount > (studentProfile?.student_balance || 0) ||
                  isLoading
                "
                class="cursor-pointer w-full bg-[#7B68EE] dark:bg-[#8B7EFF] hover:bg-[#7B68EE]/80 dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-4 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-4 relative"
              >
                <span v-if="!isLoading" class="text-lg">Надіслати</span>
                <div v-else class="flex items-center justify-center gap-2">
                  <div
                    class="w-4 h-4 border-2 border-white dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"
                  ></div>
                  <span class="text-lg">Відправляємо...</span>
                </div>
              </button>
            </div>
          </div>

          <div
            v-if="showSuccessView"
            class="bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900 w-full md:w-2/3 lg:w-1/2 mx-auto rounded-3xl shadow-2xl dark:shadow-gray-900/50 flex flex-col items-center justify-center transition-all duration-500 min-h-[500px] relative overflow-hidden"
          >
            <h2
              class="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4 z-10"
            >
              Успішно!
            </h2>

            <Icon
              name="lucide:check-circle-2"
              class="text-green-500 dark:text-green-400 animate-pulse z-10"
              size="100"
            />

            <p
              class="mt-6 text-lg text-gray-700 dark:text-gray-300 text-center max-w-sm z-10"
            >
              Ти передав(ла) свої бали іншому учню!
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Транзакції",
  meta: [
    { name: "description", content: "транзакції" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/logika-invest-logo.svg" },
    { rel: "apple-touch-icon", href: "/logika-invest-logo.svg" },
  ],
});

import { useTransactions } from "~/composables/useTransactions";
import { getInitials } from "~/utils/formatters";

const {
  amount,
  searchQuery,
  selectedRecipient,
  studentProfile,
  isLoading,
  transactionMessage,
  transactionStatus,
  showSuccessView,
  quickAmounts,
  randomMessage,
  filteredStudents,
  selectRecipient,
  sendTransaction,
} = useTransactions();

definePageMeta({
  middleware: ["admin-auth"],
});
</script>

<style scoped>
/* Ваші стилі залишаються без змін */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>