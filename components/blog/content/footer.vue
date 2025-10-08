<script setup>
    const props = defineProps({
        tags: Array
    })
</script>

<template>
    <div class="border-t-2 my-5 pt-3">
        <h2 class="text-xl mb-3">برچسب‌ها:</h2>
        <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{{ tag }}</span>
        </div>
    </div>
</template>