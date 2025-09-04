import { defineStore } from 'pinia'

export const useCart = defineStore('cart', {
  state: () => {
  const cartCookie = useCookie('cart')
  const promoCookie = useCookie('promo')
  const shippingCookie = useCookie('shipping')

  return {
    cart: cartCookie.value || [],
    promocode: promoCookie.value || null,
    shipping: shippingCookie.value || null
  }
  },

  getters: {
    subtotal: (state) =>
      state.cart.reduce((sum, item) =>
        sum + (item.unitPrice || 0) * (item.quantity || 1), 0
      ),

    discountAmount: (state) => {
      if (!state.promocode) return 0

      return state.promocode.value
    },

    shippingCost: (state) => state.shipping ? state.shipping.price : 0,

    totalPrice: (state) =>
      Math.max(0, state.subtotal - state.discountAmount + state.shippingCost)
  },

  actions: {
    // ---------------- Cart ----------------
    addToCart(item) {
      const existing = this.cart.find(
        i => i.variantId === item.variantId && i.productId === item.productId
      )

      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        this.cart.push({
          ...item,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice // 👈 keep stable
        })
      }

      this.saveCart()
    },

    updateCartItem(original, updates) {
      const originalIndex = this.cart.findIndex(i =>
        i.variantId === original.variantId && i.productId === original.productId
      )
      if (originalIndex === -1) return

      const updatedItem = { ...this.cart[originalIndex], ...updates }

      const duplicateIndex = this.cart.findIndex((i, idx) =>
        idx !== originalIndex &&
        i.variantId === updatedItem.variantId &&
        i.productId === updatedItem.productId
      )

      if (duplicateIndex !== -1) {
        this.cart[duplicateIndex].quantity += updatedItem.quantity
        this.cart.splice(originalIndex, 1)
      } else {
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
      this.promocode = null
      this.shipping = null
      this.saveCart()
    },

    // ---------------- Promo ----------------
    applyPromo(promo) {
      this.promocode = promo
      this.saveCart()
    },
    updatePromo(updates) {
      this.promocode = { ...updates }
      this.saveCart()
    },
    removePromo() {
      this.promocode = null
      this.saveCart()
    },

    // ---------------- Shipping ----------------
    setShipping(shippingMethod) {
      this.shipping = shippingMethod
      this.saveCart()
    },
    updateShipping(updates) {
      this.shipping = { ...updates }
      this.saveCart()
    },
    removeShipping() {
      this.shipping = null
      this.saveCart()
    },

    // ---------------- Save ----------------
    saveCart() {
      const cartCookie = useCookie('cart', { maxAge: 60 * 60 * 24 * 7 })
      cartCookie.value = this.cart   // no JSON.stringify

      const promoCookie = useCookie('promo', { maxAge: 60 * 60 * 24 * 7 })
      promoCookie.value = this.promocode

      const shippingCookie = useCookie('shipping', { maxAge: 60 * 60 * 24 * 7 })
      shippingCookie.value = this.shipping
    }
  }
})
