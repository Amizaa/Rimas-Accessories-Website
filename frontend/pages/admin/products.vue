<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth-admin'
})

useHead({
  title: 'محصولات'
})

const { fetchAll } = useAdmin()

// state
const products = ref([])
const categories = ref([])
const variantList = ref([])

const page = ref(1)
const itemsPerPage = ref(9)   // 👈 admin page size
const totalItems = ref(0)


const categoriesResponse = await fetchAll("categories")

categories.value = categoriesResponse.results.map(cat => ({
  label: cat.name,
  value: cat.name,
  id: cat.id
}))

// fetch products with pagination
async function fetchProducts() {
  const response = await fetchAll('products', {
    page: page.value,
    page_size: itemsPerPage.value
  })

  // DRF pagination returns { count, results }
  products.value = response.results
  totalItems.value = response.count

  // flatten variants
  variantList.value = products.value.flatMap(product =>
    product.variants.map(variant => ({
      variant_id: variant.id,
      variant_title: variant.title,
      stock: variant.stock,
      price: variant.price ?? product.price,
      product_id: product.id,
      product_title: product.title,
      category: product.category.name,
      discount: product.discount,
      images: product.images,
      features: product.features
    }))
  )
}

// initial load
await fetchProducts()

// refetch when page changes
watch(page, async () => {
  await fetchProducts()
})
</script>

<template>
  <AdminProductsTable
    :data="variantList"
    title="لیست محصولات"
    :categories="categories"
  />

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

  <div class="my-10 rounded-2xl shadow bg-zinc-100 p-3">
    <h1 class="text-2xl font-azarmehrbold text-indigo-500 text-center">
      افزودن محصول جدید
    </h1>
    <AdminProductForm
      :product="null"
      :edit="false"
      :categories="categories"
    />
  </div>
</template>
