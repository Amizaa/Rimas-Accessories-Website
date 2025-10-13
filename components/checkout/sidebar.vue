<script setup>
import { separatePrice,priceToPersianWords } from 'price-seprator'

    const props = defineProps({
        subtotal: Number,
        shipping: Object,
        promo: Object,
    })

    const discount = computed(() => {
      if (props.promo.discount) {
        return props.subtotal * (props.promo.discount / 100)
      }
      return 0
    })
    
    const shippingCost = computed(() => {
      if (props.promo.freeShipping) {
        return 0
      }
      return props.shipping.price
    })

    const total = computed(() => {
        return props.subtotal + shippingCost.value - discount.value
    })

const emit = defineEmits(['checkout'])

function handleOrderSubmit() {
  emit('checkout')
}
</script>

<template>
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20">
            <div class="space-y-3 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-600">جمع اولیه</span>
                <span class="font-medium">{{separatePrice(subtotal)}} تومان</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">هزینه ارسال 
                  <span v-if="promo.freeShipping" class=" text-sm text-green-500">(ارسال رایگان)</span>
                  <span v-else class=" text-sm text-gray-500">({{shipping.name=='post' ? 'پست' : 'تیپاکس'}})</span>
                </span>
                <span class="font-medium">{{promo.freeShipping ? `0 تومان` : shipping.price > 0 ? `${separatePrice(shipping.price)} تومان` : 'پس کرایه'}}</span>
              </div>
              <div v-if="discount != 0"  class="flex justify-between text-green-600">
                <span>{{ promo.title }}</span>
                <span class="font-medium">{{separatePrice(discount)}}- تومان</span>
              </div>
              <div class="border-t pt-3 mt-3">
                <div class="flex justify-between font-bold text-lg">
                  <span>مبلغ نهایی</span>
                  <div class="flex flex-col text-center">
                      <span>{{separatePrice(total)}} تومان</span>
                      <span class="text-sm text-gray-400">({{priceToPersianWords(total)}})</span>
                  </div>
                </div>
              </div>
            </div>
                <button type="submit" @click="handleOrderSubmit"
                class="w-full cursor-pointer bg-indigo-400 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition flex items-center justify-center"
                >
                    نهایی سازی سفارش 
                </button>
          </div>
        </div>
</template>