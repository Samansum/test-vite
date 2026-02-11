<script setup lang="ts">
import { ref, watch } from 'vue'
import { stockService } from '../services/stockService'
import { Product } from '../types/stock'

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const formData = ref({
  name: '',
  category: '',
  quantity: 0,
  price: 0,
  minStock: 0,
  description: ''
})

const categories = ref(['Electronics', 'Clothing', 'Food', 'Books', 'Toys'])

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name,
      category: newProduct.category,
      quantity: newProduct.quantity,
      price: newProduct.price,
      minStock: newProduct.minStock,
      description: newProduct.description || ''
    }
  } else {
    formData.value = {
      name: '',
      category: categories.value[0],
      quantity: 0,
      price: 0,
      minStock: 0,
      description: ''
    }
  }
}, { immediate: true })

function saveProduct() {
  if (props.product) {
    // Update existing product
    stockService.updateProduct(props.product.id, formData.value)
  } else {
    // Add new product
    stockService.addProduct(formData.value)
  }
  
  emit('saved')
  emit('close')
}

function closeForm() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeForm">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ product ? 'Edit Product' : 'Add New Product' }}</h3>
        <button @click="closeForm" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="saveProduct" class="product-form">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select
            id="category"
            v-model="formData.category"
            required
            class="form-input"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="quantity">Initial Quantity</label>
            <input
              id="quantity"
              v-model.number="formData.quantity"
              type="number"
              min="0"
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="minStock">Minimum Stock Level</label>
            <input
              id="minStock"
              v-model.number="formData.minStock"
              type="number"
              min="0"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="price">Price ($)</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="form-input"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="closeForm" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ product ? 'Update Product' : 'Add Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Button styles */
.btn {
  padding: 0.75rem 1.5rem;
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

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}
</style>