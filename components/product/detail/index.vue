<script setup>
    const props = defineProps({
        details: Array,
    })

    const route = useRoute()
    const name = route.params.name
    const id = route.params.id

    const available = true

    const items = ref(['گلد', 'آویز', 'دنجر', 'فلش بک'])

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

    <ProductDetailSelect :items="items"  title="سایز" placeholder="سایز مورد نظر را انتخاب کنید"/>
    <ProductDetailSelect :items="items"  title="مدل" placeholder="مدل مورد نظر را انتخاب کنید"/>
    <ProductDetailSelect :items="items"  title="رنگ" placeholder="رنگ مورد نظر را انتخاب کنید"/>

    <ProductDetailPrice price="200000" off="0" :available="available" />
    
    <div v-if="available" class="flex justify-center mt-6">
      <button class=" cursor-pointer p-2 rounded-full bg-indigo-200 text-center hover:bg-indigo-400 text-white transition-all duration-300">افزودن به سبد خرید</button>
    </div>
    
    
  </main>
</template>
