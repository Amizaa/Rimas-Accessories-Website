<script setup>
import products from '~/api/products.json'
definePageMeta({
    layout:'admin'
})
</script>

<template>

    <AdminProductsTable :data="products" title="لیست محصولات" />

    <div class=" my-10 rounded-2xl shadow bg-zinc-100 p-3">
        <h1 class=" text-2xl font-azarmehrbold text-indigo-500 text-center">افزودن محصول جدید</h1>
        <AdminProductForm :product="null" :edit="false"/>
    </div>

</template>