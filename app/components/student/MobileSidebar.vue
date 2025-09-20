<template>
  <div class="block lg:hidden fixed bottom-4 left-4 z-50">
    <Button
      @click="isDrawerOpen = true"
      variant="ghost"
      class="rounded-full w-12 h-12 p-0 text-gray-700 dark:text-gray-300 shadow-md bg-white dark:bg-gray-800 transition-colors duration-200"
    >
      <Icon name="lucide:menu" size="25" />
    </Button>

    <Drawer v-model:open="isDrawerOpen">
      <DrawerContent class="h-full w-full rounded-r-lg rounded-t-none bg-white dark:bg-gray-800 transition-colors duration-200">
        <div class="px-4 flex flex-col h-full bg-white dark:bg-gray-800">
          <div class="mt-4 space-y-2 flex-1">
            <NuxtLink
              v-for="(item, index) in sidebarItems"
              :key="index"
              :to="item.link"
              @click="isDrawerOpen = false"
              class="flex items-center gap-4 text-[16px] rounded-lg h-[48px] px-4 transition-colors duration-200 ease-in-out"
              :class="[
                isActive(item.link)
                  ? 'bg-[#E5E7EB] dark:bg-gray-700 text-[#151617] dark:text-gray-200 shadow-md'
                  : 'text-[#6B7280] dark:text-gray-400 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 hover:text-[#374151] dark:hover:text-gray-200',
              ]"
            >
              <Icon :name="item.icon" size="25" />
              <span class="font-semibold">{{ item.title }}</span>
            </NuxtLink>
          </div>

          <div
            class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700"
          ></div>
        </div>
        <StudentDropdown />
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const isDrawerOpen = ref(false);

const sidebarItems = [
  { title: "Дашборд", link: "/", icon: "material-symbols:grid-view-rounded" },
  {
    title: "Транзакції",
    link: "/student/transactions",
    icon: "ant-design:swap-outlined",
  },
  { title: "Вішліст", link: "/student/wishlist", icon: "ph:heart-fill" },
  { title: "Магазин", link: "/student/store", icon: "lucide:store" },
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
  },
];

const route = useRoute();
const isActive = (link: string) => {
  return route.path === link;
};
</script>