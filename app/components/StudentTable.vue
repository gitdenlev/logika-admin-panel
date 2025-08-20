<script setup>
import { ref, computed } from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StudentEditDialog from "@/components/StudentEditDialog.vue";

const props = defineProps({
  // Filtered students array
  filteredStudents: {
    type: Array,
    required: true,
  },
  // Error object or null if no error occurred
  fetchError: {
    type: [Object, null],
    default: null,
  },
  // Total number of students
  studentsCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["student-data-changed"]);

// Flag to track if the edit dialog is open
const isEditDialogOpen = ref(false);
// Selected student object
const selectedStudent = ref(null);

/**
 * Opens the edit dialog for a given student
 * @param {Object} student - Student object
 */
const openEditDialog = (student) => {
  selectedStudent.value = student;
  isEditDialogOpen.value = true;
};

/**
 * Emitted event when student data changes
 */
const handleStudentDataChanged = () => {
  emit("student-data-changed");
};

/**
 * Checks if a student's evaluation status is recent
 * @param {Object} student - Student object
 * @returns {Boolean} True if the student's evaluation status is recent, false otherwise
 */
const isRecentlyEvaluated = (student) => {
  if (!student.last_evaluated_at) return false;
  
  const evaluatedAt = new Date(student.last_evaluated_at);
  const now = new Date();
  const hoursDiff = (now - evaluatedAt) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
};

/**
 * Computed property to filter students by evaluation status
 * @returns {Array} Students array with added evaluation status
 */
const studentsWithEvaluationStatus = computed(() => {
  return props.filteredStudents.map(student => ({
    ...student,
    showEvaluatedStatus: isRecentlyEvaluated(student)
  }));
});
</script>

<template>
  <div v-if="fetchError" class="text-red-500 mb-4">
    помилка завантаження даних:
    {{ fetchError.statusMessage || fetchError.message || "Невідома помилка" }}
  </div>

  <Table v-else-if="filteredStudents.length > 0" class="w-full">
    <TableHeader>
      <TableRow class="bg-[#7B68EE] hover:bg-[#7B68EE]/95 text-white">
        <!-- <TableHead class="w-[100px] text-white">ID</TableHead> -->
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
        v-for="student in studentsWithEvaluationStatus"
        :key="student.id"
        class="cursor-pointer hover:bg-zinc-200 transition-colors duration-200"
        @click="openEditDialog(student)"
      >
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
          <div v-if="student.showEvaluatedStatus">
            <span
              class="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              ✓ Оцінено
            </span>
          </div>
          <div v-else class="text-xs text-gray-400 italic">
            Оцініть останній урок
          </div>
        </TableCell>
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