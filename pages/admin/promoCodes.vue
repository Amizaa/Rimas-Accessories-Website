<script setup>

definePageMeta({
    layout:'admin'
})
</script>

<template>
    <h1 class=" text-center font-azarmehrbold text-4xl my-5"> کد های تخفیف</h1>

    <AdminPromoCodesTable />

    <AdminPromoCodeForm :code="null" :edit="false"/>


</template>