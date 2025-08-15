<script setup>
import { ref } from "vue"; // Додано ref для керування станом діалогу
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StudentEditDialog from "@/components/StudentEditDialog.vue"; // Імпорт нового компонента

const props = defineProps({
  filteredStudents: {
    type: Array,
    required: true,
  },
  fetchError: {
    type: [Object, null],
    default: null,
  },
  studentsCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["student-data-changed"]); // Подія, коли дані учня оновилися/видалилися

// Стан для керування модальним вікном редагування
const isEditDialogOpen = ref(false);
const selectedStudent = ref(null);

// Функція для відкриття діалогу редагування
const openEditDialog = (student) => {
  selectedStudent.value = student;
  isEditDialogOpen.value = true;
};

// Обробник, коли дані учня змінилися (оновлення/видалення)
const handleStudentDataChanged = () => {
  emit("student-data-changed"); // Перевидаємо подію до батьківського компонента (pages/index.vue)
};
</script>

<template>
  <div v-if="fetchError" class="text-red-500 mb-4">
    Помилка завантаження даних:
    {{ fetchError.statusMessage || fetchError.message || "Невідома помилка" }}
  </div>

  <Table v-else-if="filteredStudents.length > 0" class="w-full">
    <TableHeader>
      <TableRow class="bg-[#7B68EE] hover:bg-[#7B68EE]/95 text-white">
        <TableHead class="w-[100px] text-white">ID</TableHead>
        <TableHead class="text-white">Учень</TableHead>
        <TableHead class="text-white">Курс</TableHead>
        <TableHead class="text-white">Логін</TableHead>
        <TableHead class="text-white">Час</TableHead>
        <TableHead class="text-right text-white">Баланс</TableHead>
        <TableHead class="text-right text-white">Статус</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody class="bg-zinc-100">
      <TableRow
        v-for="student in filteredStudents"
        :key="student.id"
        class="cursor-pointer hover:bg-zinc-200 transition-colors duration-200"
        @click="openEditDialog(student)"
      >
        <TableCell class="font-medium">{{ student.id }}</TableCell>
        <TableCell>{{ student.student_name }}</TableCell>
        <TableCell>{{ student.student_course }}</TableCell>
        <TableCell>{{ student.student_login }}</TableCell>
        <TableCell>{{ student.student_schedule }}</TableCell>
        <TableCell
          class="text-right leading-tight"
          :data-updated-at="student.updated_at"
        >
          {{ student.student_balance }}
        </TableCell>
        <TableCell class="text-right">
          <span
            class="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full ml-2"
          >
            ✓ Оцінено
          </span>
          <div class="text-xs text-gray-500 mt-1">26/07/2025</div></TableCell
        >
      </TableRow>
    </TableBody>
  </Table>

  <div v-else class="text-center text-gray-500 mt-4">
    {{
      studentsCount === 0
        ? "Немає даних про студентів."
        : "Немає результатів за таким пошуковим запитом."
    }}
  </div>

  <StudentEditDialog
    v-model="isEditDialogOpen"
    :student="selectedStudent"
    @student-updated="handleStudentDataChanged"
    @student-deleted="handleStudentDataChanged"
  />
</template>
