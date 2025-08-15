<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div class="flex justify-end items-center mb-8">
        <div class="flex items-center justify-end gap-2">
          <p class="text-gray-600 font-bold text-xl">{{ studentBalance }}</p>
          <NuxtImg src="/lgk.svg" width="20" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div
            class="relative mb-4 flex justify-center items-center h-40 bg-gray-100 rounded-xl"
          >
            <Icon :name="product.icon" size="60" class="text-[#7B68EE]" />
            <div
              class="absolute top-3 right-3 flex items-center justify-center w-12 h-12 bg-[#7B68EE] text-white font-bold text-sm rounded-full shadow-lg"
            >
              {{ product.price }}
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">
                {{ product.name }}
              </h3>
              <p class="text-gray-500 mb-4">{{ product.description }}</p>
            </div>

            <div class="mt-4">
              <button
                @click="addToWishlist(product)"
                class="w-full font-bold py-3 rounded-xl transition duration-300 flex justify-center items-center gap-2"
                :class="{
                  'bg-green-200 text-green-800 cursor-not-allowed':
                    product.isInWishlist,
                  'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer':
                    !product.isInWishlist && product.price <= studentBalance,
                  'border-2 border-dashed border-gray-300 text-gray-400 cursor-not-allowed':
                    !product.isInWishlist && product.price > studentBalance,
                }"
                :disabled="
                  product.isInWishlist || product.price > studentBalance
                "
              >
                <Icon
                  v-if="studentBalance >= product.price"
                  :name="product.isInWishlist ? 'lucide:check' : 'lucide:plus'"
                  size="20"
                />
                <span>
                  {{
                    product.isInWishlist
                      ? "Додано"
                      : product.price > studentBalance
                      ? "Не вистачає логіків"
                      : "Додати до вішлісту"
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";

const user = useSupabaseUser();
const client = useSupabaseClient();
const userWishlist = ref([]);
const studentBalance = ref(0);

const products = ref([
  {
    name: "Браслет",
    price: 15,
    description: "Стильний браслет із логотипом школи.",
    icon: "game-icons:ring",
    isInWishlist: false,
  },
  {
    name: "Наліпки",
    price: 25,
    description: "Набір яскравих наліпок для вашого ноутбука чи блокнота.",
    icon: "ph:sticker-duotone",
    isInWishlist: false,
  },
  {
    name: "Ручка/олівець",
    price: 25,
    description: "Брендована ручка або олівець для успішного навчання.",
    icon: "ph:pencil-duotone",
    isInWishlist: false,
  },
  {
    name: "Значок",
    price: 30,
    description: "Металевий значок із символом вашого курсу.",
    icon: "ph:circle-fill",
    isInWishlist: false,
  },
  {
    name: "Попсокет",
    price: 50,
    description: "Зручний попсокет для телефону.",
    icon: "icon-park-outline:spinning-top",
    isInWishlist: false,
  },
  {
    name: "Шкарпетки",
    price: 100,
    description: "Фірмові шкарпетки Logika. Яскраві та зручні.",
    icon: "ph:sock-duotone",
    isInWishlist: false,
  },
  {
    name: "Пляшка",
    price: 150,
    description: "Стильна пляшка для води, щоб завжди мати гідратацію.",
    icon: "material-symbols:water-bottle-outline-rounded",
    isInWishlist: false,
  },
  {
    name: "Килимок для мишки",
    price: 180,
    description: "Якісний килимок для мишки з ексклюзивним дизайном.",
    icon: "ph:mouse-duotone",
    isInWishlist: false,
  },
  {
    name: "Бананка",
    price: 220,
    description: "Зручна бананка для найнеобхідніших речей.",
    icon: "game-icons:school-bag",
    isInWishlist: false,
  },
  {
    name: "Футболка",
    price: 250,
    description: "Класична футболка з логотипом школи.",
    icon: "ph:t-shirt-duotone",
    isInWishlist: false,
  },
  {
    name: "Парасолька",
    price: 250,
    description: "Фірмова парасолька для захисту від негоди.",
    icon: "ph:umbrella-duotone",
    isInWishlist: false,
  },
  {
    name: "Навушники",
    price: 300,
    description: "Якісні бездротові навушники для музики та навчання.",
    icon: "ph:headphones-duotone",
    isInWishlist: false,
  },
  {
    name: "Знижка 30% на перший місяць",
    price: 300,
    description: "Приємний бонус для продовження навчання.",
    icon: "ph:percent-duotone",
    isInWishlist: false,
  },
]);

async function fetchData() {
  if (user.value) {
    const { data, error } = await client
      .from("students")
      .select("wishlist, student_balance")
      .eq("student_login", user.value.email)
      .single();

    if (error) {
      console.error("Помилка отримання даних:", error.message);
      userWishlist.value = [];
      studentBalance.value = 0;
    } else {
      userWishlist.value = data?.wishlist || [];
      studentBalance.value = data?.student_balance || 0;

      products.value.forEach((product) => {
        const isInList = userWishlist.value.some(
          (item) => item.name === product.name
        );
        product.isInWishlist = isInList;
      });
    }
  }
}

async function addToWishlist(product) {
  if (user.value && !product.isInWishlist) {
    const updatedWishlist = [...userWishlist.value, product];

    const { error } = await client
      .from("students")
      .update({ wishlist: updatedWishlist })
      .eq("student_login", user.value.email);

    if (error) {
      console.error("Помилка додавання товару до вішліста:", error.message);
    } else {
      userWishlist.value = updatedWishlist;
      product.isInWishlist = true;
      console.log(`Товар "${product.name}" додано до вішліста.`);
    }
  }
}

onMounted(() => {
  fetchData();
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchData();
    } else {
      userWishlist.value = [];
      studentBalance.value = 0;
      products.value.forEach((p) => (p.isInWishlist = false));
    }
  },
  { immediate: true }
);

definePageMeta({
  middleware: ["admin-auth"],
});
</script>

<style scoped>
/* Додаткові стилі можна додати тут */
</style>
