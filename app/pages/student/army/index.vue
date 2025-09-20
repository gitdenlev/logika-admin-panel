<template>
  <NuxtLayout>
    <div
      class="min-h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors duration-200"
    >
      <div>
        <div class="relative overflow-hidden w-full">
          <h3
            class="sm:text-2xl font-bold text-gray-600 dark:text-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-colors duration-200"
          >
            <span>🇺🇦 Наш внесок у допомогу ЗСУ</span>
          </h3>
          <p
            class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 italic transition-colors duration-200"
          >
            Разом допомагаємо нашим захисникам
          </p>

          <div class="mt-4">
            <p
              class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-300 text-lg sm:text-xl font-bold mb-2 transition-colors duration-200"
            >
              <span>Зібрано:</span>
              <span class="flex items-center gap-2">
                <span ref="pointsCounter">0</span>
                <span
                  class="text-gray-500 dark:text-gray-400 transition-colors duration-200"
                  >із {{ donationGoal }}</span
                >
              </span>
            </p>

            <div
              class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 sm:h-4 mb-4 overflow-hidden transition-colors duration-200"
            >
              <div
                ref="progressBar"
                class="h-3 sm:h-4 rounded-full transition-all duration-500 ease-in-out"
                style="
                  width: 0%;
                  background: linear-gradient(90deg, #b0a4f0, #7b68ee);
                "
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md transition-colors duration-200 border border-gray-200 dark:border-gray-700"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Наш внесок за цей місяць
              </p>
              <p
                class="italic text-2xl font-bold text-[#7B68EE] dark:text-[#8B7EFF] flex items-center gap-1"
              >
                {{ donationStats.monthly }}
                <NuxtImg src="/lgk.svg" width="18" /> =
                {{
                  (donationStats.monthly * 1.5).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                }}
                грн
              </p>
            </div>
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md transition-colors duration-200 border border-gray-200 dark:border-gray-700"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Наш внесок за весь час
              </p>
              <p
                class="italic text-2xl font-bold text-[#7B68EE] dark:text-[#8B7EFF] flex items-center gap-1"
              >
                {{ donationStats.total }}
                <NuxtImg src="/lgk.svg" width="18" /> =
                {{
                  (donationStats.total * 1.5).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                }}
                грн
              </p>
            </div>
          </div>
          <div>
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-4 mt-2 transition-colors duration-200"
            >
              <span class="flex items-center gap-0.5">
                1 <NuxtImg src="/lgk.svg" width="10" />
              </span>
              <span>=</span>
              <span> 1.5₴ </span>
              <span class="hidden sm:inline">•</span>
              <span class="text-xs"
                >Кошти йдуть безпосередньо на потреби ЗСУ</span
              >
            </div>

            <button
              @click="isDonationDialogOpen = true"
              class="w-full sm:w-auto cursor-pointer px-6 py-3 sm:py-3 bg-gradient-to-r bg-[#7B68EE] hover:brightness-110 text-white font-bold rounded-xl transition duration-300 flex justify-center items-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Icon name="lucide:arrow-right-circle" size="20" />
              <span>Зробити внесок</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <Dialog
    :open="isDonationDialogOpen"
    @update:open="isDonationDialogOpen = $event"
  >
    <DialogContent
      class="w-[300px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
    >
      <DialogHeader>
        <div
          class="flex mx-auto justify-center gap-1 text-sm text-gray-500 dark:text-gray-300 mt-2 rounded-full px-2 py-1 bg-[#7B68EE]/30 dark:bg-[#8B7EFF]/30 w-fit transition-colors duration-200"
        >
          <span class="flex items-center gap-1">
            Доступно: {{ studentProfile?.student_balance || 0 }}
            <NuxtImg src="/lgk.svg" width="15" />
          </span>
        </div>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label
            for="donation-amount"
            class="text-right text-gray-600 dark:text-gray-300 transition-colors duration-200"
          >
            Сума
          </Label>
          <Input
            id="donation-amount"
            v-model.number="donationAmount"
            type="number"
            :max="studentProfile?.student_balance || 0"
            :min="1"
            placeholder="0"
            class="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 transition-colors duration-200"
          />
        </div>

        <p
          v-if="donationAmount > (studentProfile?.student_balance || 0)"
          class="text-sm text-red-500 dark:text-red-400 text-center"
        >
          Недостатньо балів на вашому рахунку
        </p>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            class="cursor-pointer bg-gray-300 dark:bg-gray-600 hover:bg-gray-300/90 dark:hover:bg-gray-700/90 text-gray-600 dark:text-gray-200 transition-colors duration-200"
            type="button"
            variant="secondary"
          >
            Скасувати
          </Button>
        </DialogClose>
        <Button
          :class="{
            'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400':
              !donationAmount ||
              donationAmount <= 0 ||
              donationAmount > (studentProfile?.student_balance || 0) ||
              isProcessing,
            'cursor-pointer bg-[#7B68EE] hover:bg-[#7B68EE]/90 text-white dark:bg-[#8B7EFF] dark:hover:bg-[#8B7EFF]/90':
              donationAmount &&
              donationAmount > 0 &&
              donationAmount <= (studentProfile?.student_balance || 0) &&
              !isProcessing,
          }"
          type="button"
          @click="handleDonation"
          :disabled="
            !donationAmount ||
            donationAmount <= 0 ||
            donationAmount > (studentProfile?.student_balance || 0) ||
            isProcessing
          "
        >
          {{ isProcessing ? "Обробка..." : "Задонатити" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div
    v-if="showSuccess"
    class="fixed top-4 right-4 left-4 sm:left-auto bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-sm sm:max-w-none mx-auto sm:mx-0"
  >
    <div class="flex items-center gap-2 justify-center sm:justify-start">
      <Icon name="lucide:check-circle" size="20" />
      <span class="text-sm sm:text-base">Дякуємо за ваш внесок! 🇺🇦</span>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Logika Invest – Армія та досягнення дітей",
  meta: [
    {
      name: "description",
      content:
        "Переглядайте статистику та досягнення в Армії Logika Invest. Слідкуйте за прогресом, рейтингом та активностями вашої дитини!",
    },
    {
      name: "keywords",
      content:
        "Logika Invest, армія, донат, ЗСУ, бали, прогрес, акаунт дитини",
    },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/logika-invest-logo.svg" },
    { rel: "apple-touch-icon", href: "/logika-invest-logo.svg" },
  ],
});
import { ref, onMounted, computed, nextTick } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import JSConfetti from "js-confetti";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

