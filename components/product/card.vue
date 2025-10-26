<script setup>
  import Logo from '@/public/images/Logo.png'

  const props = defineProps({
    item: Object,
  })

    import { separatePrice } from 'price-seprator'

    const firstPrice = computed(() => {
      return Math.floor(props.item.price)
    }) 
    const actualPrice = computed(() => {
      return firstPrice.value * (1 - props.item.discount / 100)
    })

    const itemImage = computed(() => {
      const images = props.item?.images || []
      if (!images.length) return Logo

      const primary = images.find(img => img.is_primary)
      return primary?.url || images[0]?.url || Logo
    })


</script>


<template>
    <div style="direction:rtl" class="bg-white text-right rounded-2xl shadow-xl group overflow-hidden transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer mb-4">
      <a :href="`/product/${item.title.replaceAll(' ','-')}/${item.id}`" >
        <div class="h-48 w-full overflow-hidden relative">
          <img class="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] group-hover:scale-125 object-end" :src="itemImage" :alt="item.title" />
          <div v-if="item.discount" class="absolute p-2 bg-indigo-800 top-0 text-sm rounded-bl-2xl text-white text-center">تخفیف</div>
        </div>
        
        <div class="p-6 pb-4 group-hover:bg-gray-700 duration-[0.3s] ">
                <h4 class="mt-1 font-semibold md:text-lg leading-tight truncate group-hover:text-indigo-300 duration-[0.3s]">{{item.title}}</h4>
    
                <p class="Card-info text-sm md:text-base text-gray-500 mt-2 group-hover:text-white line-clamp-2 min-h-[3rem] leading-[1.5rem] overflow-hidden">
                {{ item.features.join('، ') }}
                </p> 
            
          
              <div class="mt-4 flex items-center justify-center gap-1">
                <span v-if="item.discount" class=" text-gray-500 group-hover:text-white text-xs md:text-sm line-through mx-2">{{ separatePrice(firstPrice) }}</span>
                <span class=" text-gray-700 group-hover:text-white text-sm md:text-base">{{ separatePrice(actualPrice) }}</span>
                <span class=" text-gray-700 group-hover:text-white text-sm md:text-base">تومان</span>
              </div>
          </div>
        </a>

    </div>

</template>

