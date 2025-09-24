<script setup>
  useHead({
      title: 'بررسی اطلاعات'
  })

  const toast = useToast()

  const cartStore = useCart()
  cartStore.promocode = null
  
  const subtotal = computed (() => {
    return cartStore.cart?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  })
  const shipping = computed(() => {return {name: cartStore.shipping?.name, price: cartStore.shipping?.price} })
  const promo = computed(() => {return {title: cartStore.promocode?.title,  discount: cartStore.promocode?.discount, freeShipping: cartStore.promocode?.freeShipping, name: cartStore.promo?.name} })
  const productItems = cartStore.cart.map(item => ({
                                          variant: item.variantId,
                                          quantity: item.quantity,
                                          price: item.unitPrice
                                        }));

  const discount = computed(() => {
      if (promo.discount) {
        return subtotal.value * (promo.value.discount / 100)
      }
      return 0
  })
    
    const shippingCost = computed(() => {
      if (promo.freeShipping) {
        return 0
      }
      return shipping.value.price
    })

    const total = computed(() => {
        return subtotal.value + shippingCost.value
    })

    const {saveOrder} = await useOrder()

 async function handleSaveOrder(formData) {
    const payload = {
      address: parseInt(formData.selectedAddress), // selected address id
      shipping_method: shipping.value.name,
      total_amount: total.value,
      discount: discount.value,
      description: formData.description || '',
      items: productItems,
    }

    const result = await saveOrder(payload)

    if (result.success) {
        toast.add({ title: 'موفق', description: result.success, color: 'success' })
    } else {
          toast.add({ title: 'خطا', description: result.error , color: 'error' })

    }
  }

  

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