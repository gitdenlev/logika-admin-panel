<script setup>
import { computed } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button/Button.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Підтвердіть дію",
  },
  description: {
    type: String,
    default: "Ви впевнені, що хочете виконати цю дію?",
  },
  confirmText: {
    type: String,
    default: "Підтвердити",
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  closeDialog();
};

const closeDialog = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <Dialog class="bg-red-500" v-model:open="showDialog" @update:open="closeDialog">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
          :disabled="isLoading"
          class="sm:order-first"
        >
          Скасувати
        </Button>
        <Button
          type="button"
          variant="destructive"
          @click="handleConfirm"
          :disabled="isLoading"
          class="cursor-pointer"
        >
          <span v-if="isLoading">Видалення...</span>
          <span v-else>{{ confirmText }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>