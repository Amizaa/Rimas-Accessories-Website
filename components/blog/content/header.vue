<script setup>

    const props = defineProps({
        title: String,
        author: String,
        date: String,
        image: String,
    })
</script>

<template>
    <div class="block p-3">
        <div class="flex justify-center my-3">
            <img class="w-3/4 hover:shadow-2xl rounded-2xl shadow transition-all duration-300" src="/assets/images/blog/bracelet.png" :alt="title">

        </div>

        <div class="flex flex-col w-full text-center border-b-2 space-y-4 p-3">
            <h1 class="text-3xl md:text-4xl ">{{title}}</h1>
            <p>نوشته شده توسط {{author}} در تاریخ {{date}}</p>
        </div>
    </div>

</template>