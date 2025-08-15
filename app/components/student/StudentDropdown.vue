<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'vue-router';
import { useSupabaseClient, useSupabaseUser } from '#imports';

// Модальні вікна
const isProfileModalOpen = ref(false);
const isSettingsModalOpen = ref(false);

// Color mode
const colorMode = useColorMode();

// Логіка для виходу з акаунта
const client = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();

// Змінна для зберігання імені користувача
const userName = ref('Користувач');

// Обчислена властивість для іконки поточного режиму
const currentModeIcon = computed(() => {
  switch (colorMode.value) {
    case 'light':
      return 'lucide:sun';
    case 'dark':
      return 'lucide:moon';
    case 'system':
      return 'lucide:monitor';
    case 'sepia':
      return 'lucide:book-open';
    default:
      return 'lucide:monitor';
  }
});

// Функція для отримання імені користувача з таблиці 'students'
async function fetchUserName() {
  if (user.value) {
    const { data, error } = await client
      .from('students')
      .select('student_name')
      .eq('student_login', user.value.email)
      .single();

    if (error) {
      console.error("Помилка отримання імені користувача:", error.message);
      userName.value = 'Користувач';
    } else {
      userName.value = data.student_name || 'Користувач';
    }
  } else {
    userName.value = 'Користувач';
  }
}

// Запустити отримання імені при монтуванні та при зміні користувача
onMounted(() => {
  fetchUserName();
});

watch(user, (newUser) => {
  if (newUser) {
    fetchUserName();
  } else {
    userName.value = 'Користувач';
  }
}, { immediate: true });

async function handleLogout() {
  const { error } = await client.auth.signOut();
  if (error) {
    console.error("Помилка при виході:", error.message);
  } else {
    router.push('/login');
  }
}

const openProfileModal = () => {
  console.log('Main: openProfileModal called, current state:', isProfileModalOpen.value);
  isProfileModalOpen.value = true;
  console.log('Main: isProfileModalOpen set to:', isProfileModalOpen.value);
};

const openSettingsModal = () => {
  isSettingsModalOpen.value = true;
};

const goToHelp = () => {
  router.push('');
};

// Функції для зміни теми
const setColorMode = (mode: string) => {
  colorMode.preference = mode;
};

// Функція для отримання назви режиму українською
const getModeName = (mode: string) => {
  switch (mode) {
    case 'light':
      return 'Світла';
    case 'dark':
      return 'Темна';
    case 'system':
      return 'Системна';
    case 'sepia':
      return 'Сепія';
    default:
      return 'Системна';
  }
};
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="ml-5 mb-5 cursor-pointer rounded-full w-10 h-10 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          <Icon name="mingcute:settings-6-fill" size="25" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="ml-5 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
        <DropdownMenuLabel class="text-gray-700 dark:text-gray-300 font-semibold px-2 py-1 flex items-center gap-2">
          <span>{{ userName }}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator class="bg-gray-200 dark:bg-gray-600 my-1" />

        <DropdownMenuItem @click="openProfileModal" class="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200">
          <Icon name="lucide:user" size="20" class="text-gray-600 dark:text-gray-400" />
          <span>Профіль</span>
          <span class="ml-auto text-xs text-gray-400">{{ isProfileModalOpen ? 'Відкрито' : 'Закрито' }}</span>
        </DropdownMenuItem>
        
      

        <DropdownMenuSeparator class="bg-gray-200 dark:bg-gray-600 my-1" />

        <!-- Color Mode Icons Section -->
        <div class="flex items-center gap-2 px-2 py-2">
          <!-- Light Mode -->
          <button 
            @click="setColorMode('light')"
            class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            :class="{ 
              'bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400': colorMode.preference === 'light',
              'bg-gray-100 dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20': colorMode.preference !== 'light'
            }"
            :title="'Світла тема'"
          >
            <Icon 
              name="lucide:sun" 
              size="20" 
              :class="{ 
                'text-yellow-600 dark:text-yellow-400': colorMode.preference === 'light',
                'text-gray-600 dark:text-gray-400': colorMode.preference !== 'light'
              }" 
            />
          </button>

          <!-- Dark Mode -->
          <button 
            @click="setColorMode('dark')"
            class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            :class="{ 
              'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400': colorMode.preference === 'dark',
              'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20': colorMode.preference !== 'dark'
            }"
            :title="'Темна тема'"
          >
            <Icon 
              name="lucide:moon" 
              size="20" 
              :class="{ 
                'text-indigo-600 dark:text-indigo-400': colorMode.preference === 'dark',
                'text-gray-600 dark:text-gray-400': colorMode.preference !== 'dark'
              }" 
            />
          </button>

          <!-- System Mode -->
          <button 
            @click="setColorMode('system')"
            class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            :class="{ 
              'bg-gray-200 dark:bg-gray-600 ring-2 ring-gray-400': colorMode.preference === 'system',
              'bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600': colorMode.preference !== 'system'
            }"
            :title="'Системна тема'"
          >
            <Icon 
              name="lucide:monitor" 
              size="20" 
              :class="{ 
                'text-gray-700 dark:text-gray-300': colorMode.preference === 'system',
                'text-gray-600 dark:text-gray-400': colorMode.preference !== 'system'
              }" 
            />
          </button>
        </div>

        <DropdownMenuSeparator class="bg-gray-200 dark:bg-gray-600 my-1" />

        <DropdownMenuItem @click="goToHelp" class="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200">
          <Icon name="ion:help-circle-outline" size="20" class="text-gray-600 dark:text-gray-400" />
          <NuxtLink target="_blank" to="https://t.me/denyalove">Допомога</NuxtLink>
        </DropdownMenuItem>
        
        <DropdownMenuItem @click="handleLogout" class="flex items-center gap-2 px-2 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer transition-colors duration-200">
          <Icon name="lucide:log-out" size="20" class="text-red-600 dark:text-red-400" />
          <span>Вийти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ProfileModal v-model:open="isProfileModalOpen" />
    
  </div>
</template>