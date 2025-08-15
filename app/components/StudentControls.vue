<script setup>
import Input from "@/components/ui/input/Input.vue";

const props = defineProps({
  searchTerm: String,
  selectedCourse: String,
});

const emit = defineEmits([
  "update:searchTerm",
  "update:selectedCourse",
  "student-added",
]);

const internalSearchTerm = computed({
  get: () => props.searchTerm,
  set: (value) => emit("update:searchTerm", value),
});

const internalSelectedCourse = computed({
  get: () => props.selectedCourse,
  set: (value) => emit("update:selectedCourse", value),
});

const handleStudentAdded = () => {
  emit("student-added");
};
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-3">
      <FormAddNewStudent @student-added="handleStudentAdded" />
      <Input
        placeholder="Знайти учня..."
        v-model="internalSearchTerm"
        class="w-[300px]"
        icon="stash:search-solid"
      />
    </div>
    <div class="flex items-center gap-3">
      <SelectCourse v-model="internalSelectedCourse" />
      <SelectSchedule />
    </div>
    <SignOutButton />
  </div>
</template>
