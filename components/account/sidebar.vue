<script setup>
    const pages = [
        {title: 'اطلاعات کاربری', href: '/profile'},
        {title: 'سفارش های من', href: '/orders'},
        {title: 'آدرس های من', href: '/address'},
        {title: 'کد های تخفیف من', href: '/promoCodes'},
    ]

    const router = useRouter()

    function logoutUser() {
        useCookie('access').value = null
        useCookie('refresh').value = null
        
        router.push("/")
  }
</script>

<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 py-4 md:block">
        <div class="sticky top-22">
            <div class="shadow-xl flex flex-col gap-2 rounded-xl p-2">
                <NuxtLink v-for="(page,index) in pages" :key="index" :to="`/my-account${page.href}`" class="px-3 py-1 font-semibold hover:bg-indigo-200 rounded-md">
                    {{ page.title }}
                </NuxtLink>
                <USeparator />
                <button @click="logoutUser" class="px-3 py-1 font-semibold hover:bg-red-200 rounded-md cursor-pointer">خروج از حساب کاربری</button>
            </div>
        </div>
    </aside>
</template>