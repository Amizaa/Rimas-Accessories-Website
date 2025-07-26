<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { priceToPersianWords, separatePrice } from 'price-seprator';
import ShoppingCart from '~/assets/images/shopping_cart.svg'

const toast = useToast()

  const promoCode = ref()
  const promoMessage = ref("") 
  const promoValid = ref(false)
  const discount = ref(0)
  const freeDelivery = ref(false)

  const promoValidation = () => {
    const result = usePromoCode(promoCode.value)  // Assuming promoCode is a ref

    promoMessage.value = result.promoMessage
    promoValid.value = result.promoValid
    discount.value = (subtotal.value * result.discount) / 100
    freeDelivery.value = result.freeDelivery

    if (!promoValid.value) {
      toast.add({
      title: promoMessage.value,
      description: 'دوباره امتحان کنید',
      color: 'error'
    })
    }else{
      toast.add({
      title: promoMessage.value,
      color: 'success'
    })
    }

  }

    const cartItems = ref ([
          {
            name: "Laptop",
            model: "XPS 13",
            hsCode: "847130",
            quantity: 1,
            weight: 2.5,
            perPieceRate: 100000,
            totalPrice: 100000,
            color: "Silver",
            deliveryMethod: "Air",
            description: "A powerful and lightweight laptop with excellent performance.",
            isEditingDescription: false,
            originalDescription: "",
            showDescription: false,
            image: "https://via.placeholder.com/150"
          },
          {
            name: "Smartphone",
            model: "iPhone 14",
            hsCode: "851712",
            quantity: 2,
            weight: 0.5,
            perPieceRate: 250000,
            totalPrice: 500000,
            color: "Black",
            deliveryMethod: "Ship",
            description: "The latest iPhone with advanced camera and processing power.",
            isEditingDescription: false,
            originalDescription: "",
            showDescription: false,
            image: "https://via.placeholder.com/150"
          }
    ])
    
    
  const delivryOptions = ref([
    {
      label: 'شرکت پست',
      value: 'post',
      description: 'تحویل در 5 الی 7 روز کاری',
      ui:{wrapper:'cursor-pointer'},
      price: 45000
    },
    {
      label: 'تیپاکس',
      value: 'tipax',
      description: 'تحویل در 3 الی 5 روز کاری',
      ui:{wrapper:'cursor-pointer'},
      price: 65000
    },
  ])

const updateQuantity = (index, newQuantity) => {
  const item = cartItems.value[index]
  console.log(item);
  item.quantity = newQuantity
  console.log(item.quantity);
  item.totalPrice = Number((item.perPieceRate * newQuantity).toFixed(2))
}

    
const deliveryOption = ref('post')

const colorItems = ref(['گلد', 'قرمز', 'آبی'])
const modelItems = ref([101,105,110])
const sizeItems = ref([10,12,14,18])

const number = ref([])

const subtotal = computed (() => {
 return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
})

const deliveryCost = computed(() => {
  if (freeDelivery.value) {
    return 0
  }
  const selected = delivryOptions.value.find(opt => opt.value === deliveryOption.value);
  return selected?.price ?? 0;
});


const total = computed(() => {
  return subtotal.value + deliveryCost.value - discount.value
})

</script>

<template>
  <div class="container mx-auto p-4 max-w-6xl">
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
                <img src="/assets/images/necklace.png" alt="Product" class="w-20 h-20 object-cover rounded">
                <div>
                    <h2 class="font-semibold text-lg">{{item.name}}</h2>
                    <p class="text-sm text-gray-600">{{item.model}}</p>
                </div>
                </div>
                <button class="text-red-500 hover:text-red-700">
                <TrashIcon class="w-8"/>
                </button>
            </div>
            
            <div class="mt-4 space-y-2">
                <div class="flex justify-between">
                <span class="text-gray-600">کد:</span>
                <span >{{item.hsCode}}</span>
                </div>
                

                    <div class="flex items-center">
                      <span class="text-sm text-gray-600 ml-2">رنگ:</span>
                      <CartSelect value="قرمز" :items="colorItems" class="w-full" />
                    </div>
                    <div class="flex items-center">
                    <span class="text-sm text-gray-600 ml-2">مدل:</span>
                      <CartSelect value="101" :items="modelItems" class="w-full" />
                    </div>
                    <div class="flex items-center">
                    <span class="text-sm text-gray-600 ml-2 ">سایز:</span>
                      <CartSelect value="10" :items="sizeItems" class="w-full" />
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
                              :min="1" :max="10"
                              size="sm"
                              color="neutral" highlight
                              @update:modelValue="val => updateQuantity(index, val)"
                            />
                </div>
                </div>
            
                
                <div class="flex justify-between font-medium">
                <span>قیمت:</span>
                <span>{{separatePrice(item.perPieceRate)}} تومان</span>
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
                    <th class="py-3 px-4 ">محصول</th>
                    <th class="py-3 px-4 t">جزئیات</th>
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
                                <img src="/assets/images/necklace.png" alt="Product" class="w-20 h-20 object-cover rounded">
                                <div>
                                <h3 class="font-medium">{{item.name}}</h3>
                                <p class="text-sm text-gray-600">{{item.model}}</p>
                                <p class="text-xs text-gray-500">کد: {{item.hsCode}}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-4">
                            <div class="space-y-2">
                                <div class="flex items-center">
                                  <span class="text-sm text-gray-600 mx-2">رنگ:</span>
                                  <CartSelect value="قرمز" :items="colorItems" class="w-full" />
                                </div>
                                <div class="flex items-center">
                                <span class="text-sm text-gray-600 mx-2">مدل:</span>
                                  <CartSelect value="101" :items="modelItems" class="w-full" />
                                </div>
                                <div class="flex items-center">
                                <span class="text-sm text-gray-600 mx-2">سایز:</span>
                                  <CartSelect value="10" :items="sizeItems" class="w-full" />
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
                              :min="1" :max="10"
                              size="sm"
                              color="neutral" highlight
                              @update:modelValue="val => updateQuantity(index, val)"
                            />
                          </div>      
                        </td>
                        <td class="py-4 px-4 text-right">
                            <span class="font-medium">{{separatePrice(item.perPieceRate)}} تومان</span>
                        </td>
                        <td class="py-4 px-4 text-right">
                            <span class="font-bold">{{separatePrice(item.totalPrice)}} تومان</span>
                        </td>
                        <td class="py-4 px-4 text-center">
                            <button class=" cursor-pointer text-red-500 hover:text-red-700 p-1">
                                <TrashIcon class="w-8"/>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class=" w-full" colspan="6">
                          <div class="flex justify-center w-full">
                            <button class=" rounded-full bg-indigo-400 hover:bg-indigo-500 transition-all cursor-pointer my-5 p-3 text-white">بروزرسانی سبد خرید</button>
                          </div>
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
                <URadioGroup v-model="deliveryOption" size="xl" indicator="hidden" variant="card" default-value="post" :items="delivryOptions" />
            </div>
          </div>
          
          <!-- Promo Code -->
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
            <div class="mt-2 text-sm" :class="promoValid ? 'text-green-600' : 'text-red-600'">
              <span >{{promoMessage}}</span>
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