<script setup>
import { useCartStore } from "~/store/cart";
import shippings from '~/api/shipping.json'

  useHead({
      title: 'بررسی اطلاعات'
  })

  const toast = useToast()

  const { setPromo } = useCartStore()
  const cartStore = useCartStore()
  const products =  ref([])

  onMounted(async () => {
    cartStore.loadFromLocal()
    setPromo(null) 
    const productIds = [...new Set(cartStore.items.map(item => item.productId))].join(',')
    products.value = await useFetchProducts({ ids: productIds })
  })

const cartItems = computed(() => {
  return cartStore.items.map(item => {
    const product = products.value.find(p => p.id === item.productId)
    if (!product) return null
    
    const variant = product.variants.find(v => v.id === item.variantId)
    
    // determine price (variant price or product price)
    const basePrice = variant && variant.price !== null ? parseFloat(variant.price) : parseFloat(product.price)
    const finalPrice = product.discount > 0 ? basePrice * (1 - product.discount / 100) : basePrice

    if (item.quantity > variant?.stock) {
      item.quantity = variant?.stock
      handleUpdate(item, item.quantity)
    }

    return {
      product_title: product.title,
      variant_title: variant?.title || "Default",
      product_category: product.category.name,
      quantity: item.quantity,
      price: variant.price,
      discount: product.discount || 0,
      totalPrice: finalPrice * item.quantity
    }
  }).filter(Boolean)
}) 


const shipping = computed(() => {
  const selected = shippings.find(sh => sh.label === cartStore.shipping_method?.name);
  const shCost =  selected?.cost ?? 0;
  return {name: cartStore.shipping_method?.name, price: shCost}
})
const promo = computed(() => {return {id:cartStore.promo?.id, title: decodeURIComponent(cartStore.promo?.title),  discount: cartStore.promo?.discount, freeShipping: cartStore.promo?.freeShipping} })

const discount = computed(() => {
  if (promo.discount) {
    return subtotal.value * (promo.value.discount / 100)
  }
  return 0
})

const {saveOrder} = await useOrder()

async function handleSaveOrder(formData) {
  const payload = {
      address: parseInt(formData.selectedAddress), // selected address id
      shipping_method: shipping.value.name,
      shipping_cost: shipping.value.price,
      promo_used: promo.value?.id ?? null,
      description: formData.description || '',
      items: cartItems.value,
    }
    console.log(payload);
    
    const result = await saveOrder(payload)
    
    if (result.success) {
      toast.add({ title: 'موفق', description: result.success, color: 'success', onClose: () => window.location.reload() })
    } else {
      toast.add({ title: 'خطا', description: result.error , color: 'error' })
      
    }
  }
  
  const subtotal = computed (() => {
    return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
  })
  
  
  const shippingCost = computed(() => {return shipping.value.price;});
  
  
  const total = computed(() => {
    return subtotal.value + shippingCost.value 
  })
  
  const formRef = ref(null)
  
  async function handleCheckout() {
    
  if (formRef.value && typeof formRef.value.submitForm === 'function') {
    formRef.value.submitForm()
  } else {
    toast.add({ title: 'خطا', description: 'دوباره تلاش کنید', color: 'error' })
  }
}

</script>

<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <Stepper :active="1" class="my-10"/>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="md:col-span-2">
        <CheckoutForm ref="formRef"  @validated="handleSaveOrder"/>
        
        <CheckoutPromoForm />
      </div>
      
      
        <checkout-sidebar @checkout="handleCheckout" :shipping="shipping" :promo="promo" :subtotal="subtotal"/>

        </div>

        <div class="w-full flex p-2 justify-center md:justify-start my-5">
            <NuxtLink to="/cart">
                <button class="rounded-lg bg-white border-2 border-indigo-400 text-indigo-500 shadow p-2 flex items-center cursor-pointer"><span class="text-2xl mx-2">&rArr;</span> بررسی سبد خرید </button>
            </NuxtLink>
        </div>
        
      </div>

</template>