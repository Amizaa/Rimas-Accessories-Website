<script setup>
  const props = defineProps({
    item: Object,
  })

</script>


<template>
        <div :style="{'direction':'rtl', 'background-image': `url(${item.image})`}" ref="card" class=" bg-cover relative h-90 m-2 rounded-4xl hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-in-out">
            <NuxtLink to="#" class="">
                <div class="absolute flex w-full">
                    <h4 class="rounded-full m-4 bg-green-400 text-white text-sm px-3 py-1 shadow-tag">تخفیف</h4>
                </div>
                <div class="w-full flex flex-col space-y-2 absolute bottom-0 my-4 text-white p-3">
                    <h2 class="text-lg font-bold">{{item.title}}</h2>
                    <p class="text-sm mt-3 text-gray-300">{{item.features.join('، ')}}</p>
                    
                    <div class="text-center inline-block mt-4 space-x-2">
                        <span class="text-lg">{{ item.price }}</span>
                        <span class="text-sm text-gray-400 line-through">699,000</span>
                        <span class=" text-sm text-gray-300">تومان</span>

                    </div>
                </div>
                <div class="w-full h-full card-cover rounded-4xl"></div>
            </NuxtLink>
        </div> 
</template>

<style scope>

</style>