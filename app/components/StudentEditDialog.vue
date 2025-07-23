<script setup>
import { ref, watch, computed } from "vue";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { useSupabaseClient } from "#imports";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  student: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "student-updated",
  "student-deleted",
]);

const client = useSupabaseClient(); // Supabase клієнт для взаємодії з БД

const localStudent = ref(null);
const isEditing = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);

// Стан для діалогу підтвердження видалення
const showConfirmDeleteDialog = ref(false);

watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      localStudent.value = { ...newStudent };
      isEditing.value = false;
    } else {
      localStudent.value = null;
    }
  },
  { deep: true, immediate: true }
);

watch(
  localStudent,
  (newVal, oldVal) => {
    if (props.student && newVal) {
      isEditing.value =
        newVal.student_name !== props.student.student_name ||
        newVal.student_course !== props.student.student_course ||
        newVal.student_login !== props.student.student_login ||
        newVal.student_balance !== props.student.student_balance;
    } else {
      isEditing.value = false;
    }
  },
  { deep: true }
);

const closeDialog = () => {
  emit("update:modelValue", false);
  showConfirmDeleteDialog.value = false; // Закриваємо також діалог підтвердження
};

async function handleSave() {
  if (!localStudent.value || !isEditing.value) return;

  saveLoading.value = true;
  try {
    const { data, error } = await client
      .from("students")
      .update({
        student_name: localStudent.value.student_name,
        student_course: localStudent.value.student_course,
        student_login: localStudent.value.student_login,
        student_balance: localStudent.value.student_balance,
      })
      .eq("id", localStudent.value.id)
      .select();

    if (error) {
      throw error;
    }

    toast.success("Дані учня успішно оновлено");
    emit("student-updated");
    closeDialog();
  } catch (error) {
    console.error("Помилка оновлення учня:", error.message);
    toast.error(`Помилка оновлення: ${error.message}`);
  } finally {
    saveLoading.value = false;
  }
}

// Замість прямого видалення, відкриваємо діалог підтвердження
const requestDeleteConfirmation = () => {
  showConfirmDeleteDialog.value = true;
  // Тимчасово закриваємо основний діалог
  emit("update:modelValue", false);
};

// Функція, яка буде викликана після підтвердження в ConfirmDeleteDialog
async function confirmDelete() {
  if (!localStudent.value) {
    showConfirmDeleteDialog.value = false;
    return;
  }

  deleteLoading.value = true;
  try {
    const { error } = await client
      .from("students")
      .delete()
      .eq("id", localStudent.value.id);

    if (error) {
      throw error;
    }

    toast.info("Учня успішно видалено", {
      style: {
        background: "#E63946",
        color: "white",
        border: "none",
      },
    });
    emit("student-deleted");
    showConfirmDeleteDialog.value = false; // Закриваємо діалог підтвердження
    closeDialog(); // Закриваємо основний діалог
  } catch (error) {
    console.error("Помилка видалення учня:", error.message);
    toast.error(`Помилка видалення: ${error.message}`);
  } finally {
    deleteLoading.value = false;
  }
}

// Обробка видимості основного діалогу  
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <Dialog v-model:open="showDialog" @update:open="closeDialog">
    <DialogContent v-if="localStudent" class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Редагувати учня</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center">
          <label for="student_name">Ім'я</label>
          <Input
            id="student_name"
            v-model="localStudent.student_name"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center">
          <label for="student_course">Курс</label>
          <Input
            id="student_course"
            v-model="localStudent.student_course"
            class="w-full col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center">
          <label for="student_login">Логін</label>
          <Input
            id="student_login"
            v-model="localStudent.student_login"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center">
          <label for="student_balance">Баланс</label>
          <Input
            type="number"
            class="value:text-center"
            id="student_balance"
            v-model.number="localStudent.student_balance"
          />
        </div>
      </div>
      <DialogFooter
        class="flex flex-col sm:flex-row justify-between gap-2 pt-4"
      >
        <Button
          type="button"
          variant="destructive"
          @click="requestDeleteConfirmation" 
          :disabled="deleteLoading"
          class="cursor-pointer sm:order-first"
        >
          <span v-if="deleteLoading">Видалення...</span>
          <span v-else>Видалити учня</span>
        </Button>
        <Button
          type="submit"
          @click="handleSave"
          :disabled="!isEditing || saveLoading"
          class="cursor-pointer bg-[#7B68EE] hover:bg-[#7B68EE]/90"
        >
          <span v-if="saveLoading">Збереження...</span>
          <span v-else>Зберегти зміни</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <ConfirmDeleteDialog
    v-model="showConfirmDeleteDialog"
    title="Підтвердити видалення"
    :description="`Ви впевнені, що хочете видалити учня ${localStudent?.student_name || ''}?`"
    confirmText="Видалити"
    :isLoading="deleteLoading"
    @confirm="confirmDelete"
    @cancel="showConfirmDeleteDialog = false"
    style="z-index: 9999;"
  />
</template>