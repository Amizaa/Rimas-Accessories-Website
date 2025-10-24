<script setup>
import { useCartStore } from '~/store/cart'

  const promoCode = ref('')

  const toast = useToast()

  const { setPromo } = useCartStore()
  const cartStore = useCartStore()
  cartStore.loadFromLocal() 

  async function promoValidation() {
    const { data, error } = await validateAndApplyPromo(promoCode.value.toUpperCase(), 1)

    if (error) {

      toast.add({
        title: 'خطا',
        description: error.error,
        color: 'error'
      })

    } else {

      toast.add({
        title: 'اعمال کد تخفیف',
        description: `تخفیف ${data.title} برای شما اعمال شد`,
        color: 'success'
      })

      setPromo({id: data.id, title: encodeURIComponent(data.title), discount: data.discount, freeShipping: data.free_shipping})
    }
  }
</script>

<template>
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 class="text-lg font-semibold mb-4">کد تخفیف</h2>
            <div class="flex">
              <input 
                type="text" 
                v-model="promoCode" 
                placeholder="کد تخفیف خود را وارد کنید" 
                class="flex-grow border rounded-r-2xl p-2"
              >
              <button @click="promoValidation()"
                class="bg-indigo-400 text-white px-4 py-2 rounded-l-2xl hover:bg-indigo-500 transition-all duration-300 cursor-pointer"
              >
                اعمال کد تخفیف
              </button>
            </div>
        </div>
</template>