import { ref, onMounted, watch, computed } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";
import JSConfetti from "js-confetti";

// Гарною практикою є визначення типів для ваших даних
interface Student {
  id: string | number;
  student_name: string;
  student_login: string;
  student_balance?: number;
}

interface StudentProfile {
  student_name: string;
  student_balance: number;
}

/**
 * Composable для керування логікою транзакцій студентів.
 */
export function useTransactions() {
  const user = useSupabaseUser();
  const client = useSupabaseClient();
  let jsConfetti: JSConfetti;

  // --- Стан (State) ---
  const amount = ref<number | null>(null);
  const searchQuery = ref("");
  const selectedRecipient = ref<Student | null>(null);
  const studentsList = ref<Student[]>([]);
  const studentProfile = ref<StudentProfile | null>(null);
  const isLoading = ref(false);
  const transactionMessage = ref("");
  const transactionStatus = ref<"success" | "error" | "">("");
  const showSuccessView = ref(false);
  const randomMessage = ref("");

  // --- Константи ---
  const quickAmounts = [1, 5, 10, 25, 50];
  const funnyMessages = [
    "🚫 Балів малувато… наче холодильник після зарплати 🥲",
    "🚫 Ми б переказали, але баланс сказав: «Ні» 🙃",
    "🚫 Баланс просить підзарядки, як телефон з 1% 🔋",
    "🚫 Упс! На рахунку пусто, як у шафі після переїзду 📦",
    "🚫 Не вистачає балів… але є гарний настрій 😅",
  ];

  // --- Приватні методи ---
  function pickRandomMessage() {
    const index = Math.floor(Math.random() * funnyMessages.length);
    randomMessage.value = funnyMessages[index];
  }

  function clearTransactionMessage() {
    setTimeout(() => {
      transactionMessage.value = "";
      transactionStatus.value = "";
    }, 5000);
  }

  function clearSelection() {
    selectedRecipient.value = null;
    amount.value = null;
    transactionMessage.value = "";
    transactionStatus.value = "";
    showSuccessView.value = false;
  }

  // --- Публічні методи (доступні в компоненті) ---
  function selectRecipient(student: Student) {
    selectedRecipient.value = student;
    searchQuery.value = "";
    amount.value = null;
    transactionMessage.value = "";
    transactionStatus.value = "";
  }

  async function fetchStudentProfile() {
    if (user.value) {
      const { data, error } = await client
        .from("students")
        .select("student_name, student_balance")
        .eq("student_login", user.value.email)
        .single();

      if (error) {
        console.error("Помилка отримання даних студента:", error.message);
        studentProfile.value = null;
      } else {
        studentProfile.value = data;
      }
    }
  }

  async function fetchStudentsList() {
    const { data, error } = await client
      .from("students")
      .select("id, student_name, student_login");

    if (error) {
      console.error("Помилка завантаження списку студентів:", error.message);
    } else {
      studentsList.value =
        data?.filter((student) => student.student_login !== user.value?.email) ||
        [];
    }
  }

  async function sendTransaction() {
    if (
      !amount.value || amount.value <= 0 || !selectedRecipient.value || !studentProfile.value || !user.value
    ) {
      return;
    }

    if (amount.value > studentProfile.value.student_balance) {
      transactionMessage.value = "Недостатньо балів для переказу";
      transactionStatus.value = "error";
      clearTransactionMessage();
      return;
    }

    isLoading.value = true;

    try {
      // Використовуємо RPC для атомарної транзакції в базі даних.
      // Це набагато безпечніше, ніж кілька окремих запитів.
      const { error } = await client.rpc('transfer_balance', {
        sender_email: user.value.email,
        recipient_email: selectedRecipient.value.student_login,
        transfer_amount: amount.value,
      });

      if (error) throw error;

      // Якщо успішно, оновлюємо локальний стан
      studentProfile.value.student_balance -= amount.value;

      showSuccessView.value = true;
      jsConfetti.addConfetti({
        emojis: ["💜", "🎁", "🪄", "🌸", "🛍️", "🔮"],
        emojiSize: 80,
        confettiNumber: 40,
      });

      setTimeout(clearSelection, 3500);
    } catch (error: any) {
      console.error("Помилка транзакції:", error);
      transactionMessage.value = error.details || error.message || "Помилка при відправці логіків. Спробуйте ще раз.";
      transactionStatus.value = "error";
      clearTransactionMessage();
    } finally {
      isLoading.value = false;
    }
  }

  // --- Обчислювані властивості (Computed) ---
  const filteredStudents = computed(() => {
    if (!searchQuery.value) return [];
    return studentsList.value.filter((student) =>
      student.student_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // --- Хуки життєвого циклу та спостерігачі ---
  onMounted(() => {
    jsConfetti = new JSConfetti();
    fetchStudentProfile();
    fetchStudentsList();
    pickRandomMessage();
  });

  watch(user, (newUser) => {
    if (newUser) {
      fetchStudentProfile();
      fetchStudentsList();
    }
  });

  watch(amount, (newVal) => {
    if (newVal && newVal > (studentProfile.value?.student_balance || 0)) {
      pickRandomMessage();
    }
  });

  // --- Повертаємо все, що потрібно компоненту ---
  return {
    amount,
    searchQuery,
    selectedRecipient,
    studentProfile,
    isLoading,
    transactionMessage,
    transactionStatus,
    showSuccessView,
    quickAmounts,
    randomMessage,
    filteredStudents,
    selectRecipient,
    sendTransaction,
  };
}
