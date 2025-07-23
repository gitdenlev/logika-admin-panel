<script setup lang="ts">
import { ref, watch } from "vue";
import { useSupabaseUser, useSupabaseClient, useHead } from "#imports";

const client = useSupabaseClient();
const user = useSupabaseUser();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref<string | null>(null);

// Використання useHead для керування метаданими сторінки
useHead({
  title: "Logika Admin Panel - Вхід",
  meta: [
    {
      name: "description",
      content: "Сторінка входу для адміністративної панелі управління студентами.",
    },
    {
      property: "og:title",
      content: "Вхід до системи - Адмін Панель",
    },
    {
      property: "og:description",
      content: "Сторінка входу для адміністративної панелі управління студентами.",
    },
    {
      name: "keywords",
      content: "вхід, логін, адміністратор, панель, студенти, Supabase, Nuxt.js",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logika-panel.svg",
    },
  ],
});

watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      navigateTo("/");
    }
  },
  { immediate: true }
);

async function signInWithEmail() {
  loading.value = true;
  errorMessage.value = null; // Очищуємо попередні помилки

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message; // Відображаємо помилку входу
    }
  } catch (err: any) {
    errorMessage.value = err.message; // Обробка непередбачених помилок
  } finally {
    loading.value = false; // Завершуємо стан завантаження
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="bg-white rounded-3xl p-8 shadow-xl w-full sm:max-w-md text-gray-800"
    >
      <h2 class="text-3xl font-bold text-center mb-3 text-gray-800">
        Вхід
      </h2>

      <form @submit.prevent="signInWithEmail" class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Введіть ваш email"
            required
            class="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7B68EE] text-gray-800"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Пароль</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7B68EE] text-gray-800"
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="cursor-pointer w-full bg-[#7B68EE] hover:bg-[#7B68EE]/80 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Вхід...</span>
          <span v-else>Увійти</span>
        </button>
      </form>
    </div>
  </div>
</template>
