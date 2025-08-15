<script setup lang="ts">
import { computed } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue"; // Оновлений імпорт компонента
import SelectValue from "@/components/ui/select/SelectValue.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedCourse = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <Select v-model="selectedCourse">
    <SelectTrigger icon="icomoon-free:books" placeholder="Фільтр за курсом">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="all">Всі курси</SelectItem>
        <SelectItem value="Фронтенд">Фронтенд</SelectItem>
        <SelectItem value="Вебдизайн">Вебдизайн</SelectItem>
        <SelectItem value="Геймдизайн">Геймдизайн</SelectItem>
        <SelectItem value="Пайтон">Пайтон</SelectItem>
        <SelectItem value="Скреч">Скреч</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
