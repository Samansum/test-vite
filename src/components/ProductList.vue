<script setup lang="ts">
import { ref, computed } from 'vue'
import { stockService } from '../services/stockService'
import { Product } from '../types/stock'
import ProductForm from './ProductForm.vue'
import ProductMovement from './ProductMovement.vue'

const products = ref<Product[]>(stockService.getProducts())
const selectedProduct = ref<Product | null>(null)
const showForm = ref(false)
const showMovementForm = ref(false)
const searchTerm = ref('')

const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value
  
  const term = searchTerm.value.toLowerCase()
  return products.value.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term)
  )
})

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(p => p.category))
  return Array.from(uniqueCategories)
})

function refreshProducts() {
  products.value = stockService.getProducts()
}

function selectProduct(product: Product) {
  selectedProduct.value = product
  showMovementForm.value = true
}

function editProduct(product: Product) {
  selectedProduct.value = product
  showForm.value = true
}

function deleteProduct(product: Product) {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    stockService.deleteProduct(product.id)
    refreshProducts()
  }
}

function openAddForm() {
  selectedProduct.value = null
  showForm.value = true
}
</script>

<template>
  <div class="product-list">
    <div class="list-header">
      <h2>Products</h2>
      <div class="header-actions">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />
        <button @click="openAddForm" class="btn btn-primary">
          Add Product
        </button>
      </div>
    </div>

    <div class="product-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        :class="{ 'low-stock': product.quantity <= product.minStock }"
      >
        <div class="product-header">
          <h3>{{ product.name }}</h3>
          <span class="category-badge">{{ product.category }}</span>
        </div>
        
        <div class="product-details">
          <div class="detail-row">
            <span class="label">Stock:</span>
            <span class="value">{{ product.quantity }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Price:</span>
            <span class="value">${{ product.price.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Min Stock:</span>
            <span class="value">{{ product.minStock }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Value:</span>
            <span class="value">${{ (product.price * product.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="product-actions">
          <button @click="selectProduct(product)" class="btn btn-secondary">
            Add Movement
          </button>
          <button @click="editProduct(product)" class="btn btn-outline">
            Edit
          </button>
          <button @click="deleteProduct(product)" class="btn btn-danger">
            Delete
          </button>
        </div>

        <div v-if="product.quantity <= product.minStock" class="low-stock-alert">
          ⚠️ Low Stock Alert
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProductForm 
      v-if="showForm" 
      :product="selectedProduct"
      @close="showForm = false"
      @saved="refreshProducts"
    />

    <ProductMovement 
      v-if="showMovementForm" 
      :product="selectedProduct"
      @close="showMovementForm = false"
      @saved="refreshProducts"
    />
  </div>
</template>

<style scoped>
.product-list {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.list-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 300px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;
  position: relative;
}

.product-card:hover {
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.product-card.low-stock {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.category-badge {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-row .label {
  color: #6b7280;
}

.detail-row .value {
  font-weight: 600;
  color: #1f2937;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.low-stock-alert {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-bottom-left-radius: 8px;
}

/* Button styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #10b981;
  color: white;
}

.btn-secondary:hover {
  background-color: #059669;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>