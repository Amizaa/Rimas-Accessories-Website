<script setup>
  const props = defineProps({
    item: Object,
  })

import { alert } from '#build/ui';
    import { separatePrice } from 'price-seprator'

</script>


<template>
    <div style="direction:rtl" class="bg-white text-right rounded-2xl shadow-xl group overflow-hidden transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer mb-4">
        <NuxtLink :to="`/product/${item.title.replaceAll(' ','-')}/${item.id}`" >
          <div class="h-48 w-full overflow-hidden">
                <img class="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] group-hover:scale-125 object-end" :src="item.image" :alt="item.title" />
          </div>
    
            <div class="p-6 pb-4 group-hover:bg-gray-700 duration-[0.3s] ">
        
                <h4 class="mt-1 font-semibold md:text-lg leading-tight truncate group-hover:text-indigo-300 duration-[0.3s]">{{item.title}}</h4>
    
                <p class="Card-info text-sm md:text-base text-gray-500 mt-2 group-hover:text-white line-clamp-2 min-h-[3rem] leading-[1.5rem] overflow-hidden">
                {{ item.features.join('، ') }}
                </p> 
            
          
              <div class="mt-4 flex items-center justify-center gap-1">
                <span class=" text-gray-500 group-hover:text-white text-xs md:text-sm line-through mx-2">{{ separatePrice(690000) }}</span>
                <span class=" text-gray-700 group-hover:text-white text-sm md:text-base">{{ separatePrice(item.price) }}</span>
                <span class=" text-gray-700 group-hover:text-white text-sm md:text-base">تومان</span>
              </div>
          </div>
        </NuxtLink>

    </div>

</template>

