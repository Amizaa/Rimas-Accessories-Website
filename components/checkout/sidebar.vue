<script setup>
import { separatePrice,priceToPersianWords } from 'price-seprator'

    const props = defineProps({
        subtotal: Number,
        deliveryCost: Number,
        discount: Number
    })

    const total = computed(() => {
        return props.subtotal + props.deliveryCost - props.discount
    })
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
                <span class="text-gray-600">هزینه ارسال</span>
                <span class="font-medium">{{separatePrice(deliveryCost)}} تومان</span>
              </div>
              <div v-if="discount != 0"  class="flex justify-between text-green-600">
                <span>تخفیف</span>
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
                <button 
                class="w-full cursor-pointer bg-indigo-400 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition flex items-center justify-center"
                >
                    نهایی سازی سفارش 
                </button>
          </div>
        </div>
</template>