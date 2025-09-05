<template>
  <NuxtLayout>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200"
    >
      <div>
        <div
          v-if="wishlist.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="(product, index) in wishlist"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-gray-900/20 flex flex-col justify-between transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div
              class="relative mb-4 flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors duration-200"
            >
              <Icon
                :name="product.icon"
                size="60"
                class="text-[#7B68EE] dark:text-[#8B7EFF]"
              />
              <div
                class="absolute top-3 right-3 flex items-center justify-center w-12 h-12 bg-[#7B68EE] dark:bg-[#8B7EFF] text-white font-bold text-sm rounded-full shadow-lg transition-colors duration-200"
              >
                {{ product.price }}
              </div>
              <!-- Кількість товару -->
              <div
                class="absolute top-3 left-3 flex items-center justify-center w-8 h-8 bg-[#7B68EE] text-white rounded-full shadow-lg"
              >
                <span class="text-xs font-bold">{{ product.quantity }}</span>
              </div>
            </div>

            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200"
                >
                  {{ product.name }}
                </h3>
                <p
                  class="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200"
                >
                  {{ product.description }}
                </p>
                <!-- Інформація про ціну та кількість -->
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Ціна за одиницю:</span
                    >
                    <div class="flex items-center gap-1">
                      <span class="text-sm font-semibold">{{
                        product.price
                      }}</span>
                      <NuxtImg src="/lgk.svg" width="12" />
                    </div>
                  </div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Кількість:</span
                    >
                    <span class="text-sm font-semibold"
                      >{{ product.quantity }} шт.</span
                    >
                  </div>
                  <hr class="my-2 border-dotted border-gray-300 dark:border-gray-600" />
                  <div class="flex justify-between items-center">
                    <span
                      class="text-sm font-bold text-gray-800 dark:text-gray-200"
                      >Загальна вартість:</span
                    >
                    <div class="flex items-center gap-1">
                      <span
                        class="text-sm font-bold text-[#7B68EE] dark:text-[#8B7EFF]"
                      >
                        {{ product.price * product.quantity }}
                      </span>
                      <NuxtImg src="/lgk.svg" width="12" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Кнопка переходу до магазину -->
                <NuxtLink to="/student/store">
                  <button
                    class="cursor-pointer w-full bg-[#7B68EE] dark:bg-[#8B7EFF] hover:bg-[#7B68EE]/80 dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-3 rounded-xl transition-all duration-300 flex justify-center items-center gap-2"
                  >
                    <Icon name="lucide:store" size="20" />
                    <span>Перейти до магазину</span>
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200"
        >
          <Icon
            name="ph:heart-straight-break-fill"
            size="80"
            class="text-gray-400 dark:text-gray-600 mb-4 transition-colors duration-200"
          />
          <p class="text-xl font-semibold mb-2">Ваш список пустий</p>
          <p>
            Поверніться до магазину, щоб додати товари, які вам сподобались!
          </p>
          <NuxtLink to="/student/store">
            <button
              class="cursor-pointer mt-6 bg-[#7B68EE] dark:bg-[#8B7EFF] hover:bg-[#7B68EE]/80 dark:hover:bg-[#8B7EFF]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Перейти до магазину
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Вішліст",
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

const user = useSupabaseUser();
const client = useSupabaseClient();
const wishlist = ref([]);

// Обчислювані властивості
const totalWishlistItems = computed(() => {
  return wishlist.value.reduce((total, item) => total + item.quantity, 0);
});

const totalWishlistCost = computed(() => {
  return wishlist.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// Функція для завантаження вішліста з бази даних
async function fetchWishlist() {
  if (user.value) {
    try {
      const { data, error } = await client
        .from("students")
        .select("wishlist")
        .eq("student_login", user.value.email)
        .single();

      if (error) {
        console.error("Помилка отримання вішліста:", error.message);
        wishlist.value = [];
      } else {
        if (data?.wishlist && typeof data.wishlist === "string") {
          try {
            const parsedWishlist = JSON.parse(data.wishlist);
            wishlist.value = Array.isArray(parsedWishlist) ? parsedWishlist : [];
          } catch (e) {
            console.error("Error parsing wishlist:", e);
            wishlist.value = [];
          }
        } else {
          wishlist.value = data?.wishlist || [];
        }
      }
    } catch (error: any) {
      console.error("Помилка отримання вішліста:", error.message);
      wishlist.value = [];
    }
  }
}

// Завантаження вішліста при завантаженні компонента
onMounted(() => {
  fetchWishlist();
});

// Завантаження вішліста при зміні користувача
watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchWishlist();
    } else {
      wishlist.value = [];
    }
  },
  { immediate: true }
);
</script>
