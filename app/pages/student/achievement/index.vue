<template>
  <NuxtLayout>
    <div
      class="bg-gray-100 text-gray-600 font-sans flex flex-col items-center justify-center text-center"
    >
      <div class="bg-white rounded-3xl p-8 shadow-xl max-w-lg w-full">
        <div class="flex items-center justify-center gap-4 mb-8">
          <Icon
            name="fluent-emoji-high-contrast:building-construction"
            size="90"
            class="text-gray-400"
          />
        </div>
        <p class="text-lg text-gray-600 mb-4">
          Вибачте, але ця сторінка ще знаходиться в розробці.
        </p>
        <p class="text-gray-500">
          Ми активно працюємо над тим, щоб незабаром додати сюди ваші круті
          досягнення. Поверніться трохи пізніше!
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 mt-8 text-[#7B68EE] hover:text-[#7B68EE]/80 font-bold transition-colors duration-300"
        >
          <Icon name="lucide:arrow-left" size="20" />
          <span>Повернутись на головну</span>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
