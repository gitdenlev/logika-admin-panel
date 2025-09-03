<script setup>
import { ref } from 'vue'

const topic = ref('')
const result = ref('')
const loading = ref(false)

async function generateQuiz() {
  if (!topic.value.trim()) return
  loading.value = true
  result.value = ''

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3.2:latest", // 👉 заміни на назву твоєї локальної моделі
        prompt: `Згенеруй HTML список <ul><li>...</li></ul> з питаннями квіза на тему: ${topic.value}`
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        const chunk = decoder.decode(value, { stream: true })
        chunk.split("\n").forEach(line => {
          if (line.trim() !== "") {
            try {
              const json = JSON.parse(line)
              if (json.response) result.value += json.response
            } catch (e) {
              console.warn("Parse error", e)
            }
          }
        })
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">🎯 Генератор квізів через Ollama</h1>

    <div class="flex gap-2 mb-4">
      <input
        v-model="topic"
        type="text"
        placeholder="Введи тему квіза"
        class="border rounded p-2 flex-1"
      />
      <button
        @click="generateQuiz"
        :disabled="loading"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {{ loading ? 'Генерується...' : 'Створити' }}
      </button>
    </div>

    <div
      v-if="result"
      v-html="result"
      class="border p-4 rounded bg-gray-50 shadow text-black"
    />
  </div>
</template>
