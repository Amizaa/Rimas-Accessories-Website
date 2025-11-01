<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import shipping from '~/api/shipping.json'
import { priceToPersianWords,separatePrice } from 'price-seprator';
import ShoppingCart from '~/assets/images/shopping_cart.svg'
import { useCartStore } from '~/store/cart'

useHead({
  title: 'سبد خرید'
})

const shippingOptions = ref()
shippingOptions.value = shipping.map((opt) => ({
  label: opt.title,
  value: opt.label,
  description: opt.description,
  price: opt.cost,
  ui:{wrapper:'cursor-pointer'}
}))

const { addItem, setShipping, removeItem, updateItem} = useCartStore()

const cartStore = useCartStore()

const products =  ref([])
onMounted(async () => {
  cartStore.loadFromLocal()  // فقط در client
  const productIds = [...new Set(cartStore.items.map(item => item.productId))].join(',')
  products.value = await useFetchProducts({ ids: productIds })
})

const shippingOption = computed(() => cartStore.shipping_method?.name || '')


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
      productId: product.id,
      productTitle: product.title,
      image: product.images.find(img => img.is_primary)?.url ?? product.images[0].url,
      variantId: variant?.id || null,
      variantTitle: variant?.title || "Default",
      quantity: item.quantity,
      stock: variant?.stock,
      unitPrice: finalPrice,
      totalPrice: finalPrice * item.quantity
    }
  }).filter(Boolean)
}) 



const subtotal = computed (() => {
  return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
})

const shippingCost = computed(() => {
  const selected = shippingOptions.value.find(opt => opt.value === shippingOption.value);
  return selected?.price ?? 0;
});


const total = computed(() => {
  return subtotal.value + shippingCost.value 
})


function handleUpdate(item, value) {
    const original = item
    const updates = {
      quantity: value
    }

    updateItem(original.productId, original.variantId, updates)
}

