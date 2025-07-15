<script setup>
    const {products} = useProducts()
</script>

<template>
    <HeaderMenu />

    <CarouselStyle1 />

    <SectionSlider title="محصولات جدید" :items="products"/>

    <SectionSlider title="پرفروش ترین ها" :items="products"/>

    <div class=" bg-zinc-200 my-20 p-4">
        <h1 class="text-center text-3xl mb-7 font-bold">سوالات متداول</h1>
        <AccordionFaq />
    </div>

    <Footer />
</template>