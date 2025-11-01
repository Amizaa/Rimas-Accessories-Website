<script setup>
definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

useHead({
    title: 'محصولات'
})

const {fetchAll}  = useAdmin()
const products = ref()
const category = ref()
products.value = await fetchAll('products')
category.value = await fetchAll('categories')

const categories = category.value.map(cat => ({
  label: cat.name,
  value: cat.name,
  id: cat.id
}))

const variantList = products.value.flatMap(product =>
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
</script>

<template>

    <AdminProductsTable :data="variantList" title="لیست محصولات" :categories="categories" />

    <div class=" my-10 rounded-2xl shadow bg-zinc-100 p-3">
        <h1 class=" text-2xl font-azarmehrbold text-indigo-500 text-center">افزودن محصول جدید</h1>
        <AdminProductForm :product="null" :edit="false" :categories="categories"/>
    </div>

</template>