function handleUpdateShipping(val) {
  const selected = shippingOptions.value.find(opt => opt.value === val);
  setShipping({name: selected.value})
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-6xl">
    {{ loading }}
  <Stepper :active="0" class="my-10"/>
    <!-- Header with cart count -->
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-azarmehrbold text-gray-800">سبد خرید</h1>
        <div class="bg-indigo-400 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <ShoppingCart class="w-7 h-7 fill-white relative"/>
            <span class="text-lg"> {{cartItems.length}}</span>
        </div>
    </div>

    <div class="space-y-6">
        <!-- Empty Cart Message -->
        <div v-if="cartItems.length == 0" class="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingCart class="w-15 h-15 fill-indigo-300 mx-auto my-3" />
            <p class="text-xl text-gray-500">سبد خرید شما خالی است</p>
            <a href="/category/all" class="inline-block mt-4 bg-indigo-400 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition">
            ادامه خرید
            </a>
        </div>

        <!-- Mobile View (< sm breakpoint) -->
        <div class="sm:hidden">
            <div v-for="(item, index) in cartItems" :key="index" class="bg-white rounded-lg shadow-md p-4 mb-4">
            <div class="flex justify-between items-start">
                <div class="flex items-start space-x-3">
                <img :src="item.image" :alt="`${item.productTitle} - ${item.variantTitle}`" class="w-20 h-20 object-cover rounded">
                <div>
                    <h2 class="font-semibold text-lg">{{item.productTitle}}</h2>
                </div>
                </div>
                <button @click="removeItem(item.productId, item.variantId)" class="text-red-500 hover:text-red-700 cursor-pointer">
                <TrashIcon class="w-8"/>
                </button>
            </div>
            
            <div class="mt-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ item.variantTitle }}</span>
              </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">کد محصول:</span>
                  <span >{{item.productId}}</span>
                </div>

                
                <div class="flex justify-between items-center">
                <span class="text-gray-600">تعداد:</span>
                <div class="flex items-center">
                  <UInputNumber
                          v-model="item.quantity"
                          :increment="{
                            color: 'neutral',
                            class: 'cursor-pointer',
                            size: 'sm'
                          }"
                          :decrement="{
                            color: 'neutral',
                            class: 'cursor-pointer',
                            size: 'sm'
                          }"
                          :min="1" :max="item.stock"
                          size="sm"
                          color="neutral" highlight
                          @update:modelValue="val => handleUpdate(item, val)"
                        />
                </div>
                </div>
            
                
                <div class="flex justify-between font-medium">
                <span>قیمت:</span>
                <span>{{separatePrice(item.unitPrice)}} تومان</span>
                </div>
                
                <div class="flex justify-between font-bold">
                <span>قیمت کل:</span>
                <span>{{separatePrice(item.totalPrice)}} تومان</span>
                </div>
                
            </div>
            </div>
        </div>

        <!-- Tablet/Desktop View (≥ sm breakpoint) -->
        <div class="hidden sm:block">
            <div class="responsive-table">
                <table class="w-full bg-white rounded-lg shadow-md overflow-hidden" v-if="cartItems.length > 0">
                <thead class="bg-gray-50 text-gray-700">
                    <tr>
                    <th class="py-3 px-4 ">جزئیات محصول</th>
                    <th class="py-3 px-4 ">تعداد</th>
                    <th class="py-3 px-4 text-right">قیمت</th>
                    <th class="py-3 px-4 text-right">قیمت کل</th>
                    <th class="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in cartItems" :key="index" class="border-t border-gray-200 hover:bg-gray-50 transition">
                        <td class="py-4 px-4">
                            <div class="flex items-center space-x-3">
                                <img :src="item.image" :alt="`${item.productTitle} - ${item.variantTitle}`" class="w-20 h-20 object-cover rounded">
                                <div>
                                <h3 class="font-medium">{{item.productTitle}}</h3>
                                <p class="text-sm text-gray-600 mb-2">{{item.variantTitle}}</p>
                                <p class="text-xs text-gray-500">کد محصول: {{item.productId}}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-4 text-center">
                          <div class="flex justify-center my-4 gap-4 items-center">
                              <UInputNumber
                              v-model="item.quantity"
                              :increment="{
                                color: 'neutral',
                                class: 'cursor-pointer',
                                size: 'sm',
                              }"
                              :decrement="{
                                color: 'neutral',
                                class: 'cursor-pointer',
                                size: 'sm'
                              }"
                              :min="1" :max="item.stock"
                              size="sm"
                              color="neutral" highlight
                              @update:modelValue="val => handleUpdate(item, val)"
                            />
                          </div>      
                        </td>
                        <td class="py-4 px-4 text-right">
                            <span class="font-medium">{{separatePrice( item.unitPrice)}} تومان</span>
                        </td>
                        <td class="py-4 px-4 text-right">
                            <span class="font-bold">{{separatePrice(item.totalPrice)}} تومان</span>
                        </td>
                        <td class="py-4 px-4 text-center">
                            <button @click="removeItem(item.productId, item.variantId)" class=" cursor-pointer text-red-500 hover:text-red-700 p-1">
                                <TrashIcon class="w-8"/>
                            </button>
                        </td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>

              <!-- Order Summary -->
      <div v-if="cartItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <!-- Shipping Options -->
          <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">گزینه های ارسال</h2>
            <div class="space-y-3">
                <URadioGroup v-model="shippingOption" size="xl" indicator="hidden" variant="card" default-value="post" :items="shippingOptions" @update:modelValue="val => handleUpdateShipping(val)" />
            </div>
          </div>
        

        </div>
        
        <!-- Order Total -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20">
            <h2 class="text-xl font-bold mb-4">خلاصه سفارشات</h2>
            <div class="space-y-3 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-600">جمع اولیه</span>
                <span class="font-medium">{{separatePrice(subtotal)}} تومان</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">هزینه ارسال</span>
                <span v-if="shippingCost > 0" class="font-medium">{{separatePrice(shippingCost)}} تومان</span>
                <span v-else class="font-medium">پس کرایه</span>
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
              <NuxtLink to="/checkout">
                <button 
                class="w-full cursor-pointer bg-indigo-400 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition flex items-center justify-center"
                :disabled="cartItems.length === 0"
                :class="{'opacity-50 cursor-not-allowed': cartItems.length === 0}"
                >
                    ثبت سفارش
                </button>
              </NuxtLink>
          </div>
        </div>
      </div>
      
    </div>

</div>

</template>

<style scoped>
    @media (max-width: 640px) {
      .cart-item-grid {
        display: block;
      }
    }
    
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    /* Responsive table */
    @media (max-width: 768px) {
      .responsive-table {
        overflow-x: auto;
      }
    }
  </style>