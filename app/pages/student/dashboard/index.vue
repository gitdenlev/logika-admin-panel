<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-100 text-gray-600 font-sans">
      <div>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-600 mb-2">
            Вітаємо,
            <span class="text-[#7B68EE]">{{ studentProfile.name }}</span>
          </h1>
          <p class="text-gray-600">Ось твоя статистика та досягнення.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Блок балансу та рейтингу -->
          <div
            class="bg-white rounded-3xl p-6 shadow-xl block sm:flex items-center justify-between col-span-1 md:col-span-2"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-[#7B68EE]/25 rounded-full flex items-center justify-center animate-pulse"
              >
                <NuxtImg src="/lgk.svg" width="35" />
              </div>

              <div>
                <p class="text-lg text-gray-600">Твій баланс</p>

                <p class="text-4xl font-bold text-[#7B68EE]">
                  {{ studentProfile.balance }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-sm font-semibold text-gray-600 text-left mt-4 lg:mt-0"
              >
                Твоє місце в рейтингу:
              </p>
              <p
                class="rounded-full bg-[#7B68EE] float-left text-xl text-white px-4 py-1 inline-block mt-1"
              >
                #{{ studentProfile.rank }}
              </p>
            </div>
          </div>

          <!-- Блок швидких дій -->
          <div
            class="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between"
          >
            <h3 class="text-xl font-bold text-gray-600 mb-4">Швидкі дії</h3>
            <div class="flex flex-col gap-4">
              <NuxtLink
                to="/student/transactions"
                class="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/95 text-white font-bold py-4 rounded-xl transition-colors duration-300 flex justify-center items-center gap-2 shadow-sm"
              >
                <Icon name="majesticons:money-plus" size="20" />
                <span>Переказати бали</span>
              </NuxtLink>
              <NuxtLink
                to="/student/store"
                class="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-4 rounded-xl transition-colors duration-300 flex justify-center items-center gap-2 shadow-sm"
              >
                <Icon name="lucide:shopping-bag" size="20" />
                <span>Відвідати магазин</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Блок найближчої мети -->
          <div class="bg-white rounded-3xl p-6 shadow-xl">
            <h3 class="text-xl font-bold text-gray-600 mb-4">
              Твоя найближча мета
            </h3>
            <div v-if="nextGoal" class="flex flex-col items-center">
              <Icon
                :name="nextGoal.icon"
                size="60"
                class="text-[#7B68EE] mb-3"
              />
              <p class="text-lg font-bold text-gray-600">{{ nextGoal.name }}</p>
              <p class="text-sm text-gray-600">{{ nextGoal.price }} балів</p>
              <p class="text-xs text-green-500 mt-2">Вже доступно!</p>
            </div>
            <div v-else class="text-center text-gray-600 py-4">
              <p>Заробляй бали, щоб купити щось круте!</p>
              <NuxtLink
                to="/student/store"
                class="mt-2 inline-block text-[#7B68EE] hover:text-[#7B68EE]/90 font-semibold"
              >
                Перейти до магазину
              </NuxtLink>
            </div>
          </div>

          <!-- Блок досягнень -->
          <div
            class="cursor-not-allowed bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,0,0.15)_0px,rgba(255,255,0,0.15)_10px,transparent_10px,transparent_20px)] pointer-events-none"
            ></div>

            <h3 class="text-xl font-bold text-gray-600 mb-4 relative z-10">
              Твої досягнення
            </h3>
            <div
              class="mt-8 mx-auto flex flex-col items-center justify-center relative z-10"
            >
              <Icon
                name="fluent-emoji-high-contrast:building-construction"
                size="50"
                class="text-yellow-500"
              />
              <p class="text-gray-600 font-medium mt-2 italic">
                Поки в розробці...
              </p>
            </div>
          </div>

          <!-- Блок допомоги ЗСУ -->
          <div class="bg-white rounded-3xl p-6 shadow-xl">
            <h3 class="text-xl font-bold text-gray-600 mb-4">Допомога ЗСУ</h3>
            <p class="font-semibold text-gray-600 mb-2 text-xl">
              Твій внесок складає:
              <span class="flex items-center gap-1 text-[#7B68EE] text-2xl"
                >{{ armyDonation.current }}
                <NuxtImg src="/lgk.svg" width="20"
              /></span>
            </p>

            <p class="text-xs text-gray-600 mb-4">{{ armyDonation.message }}</p>
            <NuxtLink
              to="/student/army"
              class="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/90 text-white font-bold py-5 rounded-xl transition-colors duration-300 flex justify-center items-center gap-2 text-xl"
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
import { ref, onMounted, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";

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

    // 3. Отримання товарів з магазину для найближчої мети
    await fetchStoreItems();

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
    console.error("Помилка отримання списку студентів:", allStudentsError.message);
    return;
  }

  const userIndex = allStudents.findIndex(
    (s) => s.student_name === studentProfile.value.name
  );
  studentProfile.value.rank = userIndex !== -1 ? userIndex + 1 : 0;
}

// Функція для отримання товарів магазину
async function fetchStoreItems() {
  const { data: storeData, error: storeError } = await client
    .from("store_items")
    .select("name, price, icon")
    .order("price", { ascending: true });

  if (storeError) {
    console.error("Помилка отримання товарів магазину:", storeError.message);
    return;
  }
  
  storeItems.value = storeData;
  findNextGoal();
}

// Функція для визначення найближчої мети
function findNextGoal() {
  const affordableItem = storeItems.value.find(
    (item) => item.price <= studentProfile.value.balance
  );
  nextGoal.value = affordableItem || null;
}

onMounted(() => {
  fetchDashboardData();
});

watch(user, (newUser) => {
  if (newUser) {
    fetchDashboardData();
  }
});
</script>