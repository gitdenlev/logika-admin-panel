<script setup>
import { ref, watch, computed } from "vue";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
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

const client = useSupabaseClient();

const localStudent = ref(null);
const isEditing = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);

// Стан для діалогу підтвердження видалення
const showConfirmDeleteDialog = ref(false);

// Змінна для відстеження початкового балансу
const initialBalance = ref(null);

// Обчислювана властивість для форматування дати оновлення
const lastUpdatedDate = computed(() => {
  if (localStudent.value && localStudent.value.updated_at) {
    const date = new Date(localStudent.value.updated_at);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return "";
});

watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      localStudent.value = { ...newStudent };
      initialBalance.value = newStudent.student_balance; // Запам'ятовуємо початковий баланс
      isEditing.value = false;
    } else {
      localStudent.value = null;
      initialBalance.value = null;
    }
  },
  { deep: true, immediate: true }
);

watch(
  localStudent,
  (newVal) => {
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
  showConfirmDeleteDialog.value = false;
};

async function handleSave() {
  if (!localStudent.value || !isEditing.value) return;

  const balanceChanged =
    initialBalance.value !== localStudent.value.student_balance;

  saveLoading.value = true;
  try {
    const updateData = {
      student_name: localStudent.value.student_name,
      student_course: localStudent.value.student_course,
      student_login: localStudent.value.student_login,
      student_balance: localStudent.value.student_balance,
      student_wishlist: localStudent.value.wishlist,
    };

    // Якщо баланс змінився, додаємо мітку часу оцінювання
    if (balanceChanged) {
      updateData.last_evaluated_at = new Date().toISOString();
    }

    const { error } = await client
      .from("students")
      .update(updateData)
      .eq("id", localStudent.value.id);

    if (error) {
      throw error;
    }

    if (balanceChanged) {
      toast.success("Учня успішно оцінено", {
        style: {
          border: "none",
        },
      });
    } else {
      toast.success("Дані учня успішно оновлено", {
        style: {
          border: "none",
        },
      });
    }

    emit("student-updated");
    closeDialog();
  } catch (error) {
    console.error("Помилка оновлення учня:", error.message);
    toast.error(`Помилка оновлення: ${error.message}`, {
      style: {
        border: "none",
      },
    });
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
    showConfirmDeleteDialog.value = false;
    closeDialog();
  } catch (error) {
    console.error("Помилка видалення учня:", error.message);
    toast.error(`Помилка видалення: ${error.message}`, {
      style: {
        border: "none",
      },
    });
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

        <div>
          <label for="student_balance">Список бажаного</label>
          <ul id="student_wishlist" class="space-y-2">
            <li
              v-if="
                !localStudent?.wishlist || localStudent.wishlist.length === 0
              "
              class="text-sm text-gray-500"
            >
              Список порожній
            </li>

            <li
              v-for="(item, idx) in localStudent?.wishlist"
              :key="item.id ?? idx"
              class="flex items-start gap-3 bg-white dark:bg-slate-800 border border-transparent rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <div
                class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
              >
                {{ item.description }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Update student balance -->
        <FieldUpdateBalance />
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
    :description="`Ви впевнені, що хочете видалити учня ${
      localStudent?.student_name || ''
    }?`"
    confirmText="Видалити"
    :isLoading="deleteLoading"
    @confirm="confirmDelete"
    @cancel="showConfirmDeleteDialog = false"
    style="z-index: 9999"
  />
</template>
