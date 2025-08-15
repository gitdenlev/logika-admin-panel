<template>
  <NuxtLayout>
    <div
      class="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-sans flex flex-col items-center justify-center text-center min-h-screen transition-colors duration-200"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl dark:shadow-gray-950/50 max-w-lg w-full transition-colors duration-200"
      >
        <div class="flex items-center justify-center gap-4 mb-8">
          <Icon
            name="emojione:construction"
            size="90"
            class="text-gray-400 dark:text-gray-500"
          />
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Вибачте, але ця сторінка ще знаходиться в розробці.
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          Ми активно працюємо над тим, щоб незабаром додати сюди ваші круті
          досягнення. Поверніться трохи пізніше!
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 mt-8 text-[#7B68EE] dark:text-[#8B7EFF] hover:text-[#7B68EE]/80 dark:hover:text-[#8B7EFF]/80 font-bold transition-colors duration-300"
        >
          <Icon name="lucide:arrow-left" size="20" />
          <span>Повернутись на головну</span>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>