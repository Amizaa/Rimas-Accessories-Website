import { defineStore } from 'pinia'

export const useCart = defineStore('cart', {
  state: () => {
    const cartCookie = useCookie('cart')
    try {
      return {
        cart: cartCookie.value ? cartCookie.value : []
      }
    } catch {
      return { cart: [] }
    }
  },


  actions: {
    addToCart(item) {
      const existing = this.cart.find(i =>
        i.id === item.id &&
        i.size === item.size &&
        i.model === item.model &&
        i.color === item.color
      )

      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        this.cart.push({ ...item, quantity: item.quantity || 1 })
      }
      this.saveCart()
    },

    updateCartItem(original, updates) {
      // Find the original item
      const originalIndex = this.cart.findIndex(i =>
        i.id === original.id &&
        i.size === original.size &&
        i.model === original.model &&
        i.color === original.color
      )

      if (originalIndex === -1) return

      // Build the updated item
      const updatedItem = {
        ...this.cart[originalIndex],
        ...updates
      }

      // Check if an identical item already exists (excluding the original)
      const duplicateIndex = this.cart.findIndex((i, idx) =>
        idx !== originalIndex &&
        i.id === updatedItem.id &&
        i.size === updatedItem.size &&
        i.model === updatedItem.model &&
        i.color === updatedItem.color
      )

      if (duplicateIndex !== -1) {
        // Merge quantities
        this.cart[duplicateIndex].quantity += updatedItem.quantity
        // Remove the original item
        this.cart.splice(originalIndex, 1)
      } else {
        // Just update the original item
        this.cart[originalIndex] = updatedItem
      }

      this.saveCart()
    },




    removeFromCart(index) {
      this.cart.splice(index, 1)
      this.saveCart()
    },

    clearCart() {
      this.cart = []
      this.saveCart()
    },
    
    saveCart() {
        const cartCookie = useCookie('cart',{ maxAge: 60 * 60 * 24 * 7 })
        cartCookie.value = JSON.stringify(this.cart)
    },
  
  }
})