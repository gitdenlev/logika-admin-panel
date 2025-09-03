<template>
  <NuxtLayout>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200"
    >
      <!-- Блок з балансом та статистикою -->
      <div
        class="fixed bottom-0 right-8 z-999 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <div>
            <h2 class="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">
              Ваш баланс
            </h2>
            <div class="flex items-center gap-1">
              <p class="text-md font-bold text-[#7B68EE] dark:text-[#8B7EFF]">
                {{ studentBalance }}
              </p>
              <NuxtImg src="/lgk.svg" width="15" />
            </div>
          </div>
          <div v-if="currentWishlistCost > 0">
            <h2 class="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">
              Залишок
            </h2>
            <div class="flex items-center gap-1">
              <p class="text-md font-bold text-[#7B68EE] dark:text-[#8B7EFF]">
                {{ studentBalance - currentWishlistCost }}
              </p>
              <NuxtImg src="/lgk.svg" width="15" />
            </div>
          </div>
        </div>

        <!-- Прогрес бар -->
        <div class="mb-4">
          <div
            class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2"
          >
            <span>Використано логіків</span>
            <span
              >{{
                Math.round(
                  (currentWishlistCost / Math.max(studentBalance, 1)) * 100
                )
              }}%</span
            >
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-300"
              :class="
                currentWishlistCost > studentBalance
                  ? 'bg-red-500'
                  : 'bg-[#7B68EE] dark:bg-[#8B7EFF]'
              "
              :style="{
                width: `${Math.min(
                  (currentWishlistCost / Math.max(studentBalance, 1)) * 100,
                  100
                )}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Швидкі дії -->
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/student/wishlist">
            <button
              class="cursor-pointer bg-[#7B68EE] dark:bg-[#8B7EFF] hover:bg-[#7B68EE]/80 dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Icon name="lucide:heart" size="16" />
              <span>Переглянути вішліст</span>
            </button>
          </NuxtLink>

          <button
            v-if="currentWishlistCost > studentBalance"
            @click="optimizeWishlist"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Icon name="lucide:zap" size="16" />
            <span>Оптимізувати вішліст</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-gray-900/20 flex flex-col justify-between transition-all duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div
            class="relative mb-4 flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors duration-200"
          >
            <Icon
              :name="product.icon"
              size="60"
              class="text-[#7B68EE] dark:text-[#8B7EFF] transition-colors duration-200"
              :class="
                !canAffordProduct(product) && !product.isInWishlist
                  ? 'opacity-50'
                  : ''
              "
            />
            <div
              class="absolute top-3 right-3 flex items-center justify-center w-12 h-12 bg-[#7B68EE] dark:bg-[#8B7EFF] text-white font-bold text-sm rounded-full shadow-lg transition-colors duration-200"
              :class="
                !canAffordProduct(product) && !product.isInWishlist
                  ? 'bg-gray-400 dark:bg-gray-600'
                  : ''
              "
            >
              {{ product.price }}
            </div>

            <!-- Іконки статусу -->
            <div class="absolute top-3 left-3">
              <div
                v-if="product.isInWishlist"
                class="flex items-center justify-center w-8 h-8 bg-[#7B68EE] text-white rounded-full shadow-lg"
              >
                <Icon name="lucide:heart" size="16" />
              </div>
              <div
                v-else-if="!canAffordProduct(product)"
                class="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg"
              >
                <Icon name="lucide:lock" size="16" />
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3
                class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200"
                :class="
                  !canAffordProduct(product) && !product.isInWishlist
                    ? 'opacity-60'
                    : ''
                "
              >
                {{ product.name }}
              </h3>
              <p
                class="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200"
                :class="
                  !canAffordProduct(product) && !product.isInWishlist
                    ? 'opacity-60'
                    : ''
                "
              >
                {{ product.description }}
              </p>
            </div>

            <div class="mt-4">
              <button
                @click="toggleWishlist(product)"
                class="w-full font-bold py-3 rounded-xl transition duration-300 flex justify-center items-center gap-2"
                :class="{
                  'bg-[#7B68EE] hover:bg-[#7B68EE]/90 text-white cursor-pointer':
                    product.isInWishlist,
                  'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer':
                    !product.isInWishlist && canAffordProduct(product),
                  'border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed':
                    !product.isInWishlist && !canAffordProduct(product),
                }"
                :disabled="!product.isInWishlist && !canAffordProduct(product)"
              >
                <Icon
                  :name="
                    product.isInWishlist
                      ? 'lucide:heart-off'
                      : canAffordProduct(product)
                      ? 'lucide:plus'
                      : 'lucide:lock'
                  "
                  size="20"
                />
                <span>
                  {{
                    product.isInWishlist
                      ? "Видалити з вішліста"
                      : canAffordProduct(product)
                      ? "Додати до вішлісту"
                      : "Недоступно"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Магазин",
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
import { products } from "@/constants/student/products";

const user = useSupabaseUser();
const client = useSupabaseClient();
const userWishlist = ref([]);
const studentBalance = ref(0);

// Обчислення поточної вартості вішліста
const currentWishlistCost = computed(() => {
  return userWishlist.value.reduce(
    (total, product) => total + (product.price || 0),
    0
  );
});

// Обчислення залишку балансу після вішліста
const remainingBalance = computed(() => {
  return Math.max(0, studentBalance.value - currentWishlistCost.value);
});

// Функція для перевірки, чи може студент дозволити собі товар
function canAffordProduct(product) {
  if (product.isInWishlist) return true;
  return remainingBalance.value >= product.price;
}

async function fetchData() {
  if (user.value) {
    const { data, error } = await client
      .from("students")
      .select("wishlist, student_balance")
      .eq("student_login", user.value.email)
      .single();

    if (error) {
      console.error("Помилка отримання даних:", error.message);
      userWishlist.value = [];
      studentBalance.value = 0;
    } else {
      userWishlist.value = data?.wishlist || [];
      studentBalance.value = data?.student_balance || 0;

      products.value.forEach((product) => {
        const isInList = userWishlist.value.some(
          (item) => item.name === product.name
        );
        product.isInWishlist = isInList;
      });
    }
  }
}

async function toggleWishlist(product) {
  if (!user.value) return;

  if (product.isInWishlist) {
    // Видалення з вішліста
    const updatedWishlist = userWishlist.value.filter(
      (item) => item.name !== product.name
    );

    const { error } = await client
      .from("students")
      .update({ wishlist: updatedWishlist })
      .eq("student_login", user.value.email);

    if (error) {
      console.error("Помилка видалення товару з вішліста:", error.message);
    } else {
      userWishlist.value = updatedWishlist;
      product.isInWishlist = false;
      console.log(`Товар "${product.name}" видалено з вішліста.`);
    }
  } else if (canAffordProduct(product)) {
    // Додавання до вішліста
    const updatedWishlist = [...userWishlist.value, product];

    const { error } = await client
      .from("students")
      .update({ wishlist: updatedWishlist })
      .eq("student_login", user.value.email);

    if (error) {
      console.error("Помилка додавання товару до вішліста:", error.message);
    } else {
      userWishlist.value = updatedWishlist;
      product.isInWishlist = true;
      console.log(`Товар "${product.name}" додано до вішліста.`);
    }
  }
}

// Функція для оптимізації вішліста (залишити тільки доступні товари)
async function optimizeWishlist() {
  if (!user.value) return;

  const sortedWishlist = [...userWishlist.value].sort(
    (a, b) => a.price - b.price
  );
  const optimizedWishlist = [];
  let currentTotal = 0;

  for (const product of sortedWishlist) {
    if (currentTotal + product.price <= studentBalance.value) {
      optimizedWishlist.push(product);
      currentTotal += product.price;
    }
  }

  const { error } = await client
    .from("students")
    .update({ wishlist: optimizedWishlist })
    .eq("student_login", user.value.email);

  if (error) {
    console.error("Помилка оптимізації вішліста:", error.message);
  } else {
    userWishlist.value = optimizedWishlist;

    // Оновлюємо статус товарів
    products.value.forEach((product) => {
      const isInList = optimizedWishlist.some(
        (item) => item.name === product.name
      );
      product.isInWishlist = isInList;
    });

    console.log("Вішліст оптимізовано!");
  }
}

onMounted(() => {
  fetchData();
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchData();
    } else {
      userWishlist.value = [];
      studentBalance.value = 0;
      products.value.forEach((p) => (p.isInWishlist = false));
    }
  },
  { immediate: true }
);

definePageMeta({
  middleware: ["admin-auth"],
});
</script>
