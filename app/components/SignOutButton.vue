<script setup>
import Button from "@/components/ui/button/Button.vue";
import { Icon } from "#components";
import { useSupabaseClient } from "#imports";

const client = useSupabaseClient();

async function signOut() {
  await client.auth.signOut();
  navigateTo("/login");
}
</script>

<template>
  <Button
    @click="signOut"
    class="cursor-pointer bg-[#E63946] hover:bg-[#E63946]/95 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-200"
  >
    <Icon name="mdi:logout" class="h-5 w-5" /> Вийти
  </Button>
</template>