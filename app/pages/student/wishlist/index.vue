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
              </div>

              <div class="mt-4">
                <button
                  @click="removeFromWishlist(product)"
                  class="cursor-pointer w-full bg-red-400 dark:bg-red-700 hover:bg-red-500/90 dark:hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <Icon name="lucide:minus" size="20" />
                  <span>Видалити</span>
                </button>
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
    { name: "description", content: "Статистика, рейтинг, досягнення та магазини ЛКГ" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/logika-invest-logo.svg" },
    { rel: "apple-touch-icon", href: "/logika-invest-logo.svg" },
  ],
});
import { ref, onMounted, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from '#imports';

const user = useSupabaseUser();
const client = useSupabaseClient();
const wishlist = ref([]);

// Функція для завантаження вішліста з бази даних
async function fetchWishlist() {
  if (user.value) {
    const { data, error } = await client
      .from('students')
      .select('wishlist')
      .eq('student_login', user.value.email)
      .single();

    if (error) {
      console.error("Помилка отримання вішліста:", error.message);
      wishlist.value = [];
    } else {
      wishlist.value = data?.wishlist || [];
    }
  }
}

// Функція для видалення товару з вішліста
async function removeFromWishlist(product) {
  if (user.value) {
    // Оновлюємо локальний список
    const updatedWishlist = wishlist.value.filter((item) => item.name !== product.name);

    // Оновлюємо дані в базі даних
    const { error } = await client
      .from('students')
      .update({ wishlist: updatedWishlist })
      .eq('student_login', user.value.email);

    if (error) {
      console.error("Помилка видалення товару з вішліста:", error.message);
    } else {
      // Якщо оновлення успішне, оновлюємо локальний список
      wishlist.value = updatedWishlist;
      console.log(`Товар "${product.name}" прибрано з вішліста.`);
    }
  }
}

// Завантаження вішліста при завантаженні компонента
onMounted(() => {
  fetchWishlist();
});

// Завантаження вішліста при зміні користувача
watch(user, (newUser) => {
    if (newUser) {
      fetchWishlist();
    } else {
      wishlist.value = [];
    }
}, { immediate: true });

definePageMeta({
  middleware: ["admin-auth"],
});
</script>