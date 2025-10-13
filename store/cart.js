import { defineStore } from 'pinia'

  function encryptData(data) {
    return btoa(JSON.stringify(data)); // Convert to Base64 encoded string
  }

  function  decryptData(encodedData){
    try {
      const decryptedData = atob(JSON.parse(encodedData))
      return decryptedData; // Decode Base64 encoded string
    } catch (error) {
      localStorage.removeItem('cartData')
    }
  }

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    shipping_method: null,
    promo: null,
  }),

  actions: {
    async loadFromLocal() {
      if (!process.client) return

      const cart = localStorage.getItem('cartData')

      if (!cart) return

      const data = JSON.parse(decryptData(cart))
      this.items = data.cart || []
      this.shipping_method = data.shipping_method || null
      this.promo = data.promo || null
      
    },

    saveToLocal() {
      if (!process.client) return

      const data = {
        cart: this.items,
        shipping_method: this.shipping_method,
        promo: this.promo,
      }

      const cart = JSON.stringify(encryptData((data)))

      localStorage.setItem('cartData', cart)
    },

    // 🟡 افزودن یا افزایش تعداد آیتم
    async addItem({ productId, variantId, quantity = 1 }) {
      const existing = this.items.find(
        (item) => item.productId == productId && item.variantId == variantId
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ productId, variantId, quantity })
      }

      await this.saveToLocal()
    },

    // 🔴 حذف آیتم
    async removeItem(productId, variantId) {
      this.items = this.items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
      await this.saveToLocal()
    },

    // 🚚 تنظیم روش ارسال
    async setShipping(method) {
      this.shipping_method = method
      await this.saveToLocal()
    },

    // 💸 تنظیم کد تخفیف
    async setPromo(promoCode) {
      this.promo = promoCode
      await this.saveToLocal()
    },

    // 🧹 خالی کردن سبد
    async clearCart() {
      this.items = []
      this.shipping_method = null
      this.promo = null
      await this.saveToLocal()
    },

    // ✏️ ویرایش آیتم
    async updateItem(productId, variantId, updates = {}) {
      const item = this.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )
      if (!item) return

      if (updates.quantity !== undefined) item.quantity = updates.quantity
      await this.saveToLocal()
    },
  },
})
