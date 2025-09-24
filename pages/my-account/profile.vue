<script setup>
    useHead({
        title: 'اطلاعات کاربری'
    })

    definePageMeta({
        layout: 'account',
        middleware: 'auth',
    })
</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">اطلاعات کاربری</h1>

    <AccountForm />


</template>