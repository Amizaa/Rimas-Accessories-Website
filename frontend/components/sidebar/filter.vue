<script setup>
import { separatePrice } from 'price-seprator'

const categories = inject('categories')

const route = useRoute()

const value = ref([25000,2000000])
 
const minPrice = route.query.minPrice;
const maxPrice = route.query.maxPrice; 
const category = route.params.category

if (minPrice || maxPrice) {
  value.value[0] = minPrice
  value.value[1]= maxPrice
}

const minInput = ref(separatePrice(value.value[0]))
const maxInput = ref(separatePrice(value.value[1]))

watch(value, (newVal) => {
  minInput.value = separatePrice(newVal[0])
  maxInput.value = separatePrice(newVal[1])
})

watch([minInput, maxInput], ([min, max]) => {
  value.value = [
    Number(min.replace(/,/g, '')),
    Number(max.replace(/,/g, ''))
  ]
})

const submitFilter = () => {
  const params = new URLSearchParams()
  
  if (route.query.search) params.append('search', route.query.search)
  if (route.query.sortBy) params.append('sortBy', route.query.sortBy)
  params.append('minPrice', value.value[0])
  params.append('maxPrice', value.value[1])

  const fullUrl = `/category/${category}?${params.toString()}`
  navigateTo(fullUrl)


}

</script>


<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 py-4 md:block">
            <div class="sticky top-22">

                <div class="shadow-xl flex flex-col gap-2 rounded-xl p-2">
                    <h3 class="text-center underline underline-offset-12">دسته بندی ها</h3>
    
                    <NuxtLink v-for="category in categories" :key="category.name" :to="`/category/${category.slug}`" class="px-3 py-1 font-semibold hover:bg-indigo-200 rounded-md">
                        {{ category.name }}
                    </NuxtLink>
                </div>

                <div class="shadow-xl flex flex-col gap-2 rounded-xl p-2 mt-3">
                    <h3 class="text-center underline underline-offset-12">فیلتر ها</h3>

                    <h4 class="my-2">فیلتر قیمت</h4>
                    <USlider color="neutral" :max="2000000" :min="25000" :step="1000" v-model="value" />

                    <div class="flex justify-between gap-2 my-4">
                        <div>
                            <span class="text-sm text-gray-500">حداکثر قیمت</span>
                            <UInput v-model="maxInput"/>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">حداقل قیمت</span>
                            <UInput v-model="minInput" />
                        </div>
                    </div>
                    <button @click="submitFilter" class=" cursor-pointer p-2 rounded-full  text-center bg-indigo-400 hover:bg-indigo-500 text-white transition-all duration-300">اعمال</button>

                </div>

            </div>
    </aside>
</template>