<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '~lib/utils';
import { Icon } from '#components'; // Імпортуємо компонент Icon

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes['class'];
  placeholder?: string;
  icon?: string; // <--- НОВИЙ PROP: назва іконки (наприклад, "material-symbols:search")
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div
    :class="cn(
      'flex items-center rounded-md border border-input bg-transparent shadow-xs transition-[border-color,box-shadow]',
      'focus-within:shadow-md',
      props.class,
    )"
  >
    <Icon
      v-if="props.icon"
      :name="props.icon"
      size="20"
      class="ml-3 text-muted-foreground group-focus-within:text-[#7B68EE]"
    />

    <input
      v-model="modelValue"
      :placeholder="props.placeholder || ''"
      data-slot="input"
      :class="cn(
        'flex-1 min-w-0 h-9 px-2 py-1 text-base file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'outline-none bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'md:text-sm',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        { 'pl-3': !props.icon }
      )"
    >
  </div>
</template>