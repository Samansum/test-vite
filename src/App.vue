<script setup lang="ts">
import ProductList from './components/ProductList.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Stock Management System</h1>
    </header>
    <main class="app-main">
      <ProductList />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.app-header {
  background-color: #2563eb;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-message {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.welcome-message h2 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-message p {
  color: #6b7280;
  font-size: 1.1rem;
}
</style>