<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function resetCount() {
  count.value = 0
}
</script>

<template>
  <div class="counter-container">
    <button type="button" @click="resetCount" class="reset-btn">Reset</button>
    <button type="button" @click="count++">Count: {{ count }}</button>
  </div>
</template>

<style scoped>
.counter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

button {
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  margin: 0 0.5rem;
}

button:hover {
  transform: scale(1.05);
  background-color: #2563eb;
}

.reset-btn {
  background-color: #ef4444;
}

.reset-btn:hover {
  background-color: #dc2626;
}
</style>
