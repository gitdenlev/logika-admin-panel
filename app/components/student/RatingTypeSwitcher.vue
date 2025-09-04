<template>
  <div class="flex justify-end">
    <div class="flex items-center gap-2">
      <!-- Balance -->
      <button
        @click="$emit('update:modelValue', 'balance')"
        class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none"
        :class="{
          'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 text-indigo-600 dark:text-indigo-400':
            modelValue === 'balance',
          'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400':
            modelValue !== 'balance',
        }"
        title="За балансом"
      >
        <NuxtImg src="/lgk.svg" width="20" />
      </button>

      <!-- Donated -->
      <button
        @click="$emit('update:modelValue', 'donated')"
        class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none"
        :class="{
          'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 text-indigo-600 dark:text-indigo-400':
            modelValue === 'donated',
          'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400':
            modelValue !== 'donated',
        }"
        title="За донатами"
      >
        <Icon
          name="fluent-emoji-high-contrast:military-helmet"
          size="20"
          class="text-gray-600 dark:text-gray-400"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'balance' | 'donated';
}>();

defineEmits(['update:modelValue']);
</script>
