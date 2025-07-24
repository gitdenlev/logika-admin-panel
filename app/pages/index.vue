<script setup>
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Logika Admin Panel",
  meta: [
    {
      name: "description",
      content: "Адміністративна панель управління студентами компанії Logika.",
    },
    {
      property: "og:title",
      content: "Logika Admin Panel - Управління студентами",
    },
    {
      property: "og:description",
      content:
        "Централізована панель для адміністративного управління даними студентів компанії Logika.",
    },
    {
      name: "keywords",
      content:
        "адмін, панель, управління, студенти, Logika, CRM, облік, Supabase, Nuxt.js",
    },
  ],
  link: [],
});
definePageMeta({
  middleware: ["admin-auth"],
});

const searchTerm = ref("");
const selectedCourse = ref("all");
const selectedGroup = ref("all"); // Зберігаємо обрану групу
const filteredStudents = ref([]);
const students = ref([]); // Всі завантажені студенти
const loading = ref(true);

const {
  data: studentsData,
  error: fetchError,
  refresh: refreshStudents,
} = await useAsyncData("students-fetch", async () => {
  const res = await $fetch("/api/getStudents");
  return res;
});

const reloadStudents = async () => {
  loading.value = true;
  await refreshStudents();
  students.value = studentsData.value || [];
  filterStudents();
  loading.value = false;
};

onMounted(() => {
  reloadStudents();
});

// Обчислювана властивість для отримання унікальних курсів (якщо ви використовуєте її в StudentControls)
const uniqueCourses = computed(() => {
  const courses = new Set();
  students.value.forEach((student) => {
    if (student.student_course) {
      courses.add(student.student_course);
    }
  });
  return Array.from(courses).sort(); // Сортуємо для відображення
});

// Обчислювана властивість для отримання унікальних груп для обраного курсу (якщо ви використовуєте її в StudentControls)
const availableGroupsForSelectedCourse = computed(() => {
  if (selectedCourse.value === "all") {
    return [];
  }

  const groups = new Set();
  students.value.forEach((student) => {
    if (
      student.student_course === selectedCourse.value &&
      student.student_group
    ) {
      groups.add(student.student_group);
    }
  });
  return Array.from(groups).sort();
});

const filterStudents = () => {
  let tempStudents = students.value;

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    tempStudents = tempStudents.filter(
      (student) =>
        student.student_name.toLowerCase().includes(term) ||
        student.student_login.toLowerCase().includes(term) ||
        student.id.toString().includes(term)
    );
  }

  if (selectedCourse.value !== "all") {
    tempStudents = tempStudents.filter(
      (student) =>
        student.student_course &&
        student.student_course.toLowerCase() ===
          selectedCourse.value.toLowerCase()
    );
  }

  if (selectedGroup.value !== "all") {
    tempStudents = tempStudents.filter(
      (student) =>
        student.student_group &&
        student.student_group.toLowerCase() ===
          selectedGroup.value.toLowerCase()
    );
  }

  filteredStudents.value = tempStudents;
};

watch(studentsData, (newData) => {
  students.value = newData || [];
  filterStudents();
});

watch(searchTerm, filterStudents);
watch(selectedCourse, filterStudents);
watch(selectedGroup, filterStudents);

const handleStudentAdded = () => {
  reloadStudents();
};

const handleStudentDataChanged = () => {
  reloadStudents();
};
</script>

<template>
  <div class="p-2">
    <div
      v-if="loading"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <Loader />
    </div>

    <div v-else>
      <div class="flex items-center justify-between sticky top-0 z-20 p-2 bg-white/60 backdrop-blur-lg shadow-xl backdrop-saturate-200">

        <h1 class="text-gray-700">
          Всього учнів: {{ students.length }}
        </h1>
        <StudentControls
        v-model:search-term="searchTerm"
        v-model:selected-course="selectedCourse"
        @student-added="handleStudentAdded"
      />
      </div>

      <StudentTable
        :filteredStudents="filteredStudents"
        :fetchError="fetchError"
        :studentsCount="students.length"
        @student-data-changed="handleStudentDataChanged"
      />
    </div>
    <Toaster richColors :expand="true" />
  </div>
</template>
