<script setup lang="ts">
// Toast notifications
import { toast } from "vue-sonner";

// Utilities
import { useSupabaseClient } from "#imports";
import { cn } from "~lib/utils";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label вам не потрібен, оскільки ви його видалили в HTML

const client = useSupabaseClient();

const newStudentName = ref("");
const newStudentCourse = ref("");
const newStudentLogin = ref("");
const newStudentBalance = ref(0);

const isAddingStudent = ref(false);
const showAddStudentDialog = ref(false);

const emit = defineEmits(["student-added"]);

function resetAddStudentFormAndMessages() {
  newStudentName.value = "";
  newStudentCourse.value = "";
  newStudentLogin.value = "";
  newStudentBalance.value = 0;
}

async function addNewStudentToDb() {
  isAddingStudent.value = true;

  const studentDataToSend = {
    student_name: newStudentName.value,
    student_course: newStudentCourse.value,
    student_login: newStudentLogin.value,
  };

  try {
    const response = await $fetch("/api/addStudent", {
      method: "POST",
      body: studentDataToSend,
    });

    toast.success("Учня успішно додано", {
      style: {
        background: "#7c68ed",
        color: "white",
        border: "none",
      },
    });

    emit("student-added");

    setTimeout(() => {
      showAddStudentDialog.value = false;
      resetAddStudentFormAndMessages();
    }, 1500);
  } catch (err: any) {
    console.error("Помилка при додаванні учня через API:", err);
    const errorData = err.data || {};
    // Використовуйте toast.error для відображення помилки
    toast.error("Помилка при додаванні учня", {
      description: errorData.message || err.message || "Не вдалося додати учня",
    });
  } finally {
    isAddingStudent.value = false;
  }
}
</script>

<template>
  <Dialog
    v-model:open="showAddStudentDialog"
    @update:open="resetAddStudentFormAndMessages"
  >
    <DialogTrigger as-child>
      <Button class="cursor-pointer bg-[#7B68EE] hover:bg-[#7B68EE]/95">
        <Icon
          name="tdesign:user-add-filled"
          size="20"
          class="group-focus-within:text-[#7B68EE]"
        />
        Додати нового учня
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Додати нового учня</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <Input
          placeholder="Введіть ім'я учня"
          id="newStudentName"
          v-model="newStudentName"
          class="col-span-4"
        />
        <Input
          placeholder="Введіть курс учня"
          id="newStudentCourse"
          v-model="newStudentCourse"
          class="col-span-4"
        />
        <Input
          placeholder="Введіть логін учня"
          id="newStudentLogin"
          v-model="newStudentLogin"
          class="col-span-4"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          @click="addNewStudentToDb"
          :disabled="isAddingStudent"
          class="w-full cursor-pointer flex items-center justify-center bg-[#7B68EE] hover:bg-[#7B68EE]/95"
        >
          <span v-if="isAddingStudent">Додаємо</span>
          <span v-else>Додати</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>