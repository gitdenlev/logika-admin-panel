<script setup lang="ts">
import { ref, watch } from "vue";
import { useSupabaseUser, useSupabaseClient, useHead } from "#imports";

// Initialize Supabase client and authenticated user
const client = useSupabaseClient();
const user = useSupabaseUser();

// Form input fields for email and password
const email = ref("");
const password = ref("");

// Ref to track loading state
const loading = ref(false);

// Ref to store error message, if any
const errorMessage = ref<string | null>(null);

useHead({
  // Set page title and metadata
  title: "Logika Invest - Вхід",
  
  meta: [
    {
      name: "description",
      content: "Сторінка входу до системи Logika Invest.",
    },
    {
      property: "og:title",
      content: "Вхід до системи - Logika Invest.",
    },
    {
      property: "og:description",
      content: "Авторизація користувачів Logika Invest.",
    },
    {
      name: "keywords",
      content: "вхід, логін, користувач, студенти, Logika Invest",
    },
  ],
  
  // Set page icon
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logika-invest-logo.svg",
    },
  ],
});

// Redirect user to dashboard if authenticated on mount
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
 * Handle email and password sign-in form submission.
 */
async function signInWithEmail() {
  // Set loading state to true
  loading.value = true;
  
  // Clear error message, if any
  errorMessage.value = null;

  try {
    // Attempt to sign in user using Supabase client
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    // Set error message, if authentication fails
    if (error) {
      errorMessage.value = error.message;
    }
  } catch (err: any) {
    // Set error message, if there's an error during sign-in process
    errorMessage.value = err.message;
  } finally {
    // Set loading state to false after completing the sign-in process
    loading.value = false;
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

      <!-- Sign-in form with email and password fields -->
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

        <!-- Display error message, if any -->
        <p v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>

        <!-- Submit button with loading state and default text -->
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