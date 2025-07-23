<script setup>
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
      content: "Централізована панель для адміністративного управління даними студентів компанії Logika.",
    },
    {
      name: "keywords",
      content: "адмін, панель, управління, студенти, Logika, CRM, облік, Supabase, Nuxt.js",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logika-panel.svg",
    },
  ],
});
definePageMeta({
  middleware: ["admin-auth"],
});


import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

const searchTerm = ref("");
const selectedCourse = ref("all");
const filteredStudents = ref([]);
const students = ref([]);
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

  // Змінюємо умову для фільтрації за курсом
  if (selectedCourse.value !== "all") {
    // Якщо обрано конкретний курс (не "all")
    tempStudents = tempStudents.filter(
      (student) =>
        student.student_course &&
        student.student_course.toLowerCase() ===
          selectedCourse.value.toLowerCase()
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
      <StudentControls
        v-model:search-term="searchTerm"
        v-model:selected-course="selectedCourse"
        @student-added="handleStudentAdded"
      />

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