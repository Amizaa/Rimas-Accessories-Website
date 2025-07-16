<script setup>
    const {products} = useProducts()
    
</script>

<template>
    <CarouselStyle1 />

    <SectionSlider title="محصولات جدید" :items="products"/>

    <SectionSlider title="پرفروش ترین ها" :items="products"/>

    <div class=" bg-gradient-to-t from-zinc-50 to-zinc-300 my-20 p-4">
        <h1 class="text-center text-3xl mb-7 font-bold">سوالات متداول</h1>
        <AccordionFaq />
    </div>

</template>