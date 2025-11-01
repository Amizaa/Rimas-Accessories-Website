<template>
    <div class="container mx-auto p-4 max-w-6xl">
        <Stepper :active="2" class="my-10"/>

        <div class=" flex-col justify-center my-6">
            <div class=" text-center">
                <h3 class=" my-4 font-bold text-2xl">سفارش شما با موفقیت ثبت شد</h3>
                <p>جهت اطلاع از فرایند سفارش به صفحه <NuxtLink to="/my-account/orders" class=" font-bold text-zinc-500"> سفارش های من </NuxtLink>مراجعه کنید</p>
            </div>

            <div class="flex justify-center mt-10">
                <button class=" text-white bg-indigo-400 hover:bg-indigo-500 cursor-pointer rounded-full px-2 py-1" @click="navigateTo('/')">برگشت به صفحه اصلی</button>
            </div>
        </div>
    </div>
</template>