<script setup>
    const route = useRoute()
    
    const category = route.params.category == 'all' ? 'همه محصولات' : `دسته بندی ${route.params.category}`
    const products = ref([])

watch(
  () => [route.query, route.params],
  async () => {
    const updatedParams = {}

    if (route.params.category !== 'all') {
      updatedParams.category = route.params.category
    }

    if (route.query.search) {
      updatedParams.search = route.query.search
    }

    if (route.query.minPrice || route.query.maxPrice) {
      updatedParams.minPrice = route.query.minPrice
      updatedParams.maxPrice = route.query.maxPrice
    }

    products.value = await useFetchProducts(updatedParams)
  },
  { immediate: true, deep: true }
)

    const itemsPerPage = 3
    const page = ref(1)

    const sortItems = ref([
  {
    label: 'جدید ترین',
    value: 'date-desc'
  },
  {
    label: 'ارزان ترین',
    value: 'price-asc'
  },
  {
    label: 'گران ترین',
    value: 'price-desc'
  },

])
    const sortBy = ref('date-desc')

  const sortedProducts = computed(() => {
    return [...products.value].sort((a, b) => {
      switch (sortBy.value) {
        case 'date-desc':
          return new Date(b.add_date) - new Date(a.add_date)
        case 'price-desc':
          return (b.price* (1 - b.discount / 100)) - (a.price* (1 - a.discount / 100))
        case 'price-asc':
          return (a.price* (1 - a.discount / 100)) - (b.price* (1 - b.discount / 100))
        default:
          return 0
          }
        })
    })


const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedProducts.value.slice(start, end)
})



</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
    <BreadcrumbCategory />
    <h1 class="text-2xl text-center mt-4" v-if="search">نتیجه جست و جو برای <span class=" font-azarmehrbold">{{search}}</span></h1>
    <h1 class="text-2xl text-center mt-4" v-else>{{ category }}</h1>

    <div v-if="paginatedProducts.length == 0" class="mt-5">
        <h1 class="text-xl text-center text-red-900">محصولی برای نمایش وجود ندارد</h1>
    </div>
    <div v-else class="p-2 md:p-4">
        <div class="flex justify-start gap-2 my-5 items-center">
          <span class=" text-sm font-semibold">مرتب سازی بر اساس: </span>
          <USelect v-model="sortBy" :items="sortItems" class="w-48" />
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <li v-for="(product, index) in paginatedProducts" :key="index">
            <ProductCard :item="product" class="w-full shadow-tag" />
            </li>
        </ul>

      <div class="flex justify-center my-5" style="direction:ltr">
          <UPagination
            v-model:page="page"
            :total="products.length"
            :items-per-page="itemsPerPage"
            :ui="{ wrapper: 'justify-center mt-6' }"
            active-color="neutral"
            show-edges
            show-controls
            :sibling-count="1"
          />
      </div>
    </div>
  </main>
</template>
