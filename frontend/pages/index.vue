<script setup>

    useHead({
        title: 'ریماس اکسسوری'
    })

    const necklaceCat = ref([])
    const lastProducts = ref([])
    const discountedProducts = ref([])
    lastProducts.value = await useFetchProducts({lastAdded:true,limit:10})
    necklaceCat.value = await useFetchProducts({category: 'گردنبند'})
    discountedProducts.value = await useFetchProducts({hasDiscount: true})


    const toast = useToast()
    const route = useRoute()

    onMounted(() => {
        if (route.query.authError === "login-required") {
            toast.add({
            title: 'خطا',
            description: 'ابتدا وارد حساب کاربری خود شوید',
            color: 'error'
            })
            // حذف query از آدرس (برای جلوگیری از نمایش دوباره)
            navigateTo('/', { replace: true })
        }
    })
</script>

<template>
    <CarouselStyle1 class="w-full mx-0"/>

    <SectionSlider title="محصولات جدید" :items="lastProducts.results"/>

    <SectionSlider title="تخفیف ها" :items="discountedProducts.results"/>

    <SectionSlider title="گردنبند ها" :items="necklaceCat.results"/>

    <div class=" bg-gradient-to-t from-zinc-50 to-zinc-300 my-20 p-4">
        <h1 class="text-center text-3xl mb-7 font-bold">سوالات متداول</h1>
        <AccordionFaq />
    </div>

</template>