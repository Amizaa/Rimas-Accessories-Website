<template>
    <HeaderMenu />
    <div class=" md:container">

        <slot />

    </div>
    <Footer />
</template>

<script setup>
const categories  = await useFetchCategories()

provide('categories', categories)   
</script>