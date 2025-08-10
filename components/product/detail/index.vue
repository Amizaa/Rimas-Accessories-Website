<script setup>
    const props = defineProps({
        details: Array,
    })

    const route = useRoute()
    const name = route.params.name
    const id = route.params.id

    const available = true

    const items = ref(['گلد', 'آویز', 'دنجر', 'فلش بک'])

    const { addToCart, saveCart, cart } = useCart()
    

    const selectedSize = ref(null)
    const selectedModel = ref(null)
    const selectedColor = ref(null)
    const quantity = ref(1)
    

    const toast = useToast()


const handleAdd = () => {


  if (!selectedSize.value || !selectedModel.value || !selectedColor.value || !quantity.value) {
    toast.add({ title: 'خطا', description: 'لطفاً تمام گزینه‌ها را انتخاب کنید.', color: 'error' })

    return
  }
  addToCart({
    id: id,
    size: selectedSize.value,
    model: selectedModel.value,
    color: selectedColor.value,
    quantity: quantity.value
  })

  toast.add({ title: 'افزودن به سبد خرید', description: ' محصول با موفقیت به سبد خرید اضافه شد.', color: 'success' })

}
</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">

    <h1 class="text-4xl font-azarmehrbold text-center mb-4">{{ name.replaceAll('-',' ') }}</h1>
    <h5 class="text-lg text-zinc-500">کد: {{id}} </h5>
    <div class="flex flex-col">
        <ul class="text-lg text-start space-y-3 p-2 my-3">
            <li class="flex gap-2" v-for="(detail, index) in details" :key="index">
                <p class="rounded text-indigo-400 mr-3">✔</p>
                <p>{{detail}}</p>
            </li>
        </ul>
    </div>

    <ProductDetailSelect v-model="selectedSize" :items="items"   title="سایز" placeholder="سایز مورد نظر را انتخاب کنید"/>
    <ProductDetailSelect v-model="selectedModel" :items="items"  title="مدل" placeholder="مدل مورد نظر را انتخاب کنید"/>
    <ProductDetailSelect v-model="selectedColor" :items="items"  title="رنگ" placeholder="رنگ مورد نظر را انتخاب کنید"/>

    <ProductDetailPrice v-model="quantity" price="200000" off="0" :available="available" />
    
    <div v-if="available" class="flex justify-center mt-6">
      <button @click="handleAdd()"  class=" cursor-pointer p-2 rounded-full bg-indigo-400 text-center hover:bg-indigo-500 text-white transition-all duration-300">افزودن به سبد خرید</button>
    </div>
    
      <p v-if="successMessage" class="text-green-600 font-bold">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-500 font-bold">{{ errorMessage }}</p>

    
  </main>
</template>
