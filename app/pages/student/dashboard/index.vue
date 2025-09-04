<template>
  <NuxtLayout>
    <!-- ВИПРАВЛЕНО: Замість жорстких кольорів використовуємо responsive класи -->
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-sans transition-colors duration-200"
    >
      <div>
        <div class="mb-8">
          <h1
            class="text-3xl font-bold text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-200"
          >
            Вітаємо,
            <span class="text-[#7B68EE] dark:text-[#8B7EFF]">{{
              studentProfile.name
            }}</span>
          </h1>
          <p
            class="text-gray-600 dark:text-gray-400 transition-colors duration-200"
          >
            Ось твоя статистика та досягнення.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Блок балансу та рейтингу -->
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-gray-900/20 block sm:flex items-center justify-between col-span-1 md:col-span-2 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-[#7B68EE]/25 dark:bg-[#8B7EFF]/30 rounded-full flex items-center justify-center animate-pulse transition-colors duration-200"
              >
                <NuxtImg src="/lgk.svg" width="35" />
              </div>

              <div>
                <p
                  class="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200"
                >
                  Твій баланс
                </p>
                <p
                  class="text-4xl font-bold text-[#7B68EE] dark:text-[#8B7EFF] transition-colors duration-200"
                >
                  {{ studentProfile.balance }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-sm font-semibold text-gray-600 dark:text-gray-300 text-left mt-4 lg:mt-0 transition-colors duration-200"
              >
                Твоє місце в рейтингу:
              </p>
              <p
                class="rounded-full bg-[#7B68EE] dark:bg-[#8B7EFF] float-left text-xl text-white px-4 py-1 inline-block mt-1 transition-colors duration-200"
              >
                #{{ studentProfile.rank }}
              </p>
            </div>
          </div>

          <!-- Блок швидких дій -->
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-gray-900/20 flex flex-col justify-between transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-xl font-bold text-gray-600 dark:text-gray-200 mb-4 transition-colors duration-200"
            >
              Швидкі дії
            </h3>
            <div class="flex flex-col gap-4">
              <NuxtLink
                to="/student/transactions"
                class="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/95 dark:bg-[#8B7EFF] dark:hover:bg-[#8B7EFF]/95 text-white font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <Icon name="majesticons:money-plus" size="20" />
                <span>Переказати бали</span>
              </NuxtLink>
              <NuxtLink
                to="/student/store"
                class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <Icon name="lucide:shopping-bag" size="20" />
                <span>Відвідати магазин</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Блок найближчої мети -->
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-gray-900/20 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-xl font-bold text-gray-600 dark:text-gray-200 mb-4 transition-colors duration-200"
            >
              Твоя найближча мета
            </h3>
            <div v-if="nextGoal" class="flex flex-col items-center">
              <div class="relative mb-3">
                <Icon
                  :name="nextGoal.icon"
                  size="60"
                  class="text-[#7B68EE] dark:text-[#8B7EFF] transition-colors duration-200"
                />
                <!-- Індикатор прогресу -->
                <div
                  v-if="!nextGoal.isAffordable"
                  class="absolute -bottom-1 -right-1"
                >
                  <div
                    class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                  >
                    <Icon name="lucide:clock" size="12" class="text-white" />
                  </div>
                </div>
                <div v-else class="absolute -bottom-1 -right-1">
                  <div
                    class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Icon name="lucide:check" size="12" class="text-white" />
                  </div>
                </div>
              </div>

              <p
                class="text-lg font-bold text-gray-600 dark:text-gray-200 text-center transition-colors duration-200"
              >
                {{ nextGoal.name }}
              </p>

              <div class="flex items-center gap-1 mt-1">
                <p
                  class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                >
                  {{ nextGoal.price }}
                </p>
                <NuxtImg src="/lgk.svg" width="12" />
              </div>

              <!-- Прогрес бар -->
              <div class="w-full">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ Math.min(studentProfile.balance, nextGoal.price) }} /
                    {{ nextGoal.price }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{
                      Math.round(
                        (Math.min(studentProfile.balance, nextGoal.price) /
                          nextGoal.price) *
                          100
                      )
                    }}%
                  </span>
                </div>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                >
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="
                      nextGoal.isAffordable
                        ? 'bg-green-500'
                        : 'bg-[#7B68EE] dark:bg-[#8B7EFF]'
                    "
                    :style="{
                      width: `${Math.min(
                        (studentProfile.balance / nextGoal.price) * 100,
                        100
                      )}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <div
              v-else-if="storeItems.length === 0"
              class="text-center text-gray-600 dark:text-gray-400 py-8 transition-colors duration-200"
            >
              <Icon
                name="lucide:package"
                size="40"
                class="mx-auto mb-3 opacity-50"
              />
              <p class="font-medium">Наразі немає товарів у магазині</p>
              <p class="text-sm mt-1">Завітайте пізніше!</p>
            </div>

            <div
              v-else
              class="text-center text-gray-600 dark:text-gray-400 py-8 transition-colors duration-200"
            >
              <Icon
                name="lucide:target"
                size="40"
                class="mx-auto mb-3 opacity-50"
              />
              <p class="font-medium">Заробляй бали, щоб купити щось круте!</p>
              <NuxtLink
                to="/student/store"
                class="mt-3 inline-block text-[#7B68EE] dark:text-[#8B7EFF] hover:text-[#7B68EE]/90 dark:hover:text-[#8B7EFF]/90 font-semibold transition-colors duration-300"
              >
                Перейти до магазину →
              </NuxtLink>
            </div>
          </div>

          <!-- Блок досягнень -->
          <div
            class="cursor-not-allowed bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-gray-900/20 relative overflow-hidden transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div
              class="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,0,0.15)_0px,rgba(255,255,0,0.15)_10px,transparent_10px,transparent_20px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,0,0.1)_0px,rgba(255,255,0,0.1)_10px,transparent_10px,transparent_20px)] pointer-events-none"
            ></div>

            <h3
              class="text-xl font-bold text-gray-600 dark:text-gray-200 mb-4 relative z-10 transition-colors duration-200"
            >
              Твої досягнення
            </h3>
            <div
              class="mt-8 mx-auto flex flex-col items-center justify-center relative z-10"
            >
              <Icon
                name="emojione:construction"
                size="50"
                class="text-yellow-500 dark:text-yellow-400 transition-colors duration-200"
              />
              <p
                class="text-gray-600 dark:text-gray-400 font-medium mt-2 italic transition-colors duration-200"
              >
                Поки в розробці...
              </p>
            </div>
          </div>

          <!-- Блок допомоги ЗСУ -->
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-gray-900/20 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-xl font-bold text-gray-600 dark:text-gray-200 mb-4 transition-colors duration-200"
            >
              Допомога ЗСУ
            </h3>
            <p
              class="font-semibold text-gray-600 dark:text-gray-300 mb-2 text-xl transition-colors duration-200"
            >
              Твій внесок складає:
              <span
                class="flex items-center gap-1 text-[#7B68EE] dark:text-[#8B7EFF] text-2xl transition-colors duration-200"
                >{{ armyDonation.current }} <NuxtImg src="/lgk.svg" width="20"
              /></span>
            </p>

            <p
              class="text-xs text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200"
            >
              Дякуємо за підтримку нашої армії!
            </p>
            <NuxtLink
              to="/student/army"
              class="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/90 dark:bg-[#8B7EFF] dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-5 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-xl hover:shadow-lg hover:scale-[1.02]"
            >
              <Icon name="lucide:arrow-right-circle" size="25" />
              <span>Зробити внесок</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Дашборд",
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

import { ref, computed, onMounted, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";
import { products as staticProducts } from "@/constants/student/products";

const user = useSupabaseUser();
const client = useSupabaseClient();

// Реактивні змінні для реальних даних
const studentProfile = ref({
  name: "Завантаження...",
  balance: 0,
  rank: 0,
});

const storeItems = ref([]);
const nextGoal = ref(null);

const armyDonation = ref({
  current: 0,
});

// Обчислювані властивості для наступних цілей
const upcomingGoals = computed(() => {
  if (!storeItems.value.length) return [];

  const currentBalance = studentProfile.value.balance;
  return storeItems.value
    .filter((item) => item.price > currentBalance)
    .sort((a, b) => a.price - b.price)
    .map((item) => ({
      ...item,
      pointsToReach: item.price - currentBalance,
    }))
    .slice(1, 4); // Пропускаємо першу (це nextGoal) і беремо наступні 3
});

// Функція для отримання всіх даних дашборду
async function fetchDashboardData() {
  if (!user.value) {
    return;
  }

  try {
    // 1. Отримання даних поточного користувача
    const { data: studentData, error: studentError } = await client
      .from("students")
      .select("student_name, student_balance, student_login, donated_points")
      .eq("student_login", user.value.email)
      .single();

    if (studentError) {
      console.error("Помилка отримання даних студента:", studentError.message);
      return;
    }

    studentProfile.value.name = studentData.student_name;
    studentProfile.value.balance = studentData.student_balance;
    armyDonation.value.current = studentData.donated_points || 0;

    // 2. Отримання рейтингу
    await fetchUserRank();

    // 3. Завантаження товарів з константів
    loadStoreItems();
  } catch (error) {
    console.error("Загальна помилка отримання даних:", error);
  }
}

// Функція для отримання рейтингу користувача
async function fetchUserRank() {
  const { data: allStudents, error: allStudentsError } = await client
    .from("students")
    .select("student_name, student_balance")
    .order("student_balance", { ascending: false });

  if (allStudentsError) {
    console.error(
      "Помилка отримання списку студентів:",
      allStudentsError.message
    );
    return;
  }

  const userIndex = allStudents.findIndex(
    (s) => s.student_name === studentProfile.value.name
  );
  studentProfile.value.rank = userIndex !== -1 ? userIndex + 1 : 0;
}

// Функція для завантаження товарів з константів
function loadStoreItems() {
  try {
    storeItems.value = staticProducts.value.map((product) => ({
      name: product.name,
      price: product.price,
      icon: product.icon,
      description: product.description,
    }));

    findNextGoal();
  } catch (error) {
    console.error("Помилка завантаження товарів:", error);
    storeItems.value = [];
  }
}

// Функція для визначення найближчої мети
function findNextGoal() {
  if (!storeItems.value.length) {
    nextGoal.value = null;
    return;
  }

  const currentBalance = studentProfile.value.balance;
  const sortedItems = [...storeItems.value].sort((a, b) => a.price - b.price);

  // Шукаємо найдешевший товар, який коштує більше ніж поточний баланс
  const nextUnavailableItem = sortedItems.find(
    (item) => item.price > currentBalance
  );

  if (nextUnavailableItem) {
    // Знайшли наступну ціль
    nextGoal.value = {
      ...nextUnavailableItem,
      pointsToReach: nextUnavailableItem.price - currentBalance,
      isAffordable: false,
    };
  } else {
    // Усі товари доступні - показуємо найдорожчий як досягнуту ціль
    if (sortedItems.length > 0) {
      const mostExpensiveItem = sortedItems[sortedItems.length - 1];
      nextGoal.value = {
        ...mostExpensiveItem,
        pointsToReach: 0,
        isAffordable: true,
      };
    } else {
      nextGoal.value = null;
    }
  }
}

onMounted(() => {
  fetchDashboardData();
});

watch(user, (newUser) => {
  if (newUser) {
    fetchDashboardData();
  }
});

// Слідкуємо за зміною балансу для оновлення цілей
watch(
  () => studentProfile.value.balance,
  () => {
    if (storeItems.value.length > 0) {
      findNextGoal();
    }
  }
);
</script>
