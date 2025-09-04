<script setup>
    const route = useRoute()
    const product = await useFetchProduct(route.params.id)

    useHead({
        title: product.title
    })
</script>

<template>
    <BreadcrumbProduct class="my-4" :category="product.category.slug"/>
    <div  class="mt-5 shadow bg-white w-full flex flex-col gap-5 p-3 md:px-16 lg:px-28 md:flex-row">

        <div class="w-full md:w-1/2 lg:w-1/3 flex justify-center py-4 mx-3 md:block">
            <CarouselStyle3 :images="product.images" />
        </div>

        <ProductDetail :details="product" />
        
    </div>
    
    <SectionSlider title="محصولات مرتبط" :items="products"/>


    
</template>