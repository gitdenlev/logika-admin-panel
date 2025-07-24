<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <SelectTrigger>
      <SelectValue placeholder="Фільтр за курсом" />
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