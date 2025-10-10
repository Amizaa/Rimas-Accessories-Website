<script setup>

definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

useHead({
    title: 'دسته بندی ها'
})
</script>

<template>
    <h1 class=" text-center font-azarmehrbold text-4xl my-5">دسته بندی محصولات</h1>

    <AdminCategoryTable />

    <AdminCategoryForm :category="null" :edit="false"/>


</template>