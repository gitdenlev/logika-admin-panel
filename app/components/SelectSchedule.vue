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

const timeSlots = [];
for (let h = 8; h <= 17; h++) {
  const hour = h.toString().padStart(2, "0");
  timeSlots.push(`${hour}:00`);
  timeSlots.push(`${hour}:30`);
}

const selectedTime = ref(null);
</script>

<template>
  <div class="flex gap-4 p-4">
    <!-- Селектор для часу -->
    <Select v-model="selectedTime">
      <SelectTrigger icon="lsicon:time-two-filled">
        <SelectValue placeholder="Оберіть час" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="time in timeSlots" :key="time" :value="time">
            {{ time }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
