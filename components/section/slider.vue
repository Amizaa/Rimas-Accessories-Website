<script setup>
    const props = defineProps({
        title: String,
        items: Array,
    })
</script>

<template>
    <div style="direction:ltr" class="w-full h-120 bg-zinc-300 mt-20 mx-auto p-3">
        <h1 class="text-center text-4xl mb-7 font-bold">{{title}}</h1>
        <CarouselStyle2 :items="items"/>
    </div>
</template>