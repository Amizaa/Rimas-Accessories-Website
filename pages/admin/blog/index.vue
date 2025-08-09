<script setup>
definePageMeta({
    layout:'admin'
})

useHead({
    title: 'بلاگ ها'
})
</script>

<template>
    <button @click="navigateTo('/admin/blog/new')" class=" absolute right-5 p-2 bg-indigo-400 cursor-pointer text-white rounded-2xl">بلاگ جدید</button>
    <h1 class=" text-4xl text-center font-azarmehrbold my-5">لیست بلاگ ها</h1>

    <AdminBlogPagination />
</template>