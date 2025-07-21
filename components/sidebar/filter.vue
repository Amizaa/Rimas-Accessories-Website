<script setup>
const categories = [
  { name: 'گوشواره', description: 'زیباترین گوشواره ها' },
  { name: 'گردنبند', description: 'با گردنبد های ما شیک شوید'},
  { name: 'دستبند', description: 'مناسب دست های ظریف شما' },
  { name: 'پابند', description: 'اصیل و زیبا بمانید'},
  { name: 'ست', description: 'برای پارتنر های عاشق'},

]

const route = useRoute()
const router = useRouter()

const value = ref([25000,2000000])

// const priceRange = computed(() => {
//     const minPrice = route.query.minPrice;
//     const maxPrice = route.query.maxPrice;
    
//     if(minPrice && maxPrice){
//         value[0] = minPrice
//         value[1] = maxPrice
//         return 0
//     }
// })


const onChangePrice = () => {
    router.push({
      query: {
        minPrice: value.value[0],
        maxPrice: value.value[1],
      }
    });
}

</script>


<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 py-4 md:block">
            <div class="sticky top-22">

                <div class="shadow-xl flex flex-col gap-2 rounded-xl p-2">
                    <h3 class="text-center underline underline-offset-12">دسته بندی ها</h3>
    
                    <NuxtLink v-for="category in categories" :key="category.name" :to="`/category/${category.name}`" class="px-3 py-1 font-semibold hover:bg-indigo-200 rounded-md">
                        {{ category.name }}
                    </NuxtLink>
                </div>

                <div class="shadow-xl flex flex-col gap-2 rounded-xl p-2 mt-3">
                    <h3 class="text-center underline underline-offset-12">فیلتر ها</h3>

                    <h4 class="my-2">فیلتر قیمت</h4>
                    <USlider color="neutral" :max="2000000" :min="25000" :step="1000" v-model="value" />

                    <div class="flex justify-between gap-2 my-4">
                        <div>
                            <span class="text-sm text-gray-500">حداقل قیمت</span>
                            <UInput v-model="value[0]" />
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">حداکثر قیمت</span>
                            <UInput v-model="value[1]" />
                        </div>
                    </div>
                    <button @click="onChangePrice" class=" cursor-pointer p-2 rounded-full  text-center bg-indigo-400 hover:bg-indigo-500 text-white transition-all duration-300">اعمال</button>

                </div>

            </div>
    </aside>
</template>