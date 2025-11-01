<script setup>
    const props = defineProps({
        title: String,
        items: Array
    })
</script>

<template>
    <div class="shadow-xl flex flex-col gap-4 rounded-xl p-2 my-4">
        <h3 class="text-center underline underline-offset-12">{{title}}</h3>
        <a v-for="item in items" :key="item.id" :href="`/blog/${item.slug}`" class="px-3 py-1 font-semibold hover:bg-indigo-200 rounded-md cursor-pointer">
            {{ item.title }}
        </a>
    </div>
</template>