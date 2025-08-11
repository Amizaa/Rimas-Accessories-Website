<script setup>
    const error = useError();
</script>

<template>
    <div class=" flex justify-center items-center h-screen w-full">
        <div v-if="error.statusCode == 404 " class=" text-center flex flex-col space-y-9">
            <img src="/public/images/error404.png" class=" w-5/8 mx-auto" alt="صفحه 404">
            <h1 class=" text-indigo-900 text-4xl md:text-6xl font-azarmehrbold">صفحه مورد نظر یافت نشد</h1>
            <button @click="navigateTo('/')" class=" w-fit mx-auto mt-10 font-semibold rounded-full shadow bg-indigo-400 hover:bg-indigo-500 cursor-pointer p-3 text-lg text-white">بازگشت به صفحه اصلی</button>
        </div>
        <div v-else class=" text-center flex flex-col space-y-9">
            <h1 class=" text-indigo-900 text-4xl md:text-6xl font-azarmehrbold">خطایی رخ داده است</h1>
            <button @click="navigateTo('/')" class=" w-fit mx-auto mt-10 font-semibold rounded-full shadow bg-indigo-400 hover:bg-indigo-500 cursor-pointer p-3 text-lg text-white">بازگشت به صفحه اصلی</button>
        </div>
    </div>
</template>