let jsConfetti: JSConfetti;
const client = useSupabaseClient();
const user = useSupabaseUser();

const donationStats = ref({ total: 0, monthly: 0 });
const donationGoal = ref(1500);
const studentProfile = ref(null);

const isDonationDialogOpen = ref(false);
const donationAmount = ref(null);
const isProcessing = ref(false);
const showSuccess = ref(false);

const pointsCounter = ref(null);
const moneyCounter = ref(null);
const progressBar = ref(null);

const progressPercentage = computed(() => {
  if (donationGoal.value === 0) return 0;
  return Math.min(
    (donationStats.value.monthly / donationGoal.value) * 100,
    100
  );
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
  animateCounter(pointsCounter.value, 0, donationStats.value.monthly, 2);
  animateCounter(moneyCounter.value, 0, donationStats.value.monthly * 1.5, 2);
  animateProgressBar(progressPercentage.value);
};

const updateDataWithAnimation = (newMonthlyPoints) => {
  const oldPoints = donationStats.value.monthly;
  donationStats.value.monthly = newMonthlyPoints;
  animateCounter(pointsCounter.value, oldPoints, newMonthlyPoints, 1.5);
  animateCounter(
    moneyCounter.value,
    oldPoints * 1.5,
    newMonthlyPoints * 1.5,
    1.5
  );
  gsap.to(progressBar.value, {
    width: `${progressPercentage.value}%`,
    duration: 1.5,
    ease: "power2.out",
  });
};

async function fetchDonationStats() {
  try {
    const data = await $fetch("/api/getDonationStats");
    if (data) {
      const isFirstLoad =
        donationStats.value.total === 0 && donationStats.value.monthly === 0;

      donationStats.value.total = data.totalDonations;

      if (isFirstLoad) {
        donationStats.value.monthly = data.monthlyDonations;
        startAnimations();
      } else {
        updateDataWithAnimation(data.monthlyDonations);
      }
    }
  } catch (error) {
    console.error("Failed to fetch donation stats:", error);
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
    donationAmount.value > (studentProfile.value?.student_balance || 0) ||
    isProcessing.value
  ) {
    return;
  }

  isProcessing.value = true;

  try {
    const { error } = await $fetch("/api/donate", {
      method: "POST",
      body: {
        studentId: studentProfile.value.id,
        amount: donationAmount.value,
      },
    });

    if (error) throw error;

    await fetchDonationStats();
    await fetchStudentProfile();

    donationAmount.value = null;
    isDonationDialogOpen.value = false;

    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);

    jsConfetti.addConfetti({
      emojis: ["🇺🇦", "💙", "💛", "🙏", "💪", "❤️"],
      emojiSize: 80,
      confettiNumber: 40,
    });
  } catch (error: any) {
    console.error("Помилка під час донату:", error.message);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(async () => {
  await fetchDonationStats();
  await fetchStudentProfile();
  jsConfetti = new JSConfetti();

  setInterval(() => {
    fetchDonationStats();
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
