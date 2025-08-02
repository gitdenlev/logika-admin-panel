<script setup>
import { ref } from "vue";

// Імпортуємо компоненти з UI-бібліотеки
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Створюємо масиви для днів тижня та часу, щоб легко генерувати опції
const daysOfWeek = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
  "Субота",
  "Неділя",
];

const timeSlots = [];
for (let h = 8; h <= 17; h++) {
  const hour = h.toString().padStart(2, "0");
  timeSlots.push(`${hour}:00`);
  timeSlots.push(`${hour}:30`);
}

const selectedDay = ref(null);
const selectedTime = ref(null);
</script>

<template>
  <div class="flex gap-4 p-4">
    <!-- Селектор для днів тижня -->
    <Select v-model="selectedDay">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Оберіть день" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Дні тижня</SelectLabel>
          <SelectItem v-for="day in daysOfWeek" :key="day" :value="day">
            {{ day }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <!-- Селектор для часу -->
    <Select v-model="selectedTime">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Оберіть час" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Години</SelectLabel>
          <SelectItem v-for="time in timeSlots" :key="time" :value="time">
            {{ time }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
