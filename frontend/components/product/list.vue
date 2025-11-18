<script setup>
const route = useRoute()
const router = useRouter()

const category = computed(() =>
  route.params.category === "all"
    ? "همه محصولات"
    : `دسته بندی ${route.params.category}`
)

const products = ref([])
const itemsPerPage = ref(12)
const totalItems = ref(0)
const page = ref(Number(route.query.page) || 1)

const sortItems = ref([
  { label: "جدید ترین", value: "date-desc" },
  { label: "ارزان ترین", value: "price-asc" },
  { label: "گران ترین", value: "price-desc" },
])
const sortBy = ref(route.query.sortBy || "date-desc") 

// sync sortBy and page with URL
watch([sortBy, page], () => {
  const params = new URLSearchParams()

  if (route.query.search) params.append("search", route.query.search)
  if (sortBy.value) params.append("sortBy", sortBy.value)
  if (route.query.minPrice) params.append("minPrice", route.query.minPrice)
  if (route.query.maxPrice) params.append("maxPrice", route.query.maxPrice)
  if (page.value) params.append("page", page.value) 

  const fullUrl = `/category/${route.params.category}?${params.toString()}`
  navigateTo(fullUrl)
})

// fetch products when route or page changes
watch(
  () => [route.query, route.params, page.value],
  async () => {
    const updatedParams = {}

    if (route.params.category && route.params.category !== "all") {
      updatedParams.category = route.params.category
    }
    if (route.query.search) updatedParams.search = route.query.search
    if (route.query.minPrice) updatedParams.minPrice = route.query.minPrice
    if (route.query.maxPrice) updatedParams.maxPrice = route.query.maxPrice
    if (route.query.sortBy) {
      sortBy.value = route.query.sortBy
      updatedParams.sortBy = route.query.sortBy
    }

    updatedParams.page = page.value

    const response = await useFetchProducts(updatedParams)
    products.value = response.results
    totalItems.value = response.count
  },
  { immediate: true, deep: true }
)
</script>


<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
    <BreadcrumbCategory />
    <h1 class="text-2xl text-center mt-4" v-if="route.query.search">
      نتیجه جست و جو برای
      <span class="font-azarmehrbold">{{ route.query.search }}</span>
    </h1>
    <h1 class="text-2xl text-center mt-4" v-else>{{ category }}</h1>

    <div v-if="products.length === 0" class="mt-5">
      <h1 class="text-xl text-center text-red-900">
        محصولی برای نمایش وجود ندارد
      </h1>
    </div>
    <div v-else class="p-2 md:p-4">
      <div class="flex justify-start gap-2 my-5 items-center">
        <span class="text-sm font-semibold">مرتب سازی بر اساس: </span>
        <USelect v-model="sortBy" :items="sortItems" class="w-48" />
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <li v-for="(product, index) in products" :key="index">
          <ProductCard :item="product" class="w-full shadow-tag" />
        </li>
      </ul>

      <div class="flex justify-center my-5" style="direction:ltr">
        <UPagination
          v-model:page="page"
          :total="totalItems"
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
