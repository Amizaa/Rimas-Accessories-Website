<script setup>
    const props = defineProps({
        details: Array,
    })


</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
    <h1 class="text-4xl font-azarmehrbold text-center mb-4">{{ details.title }}</h1>
    <h5 class="text-lg text-zinc-500">کد: {{details.id}} </h5>
    <div class="flex flex-col">
        <ul class="text-lg text-start space-y-3 p-2 my-3">
            <li class="flex gap-2" v-for="(feature, index) in details.features" :key="index">
                <p class="rounded text-indigo-400 mr-3">✔</p>
                <p>{{feature}}</p>
            </li>
        </ul>
    </div>

    <ProductDetailItems :variants="details.variants" :discount="details.discount" :product-id="details.id"/>
 

    
  </main>
</template>
