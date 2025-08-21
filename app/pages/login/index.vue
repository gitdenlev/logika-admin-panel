<script setup lang="ts">
import { ref, watch } from "vue";
import { useSupabaseUser, useSupabaseClient, useHead } from "#imports";

// Initialize Supabase client and authenticated user
const client = useSupabaseClient();
const user = useSupabaseUser();

// Form input fields for email and password
const email = ref("");
const password = ref("");

// Loading state indicator
const loading = ref(false);

// Error message container
const errorMessage = ref<string | null>(null);

// Set page title, meta tags, and icon with Nuxt's useHead hook
useHead({
  // Page title
  title: "Logika Admin Panel - Вхід",
  
  // Meta description and keywords for SEO
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
      content: "вхід, логін, адміністратор,.panель, студенти, Supabase, Nuxt.js",
    },
  ],
  
  // Set page icon
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logika-panel.svg",
    },
  ],
});

// Redirect unauthorized users to login on mount
watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      navigateTo("/");
    }
  },
  { immediate: true }
);

/**
 * Perform sign-in with email and password when form is submitted.
 */
async function signInWithEmail() {
  // Set loading state to true
  loading.value = true;
  
  // Clear previous error message
  errorMessage.value = null;

  try {
    // Sign in user with email and password
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    // Display error message if sign-in fails
    if (error) {
      errorMessage.value = error.message;
    }
  } catch (err: any) {
    // Handle unexpected errors
    errorMessage.value = err.message;
  } finally {
    // Set loading state to false after successful sign-in
    loading.value = false;
  }
}
</script>

<template>
  <!-- Login form container -->
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="bg-white rounded-3xl p-8 shadow-xl w-full sm:max-w-md text-gray-800"
    >
      <h2 class="text-3xl font-bold text-center mb-3 text-gray-800">
        Вхід
      </h2>

      <!-- Login form -->
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

        <!-- Display error message if sign-in fails -->
        <p v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>

        <!-- Sign in button with loading state indicator -->
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