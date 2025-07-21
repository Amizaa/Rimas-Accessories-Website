<script setup>
    const { products } = useProducts() // Assume this returns all products

</script>

<template>
    <BreadcrumbProduct class="my-4" category="دستبند"/>
    <div  class="mt-5 shadow bg-white w-full flex flex-col gap-5 p-3 md:px-16 lg:px-28 md:flex-row">

        <div class="w-full md:w-1/2 lg:w-1/3 flex justify-center py-4 mx-3 md:block">
            <CarouselStyle3 />
        </div>

        <ProductDetail :details="products[0].features" />
        
    </div>
    
    <SectionSlider title="محصولات مرتبط" :items="products"/>


    
</template>