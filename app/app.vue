<script setup lang="ts">
// Import the Toaster component and Vue Sonner styles
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "2up4kJbnI0aA7lxr_nO8-YZuYZ1846nb_WhHUNJtEXs",
    },
  ],
});
</script>

<template>
  <div>
    <!-- Render full page content using NuxtPage component -->
    <NuxtPage />

    <!-- Display toaster component with rich colors and expandable options -->
    <Toaster richColors :expand="true" />
  </div>
</template>
