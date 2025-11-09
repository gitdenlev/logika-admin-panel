<template>
  <NuxtLayout>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200"
    >
      <!-- Стан завантаження -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center text-center h-screen"
      >
        <Loader />
      </div>

      <!-- Основний контент -->
      <div v-else>
        <!-- Плаваючий блок балансу -->
        <div
          class="fixed bottom-0 right-8 z-50 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
          >
            <div>
              <h2 class="text-md font-bold mb-2">Твій баланс</h2>
              <div class="flex items-center gap-1">
                <p class="text-md font-bold text-[#7B68EE] dark:text-[#8B7EFF]">
                  {{ studentBalance || 0 }}
                </p>
                <NuxtImg src="/lgk.svg" width="15" />
              </div>
            </div>
            <div v-if="currentWishlistCost > 0">
              <h2 class="text-md font-bold mb-2">Залишок</h2>
              <div class="flex items-center gap-1">
                <p class="text-md font-bold text-[#7B68EE] dark:text-[#8B7EFF]">
                  {{ remainingBalance }}
                </p>
                <NuxtImg src="/lgk.svg" width="15" />
              </div>
            </div>
          </div>

          <!-- Прогрес -->
          <div class="mb-4">
            <div
              class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2"
            >
              <span>Використано</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all duration-300"
                :class="
                  currentWishlistCost > studentBalance
                    ? 'bg-red-500'
                    : 'bg-[#7B68EE] dark:bg-[#8B7EFF]'
                "
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>
          </div>

          <!-- Дії -->
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/student/wishlist">
              <button
                class="cursor-pointer bg-[#7B68EE] dark:bg-[#8B7EFF] hover:bg-[#7B68EE]/80 dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Icon name="lucide:heart" size="16" />
                <span>Переглянути вішліст</span>
                <span
                  v-if="totalWishlistItems > 0"
                  class="bg-white/20 px-2 py-1 rounded-full text-xs"
                >
                  {{ totalWishlistItems }}
                </span>
              </button>
            </NuxtLink>
          </div>
        </div>

        <!-- Сітка товарів -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          <div
            v-for="product in products"
            :key="product.name"
            class="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-gray-900/20 flex flex-col justify-between transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            <!-- Плашка 'Ще в дорозі' -->
            <div
              v-if="!product.inStock"
              class="absolute -top-3 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-[#7B68EE] text-white shadow"
            >
              <span class="flex items-center justify-center gap-2"> <Icon name="fa:truck" /> Ще в дорозі </span>
            </div>

            <div
              class="relative mb-4 flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors duration-200"
              :class="!product.inStock ? 'opacity-60' : ''"
            >
              <Icon
                :name="product.icon"
                size="60"
                class="text-[#7B68EE] dark:text-[#8B7EFF] transition-colors duration-200"
              />
              <div
                class="absolute top-3 right-3 flex items-center justify-center w-12 h-12 bg-[#7B68EE] dark:bg-[#8B7EFF] text-white font-bold text-sm rounded-full shadow-lg transition-colors duration-200"
              >
                {{ product.price }}
              </div>

              <!-- Іконки статусу зліва -->
              <div class="absolute top-3 left-3">
                <div
                  v-if="product.quantity > 0"
                  class="flex items-center justify-center w-8 h-8 bg-[#7B68EE] text-white rounded-full shadow-lg"
                >
                  <span class="text-xs font-bold">{{ product.quantity }}</span>
                </div>
                <div
                  v-else-if="!canAffordAnother(product)"
                  class="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Icon name="lucide:lock" size="16" />
                </div>
              </div>
            </div>

            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3
                  class="text-xl font-bold mb-2 transition-colors duration-200"
                  :class="!product.inStock ? 'opacity-60' : ''"
                >
                  {{ product.name }}
                </h3>
                <p
                  class="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200"
                  :class="!product.inStock ? 'opacity-60' : ''"
                >
                  {{ product.description }}
                </p>
                <div
                  v-if="product.quantity > 0"
                  class="flex items-center gap-1 mb-2"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Загальна вартість:</span
                  >
                  <span
                    class="text-sm font-bold text-[#7B68EE] dark:text-[#8B7EFF]"
                  >
                    {{ product.price * product.quantity }}
                  </span>
                  <NuxtImg src="/lgk.svg" width="12" />
                </div>
              </div>

              <div class="mt-4">
                <!-- Лічильник -->
                <div
                  v-if="product.quantity > 0"
                  class="flex items-center justify-center gap-2"
                >
                  <button
                    @click="decrementQuantity(product)"
                    class="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    :disabled="!product.inStock"
                    :aria-disabled="!product.inStock"
                  >
                    <Icon name="lucide:minus" size="20" />
                  </button>
                  <span class="text-xl font-bold w-12 text-center">{{
                    product.quantity
                  }}</span>
                  <button
                    @click="incrementQuantity(product)"
                    :disabled="!canAffordAnother(product)"
                    :aria-disabled="!canAffordAnother(product)"
                    class="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="lucide:plus" size="20" />
                  </button>
                </div>

                <!-- Кнопка додати -->
                <button
                  v-else
                  @click="addToWishlist(product)"
                  class="w-full font-bold py-3 rounded-xl transition duration-300 flex justify-center items-center gap-2"
                  :class="buttonClass(product)"
                  :disabled="!canAffordAnother(product)"
                  :aria-disabled="!canAffordAnother(product)"
                >
                  <Icon
                    :name="
                      canAffordAnother(product) ? 'lucide:plus' : 'lucide:lock'
                    "
                    size="20"
                  />
                  <span>
                    {{
                      !product.inStock
                        ? "Ще в дорозі"
                        : canAffordAnother(product)
                        ? "Додати до вішлісту"
                        : "Недоступно"
                    }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Напівпрозорий блокер для 'ще в дорозі' -->
            <div
              v-if="!product.inStock"
              class="absolute inset-0 rounded-2xl bg-gray-900/5 dark:bg-black/10 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Logika Invest – Магазин",
  meta: [
    {
      name: "description",
      content:
        "Магазин Logika Invest: переглядайте та купуйте доступні товари й послуги.",
    },
    { property: "og:title", content: "Магазин – Logika Invest" },
    {
      property: "og:description",
      content: "Обирайте товари та послуги у магазині Logika Invest.",
    },
    { property: "og:image", content: "/logika-invest-logo.svg" },
    {
      name: "keywords",
      content: "Logika Invest, магазин, товари, послуги, покупки",
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

const isLoading = ref(true);

// додаємо quantity та дефолт для inStock, якщо відсутній
const products = ref(
  staticProducts.value.map((p: any) => ({
    ...p,
    inStock: p.inStock ?? true,
    quantity: 0,
  }))
);

const studentBalance = ref(0);
let debounceTimer: ReturnType<typeof setTimeout>; // сумісний тип

const currentWishlistCost = computed(() =>
  products.value.reduce(
    (total, product) =>
      total + (Number(product.price) || 0) * (Number(product.quantity) || 0),
    0
  )
);

const remainingBalance = computed(() => {
  const balance = Number(studentBalance.value) || 0;
  const cost = Number(currentWishlistCost.value) || 0;
  return Math.max(0, balance - cost);
});

const totalWishlistItems = computed(() =>
  products.value.reduce(
    (total, product) => total + (Number(product.quantity) || 0),
    0
  )
);

const progressPercentage = computed(() => {
  const balance = Number(studentBalance.value) || 0;
  const cost = Number(currentWishlistCost.value) || 0;
  if (balance <= 0) return 0;
  const percentage = Math.round((cost / balance) * 100);
  return Math.min(percentage, 100);
});

// тепер враховуємо ще й наявність
function canAffordAnother(product: any) {
  if (!product?.inStock) return false;
  const balance = Number(studentBalance.value) || 0;
  const productPrice = Number(product.price) || 0;
  const currentCost = Number(currentWishlistCost.value) || 0;
  return balance - currentCost >= productPrice;
}

const buttonClass = (product: any) => {
  if (!product.inStock) {
    return "border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed";
  }
  return canAffordAnother(product)
    ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer"
    : "border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed";
};

async function fetchData() {
  if (!user.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const { data, error } = await client
      .from("students")
      .select("wishlist, student_balance")
      .eq("student_login", user.value.email)
      .single();

    if (error) throw error;

    const balance = data?.student_balance;
    studentBalance.value =
      balance === null || balance === undefined || isNaN(balance)
        ? 0
        : Number(balance);

    // парсимо вішліст
    let userWishlist: Array<{ name: string; quantity: number }> = [];
    if (data?.wishlist) {
      try {
        if (typeof data.wishlist === "string") {
          userWishlist = JSON.parse(data.wishlist);
        } else if (Array.isArray(data.wishlist)) {
          userWishlist = data.wishlist;
        }
      } catch {
        userWishlist = [];
      }
    }

    // оновлюємо кількість
    products.value.forEach((product) => {
      const w = userWishlist.find((i) => i.name === product.name);
      product.quantity = w ? Number(w.quantity) || 0 : 0;
    });
  } catch (e) {
    console.error("Помилка отримання даних:", e);
    studentBalance.value = 0;
    products.value.forEach((p) => (p.quantity = 0));
  } finally {
    isLoading.value = false;
  }
}

async function updateWishlistInSupabase() {
  if (!user.value) return;

  const wishlistToSave = products.value
    .filter((p) => Number(p.quantity) > 0)
    .map((p) => ({
      name: p.name,
      price: Number(p.price) || 0,
      description: p.description,
      icon: p.icon,
      quantity: Number(p.quantity) || 0,
    }));

  try {
    const { error } = await client
      .from("students")
      .update({ wishlist: wishlistToSave })
      .eq("student_login", user.value.email);

    if (error) console.error("Помилка оновлення вішліста:", error.message);
  } catch (error) {
    console.error("Network error updating wishlist:", error);
  }
}

function debouncedUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateWishlistInSupabase();
  }, 500);
}

function addToWishlist(product: any) {
  if (!product?.inStock) return;
  if (canAffordAnother(product)) {
    product.quantity = 1;
    debouncedUpdate();
  }
}

function incrementQuantity(product: any) {
  if (!product?.inStock) return;
  if (canAffordAnother(product)) {
    product.quantity = (Number(product.quantity) || 0) + 1;
    debouncedUpdate();
  }
}

function decrementQuantity(product: any) {
  if (Number(product.quantity) > 0) {
    product.quantity = Math.max(0, (Number(product.quantity) || 0) - 1);
    debouncedUpdate();
  }
}

onMounted(fetchData);

watch(user, (newUser) => {
  if (newUser) {
    fetchData();
  } else {
    studentBalance.value = 0;
    products.value.forEach((p) => (p.quantity = 0));
    isLoading.value = false;
  }
});
</script>
