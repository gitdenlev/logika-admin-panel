<template>
  <aside
    class="hidden sticky top-0 lg:flex flex-col bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-screen w-1/5 shadow-lg dark:shadow-gray-950/50 transition-colors duration-200"
  >
    <nav class="flex-1 py-6">
      <ul class="space-y-3 px-4">
        <li v-for="(item, index) in sidebarItems" :key="index">
          <NuxtLink
            :to="item.link"
            class="group flex items-center gap-2 text-[16px] rounded-full h-[48px] px-4 border-4 transition-colors duration-200 ease-in-out"
            :class="[
              isActive(item.link)
                ? 'bg-[#E5E7EB] dark:bg-gray-700 text-[#151617] dark:text-gray-50 shadow-lg border-transparent'
                : 'border-transparent text-[#6B7280] dark:text-gray-400 hover:bg-[#F3F4F6] dark:hover:bg-gray-700/50 hover:text-[#374151] dark:hover:text-gray-50 hover:shadow-md dark:hover:shadow-gray-900'
            ]"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out"
            >
              <Icon :name="item.icon" size="25" />
            </div>
            <span class="font-semibold transition-colors duration-200 ease-in-out">
              {{ item.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <StudentDropdown />
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

// Оновлені статичні дані для навігації
const sidebarItems = [
  {
    title: "Дашборд",
    link: "/student/dashboard",
    icon: "material-symbols:grid-view-rounded",
  },
  {
    title: "Транзакції",
    link: "/student/transactions",
    icon: "ant-design:swap-outlined",
  },
  {
    title: "Вішліст",
    link: "/student/wishlist",
    icon: "ph:heart-fill",
  },
  {
    title: "Магазин",
    link: "/student/store",
    icon: "lucide:store",
  },
  {
    title: "Досягнення",
    link: "/student/achievement",
    icon: "octicon:goal-16",
  },
  {
    title: "Рейтинг",
    link: "/student/rating",
    icon: "gridicons:trophy",
  },
  {
    title: "Армія",
    link: "/student/army",
    icon: "fluent-emoji-high-contrast:military-helmet",
  }
];

const route = useRoute();
const isActive = (link: string) => {
  return route.path === link;
};
</script>