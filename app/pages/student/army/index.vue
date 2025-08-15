<template>
  <NuxtLayout>
    <div class="min-h-screen font-sans">
      <div>
        <!-- Заголовок -->
        <div
          class="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          <h3 class="text-2xl font-bold text-gray-600 flex items-center gap-2">
            Наш внесок у допомогу ЗСУ
            <span v-if="progressPercentage >= 100">🎉</span>
          </h3>
          <p class="text-sm text-gray-500 mt-1 italic">
            Разом допомагаємо нашим захисникам
          </p>

          <!-- Лічильники -->
          <div class="mt-4">
            <p
              class="flex items-center gap-2 text-gray-600 text-xl font-bold mb-2"
            >
              Зібрано:
              <span ref="pointsCounter">0</span>
              <span class="text-gray-500">із {{ donationGoal }}</span>
            </p>

            <!-- Прогрес-бар -->
            <div
              class="w-full bg-gray-300 rounded-full h-4 mb-4 overflow-hidden"
            >
              <div
                ref="progressBar"
                class="h-4 rounded-full transition-all duration-500 ease-in-out"
                style="
                  width: 0%;
                  background: linear-gradient(90deg, #b0a4f0, #7b68ee);
                "
              ></div>
            </div>

            <!-- Гроші -->
            <p class="text-gray-500 text-sm">Загальна сума</p>
            <p
              class="text-[#7B68EE] font-bold text-3xl mt-1 flex items-center gap-2"
            >
              <span ref="moneyCounter">0</span> грн
            </p>
          </div>
          <!-- Інфо + Кнопка -->
          <div>
            <p class="flex items-center gap-1 text-gray-500 text-xs mb-4 mt-2">
              1 <NuxtImg src="/lgk.svg" width="10" /> = 1.5₴ • Кошти йдуть
              безпосередньо на потреби ЗСУ
            </p>

            <button
              @click="isDonationDialogOpen = true"
              class="cursor-pointer px-6 py-3 bg-gradient-to-r bg-[#7B68EE] hover:brightness-110 text-white font-bold rounded-xl transition duration-300 flex justify-center items-center gap-2 shadow-lg"
            >
              <Icon name="lucide:arrow-right-circle" size="20" />
              <span>Зробити внесок</span>
            </button>

            <p class="text-gray-500 text-xs mt-4">
              Кожен логік допомагає наблизити перемогу 🇺🇦
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <!-- Діалог -->
  <Dialog
    :open="isDonationDialogOpen"
    @update:open="isDonationDialogOpen = $event"
  >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Зробити внесок на ЗСУ</DialogTitle>
        <DialogDescription>
          Введіть кількість логіків, які ви хочете задонатити.
        </DialogDescription>
        <div
          class="flex gap-1 text-sm text-gray-500 mt-2 rounded-full px-2 py-1 bg-[#7B68EE]/30 w-fit"
        >
          <span class="flex items-center gap-1">
            Доступно: 15
            <NuxtImg src="/lgk.svg" width="15" />
          </span>
        </div>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="donation-amount" class="text-right"> Сума </Label>
          <Input
            id="donation-amount"
            v-model.number="donationAmount"
            type="number"
            :max="studentProfile?.student_balance || 0"
            :min="1"
            placeholder="0"
            class="col-span-3"
          />
        </div>
        <p
          v-if="donationAmount > (studentProfile?.student_balance || 0)"
          class="text-sm text-red-500 text-center"
        >
          Недостатньо балів на вашому рахунку. Доступно:
          {{ studentProfile?.student_balance || 0 }}
        </p>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            class="cursor-pointer bg-gray-300 hover:bg-gray-300/90"
            type="button"
            variant="secondary"
          >
            Скасувати
          </Button>
        </DialogClose>
        <Button
          :class="{
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              !donationAmount ||
              donationAmount <= 0 ||
              donationAmount > (studentProfile?.student_balance || 0),
            'cursor-pointer bg-[#7B68EE] hover:bg-[#7B68EE]/90 text-white':
              donationAmount &&
              donationAmount > 0 &&
              donationAmount <= (studentProfile?.student_balance || 0),
          }"
          type="button"
          @click="handleDonation"
          :disabled="
            !donationAmount ||
            donationAmount <= 0 ||
            donationAmount > (studentProfile?.student_balance || 0)
          "
        >
          Задонатити
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const client = useSupabaseClient();
const user = useSupabaseUser();

const totalDonatedPoints = ref(0);
const donationGoal = ref(1000);
const studentProfile = ref(null);

const isDonationDialogOpen = ref(false);
const donationAmount = ref(null);

const pointsCounter = ref(null);
const moneyCounter = ref(null);
const progressBar = ref(null);

const progressPercentage = computed(() => {
  if (donationGoal.value === 0) return 0;
  return Math.min((totalDonatedPoints.value / donationGoal.value) * 100, 100);
});

const animateCounter = (element, startValue, endValue, duration = 2) => {
  if (!element) return;
  const obj = { value: startValue };
  gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
  });
};

const animateProgressBar = (percentage) => {
  if (!progressBar.value) return;
  gsap.fromTo(
    progressBar.value,
    { width: "0%" },
    { width: `${percentage}%`, duration: 2.5, ease: "power2.out" }
  );
};

const startAnimations = async () => {
  await nextTick();
  animateCounter(pointsCounter.value, 0, totalDonatedPoints.value, 2);
  animateCounter(moneyCounter.value, 0, totalDonatedPoints.value * 1.5, 2);
  animateProgressBar(progressPercentage.value);
};

const updateDataWithAnimation = (newPoints) => {
  const oldPoints = totalDonatedPoints.value;
  totalDonatedPoints.value = newPoints;
  animateCounter(pointsCounter.value, oldPoints, newPoints, 1.5);
  animateCounter(moneyCounter.value, oldPoints * 1.5, newPoints * 1.5, 1.5);
  gsap.to(progressBar.value, {
    width: `${progressPercentage.value}%`,
    duration: 1.5,
    ease: "power2.out",
  });
};

async function fetchTotalDonations() {
  const { data, error } = await client
    .from("zsu_donations")
    .select("total_points")
    .eq("id", 1)
    .single();

  if (!error) {
    if (totalDonatedPoints.value === 0) {
      totalDonatedPoints.value = data.total_points;
      startAnimations();
    } else {
      updateDataWithAnimation(data.total_points);
    }
  }
}

async function fetchStudentProfile() {
  if (user.value) {
    const { data, error } = await client
      .from("students")
      .select("id, student_balance")
      .eq("student_login", user.value.email)
      .single();

    if (!error) studentProfile.value = data;
  }
}

const handleDonation = async () => {
  if (
    !donationAmount.value ||
    donationAmount.value <= 0 ||
    donationAmount.value > (studentProfile.value?.student_balance || 0)
  )
    return;

  const { error } = await client.rpc("handle_donation", {
    sender_id: studentProfile.value.id,
    donation_amount: donationAmount.value,
  });

  if (!error) {
    await fetchTotalDonations();
    await fetchStudentProfile();
    donationAmount.value = null;
    isDonationDialogOpen.value = false;
  }
};

onMounted(async () => {
  await fetchTotalDonations();
  await fetchStudentProfile();
  setInterval(() => {
    fetchTotalDonations();
    fetchStudentProfile();
  }, 10000);
});

definePageMeta({
  middleware: ["admin-auth"],
});
</script>

<style scoped>
span[ref="pointsCounter"],
span[ref="moneyCounter"] {
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
