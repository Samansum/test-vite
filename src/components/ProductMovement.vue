<script setup lang="ts">
import { ref } from 'vue'
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
  type: 'IN' as 'IN' | 'OUT',
  quantity: 0,
  reason: '',
  reference: ''
})

function saveMovement() {
  if (!props.product) return

  stockService.addMovement({
    productId: props.product.id,
    type: formData.value.type,
    quantity: formData.value.quantity,
    reason: formData.value.reason,
    reference: formData.value.reference
  })
  
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
        <h3>Add Stock Movement - {{ product?.name }}</h3>
        <button @click="closeForm" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="saveMovement" class="movement-form">
        <div class="form-group">
          <label for="type">Movement Type</label>
          <div class="type-options">
            <label class="type-option">
              <input
                type="radio"
                value="IN"
                v-model="formData.type"
                required
              />
              <span class="type-label">Stock In</span>
              <span class="type-desc">Add to inventory</span>
            </label>
            <label class="type-option">
              <input
                type="radio"
                value="OUT"
                v-model="formData.type"
                required
              />
              <span class="type-label">Stock Out</span>
              <span class="type-desc">Remove from inventory</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input
            id="quantity"
            v-model.number="formData.quantity"
            type="number"
            min="1"
            required
            class="form-input"
            :max="formData.type === 'OUT' ? product?.quantity : undefined"
          />
          <div v-if="formData.type === 'OUT'" class="stock-info">
            Current stock: {{ product?.quantity }}
          </div>
        </div>

        <div class="form-group">
          <label for="reason">Reason</label>
          <select
            id="reason"
            v-model="formData.reason"
            required
            class="form-input"
          >
            <option value="">Select a reason...</option>
            <option value="Supplier delivery">Supplier delivery</option>
            <option value="Customer sale">Customer sale</option>
            <option value="Return from customer">Return from customer</option>
            <option value="Damaged goods">Damaged goods</option>
            <option value="Inventory adjustment">Inventory adjustment</option>
            <option value="Internal use">Internal use</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="reference">Reference (Optional)</label>
          <input
            id="reference"
            v-model="formData.reference"
            type="text"
            class="form-input"
            placeholder="PO-123, INV-456, etc."
          />
        </div>

        <div class="form-actions">
          <button type="button" @click="closeForm" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Add Movement
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
  font-size: 1.1rem;
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

.movement-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-options {
  display: flex;
  gap: 1rem;
}

.type-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  position: relative;
}

.type-option:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.type-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.type-option input[type="radio"]:checked + .type-label {
  color: #2563eb;
  font-weight: 600;
}

.type-option input[type="radio"]:checked + .type-label + .type-desc {
  color: #60a5fa;
}

.type-label {
  font-weight: 500;
  color: #374151;
}

.type-desc {
  font-size: 0.8rem;
  color: #6b7280;
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

.stock-info {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
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