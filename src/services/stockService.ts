import type {Product, StockMovement, Category} from '../types/stock.ts'

class StockService {
  private products: Product[] = []
  private movements: StockMovement[] = []
  private categories: Category[] = []

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Sample categories
    this.categories = [
      { id: '1', name: 'Electronics', description: 'Electronic devices and accessories' },
      { id: '2', name: 'Clothing', description: 'Apparel and fashion items' },
      { id: '3', name: 'Food', description: 'Grocery and food products' }
    ]

    // Sample products
    this.products = [
      {
        id: '1',
        name: 'Wireless Headphones',
        category: 'Electronics',
        quantity: 25,
        price: 99.99,
        minStock: 10,
        description: 'Noise-cancelling wireless headphones',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'T-Shirt',
        category: 'Clothing',
        quantity: 50,
        price: 19.99,
        minStock: 20,
        description: 'Cotton t-shirt in various colors',
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'Coffee Beans',
        category: 'Food',
        quantity: 100,
        price: 15.50,
        minStock: 30,
        description: 'Premium Arabica coffee beans',
        lastUpdated: new Date()
      }
    ]

    // Sample movements
    this.movements = [
      {
        id: '1',
        productId: '1',
        type: 'IN',
        quantity: 30,
        reason: 'Supplier delivery',
        date: new Date(Date.now() - 86400000),
        reference: 'PO-001'
      },
      {
        id: '2',
        productId: '1',
        type: 'OUT',
        quantity: 5,
        reason: 'Customer sale',
        date: new Date(Date.now() - 43200000),
        reference: 'INV-001'
      }
    ]
  }

  // Products
  getProducts(): Product[] {
    return [...this.products]
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id)
  }

  addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastUpdated: new Date()
    }
    this.products.push(newProduct)
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id)
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates, lastUpdated: new Date() }
      return this.products[index]
    }
    return undefined
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id)
    if (index !== -1) {
      this.products.splice(index, 1)
      return true
    }
    return false
  }

  // Categories
  getCategories(): Category[] {
    return [...this.categories]
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    this.categories.push(newCategory)
    return newCategory
  }

  // Stock Movements
  getMovements(): StockMovement[] {
    return [...this.movements]
  }

  getMovementsByProduct(productId: string): StockMovement[] {
    return this.movements.filter(m => m.productId === productId)
  }

  addMovement(movement: Omit<StockMovement, 'id' | 'date'>): StockMovement {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      date: new Date()
    }
    this.movements.push(newMovement)

    // Update product quantity
    const product = this.getProductById(movement.productId)
    if (product) {
      if (movement.type === 'IN') {
        product.quantity += movement.quantity
      } else {
        product.quantity -= movement.quantity
      }
      product.lastUpdated = new Date()
    }

    return newMovement
  }

  // Analytics
  getLowStockProducts(): Product[] {
    return this.products.filter(p => p.quantity <= p.minStock)
  }

  getStockValue(): number {
    return this.products.reduce((total, product) => total + (product.price * product.quantity), 0)
  }

  getMovementSummary(productId?: string): { in: number; out: number; balance: number } {
    const movements = productId
      ? this.movements.filter(m => m.productId === productId)
      : this.movements

    const inTotal = movements
      .filter(m => m.type === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0)

    const outTotal = movements
      .filter(m => m.type === 'OUT')
      .reduce((sum, m) => sum + m.quantity, 0)

    return {
      in: inTotal,
      out: outTotal,
      balance: inTotal - outTotal
    }
  }
}

export const stockService = new StockService()