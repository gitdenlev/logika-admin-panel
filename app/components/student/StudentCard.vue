<template>
  <div class="max-w-sm rounded-2xl shadow-md bg-white border border-gray-200 p-6">
    <div class="flex items-center gap-4">
      <img :src="avatarUrl" class="w-16 h-16 rounded-full" />
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ name }}</h2>
        <p class="text-sm text-gray-500">Курс: {{ course }}</p>
      </div>
    </div>

    <div class="mt-6 text-sm text-gray-700 space-y-2">
      <div class="flex justify-between">
        <span class="font-medium text-gray-600">ID:</span>
        <span>{{ id }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-600">Пошта:</span>
        <span>{{ email }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-600">Баланс балів:</span>
        <span class="text-green-600 font-semibold">{{ points }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const name = 'Денис Іваненко';
const course = 'Python для початківців';
const id = 'STU-2025-0934';
const email = 'ivanenko@example.com';
const points = 320;

const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
  name
)}&background=0D8ABC&color=fff`;
</script>
