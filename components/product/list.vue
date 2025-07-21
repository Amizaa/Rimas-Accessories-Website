<script setup>
    const { products } = useProducts() // Assume this returns all products

    const itemsPerPage = 3

    
    const route = useRoute()
    const pageNum = computed(() => {

        return route.query.page ? parseInt(route.query.page) : 1
    })
    
    const page = ref(pageNum)
    const category = route.params.category == 'همه محصولات' ? 'همه محصولات' : `دسته بندی ${route.params.category}`

    // Slice products based on current page
    const paginatedProducts = computed(() => {
        const start = (page.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return products.slice(start, end)
    })
    
    const priceRange = computed(() => {
        const minPrice = route.query.minPrice;
        const maxPrice = route.query.maxPrice;

        return {minPrice,maxPrice}
    })

    function to(page) {
        return {
            query: {
            page,
            },
        }
        }
</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
    <BreadcrumbCategory />
    <h1 class="text-2xl text-center">{{ category }}</h1>

    <div v-if="paginatedProducts.length == 0" class="mt-5">
        <h1 class="text-xl text-center text-red-900">محصولی برای نمایش وجود ندارد</h1>
    </div>
    <div v-else class="p-2 md:p-4">
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
            :to="to"
            :sibling-count="1"
          />
      </div>
    </div>
  </main>
</template>
