<script setup>
    const props = defineProps({
        topPosts: Array,
        newPosts: Array
    })

</script>

<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 py-4 md:block">
        <div class="sticky top-22">

            <blog-sidebar-section :items="newPosts" title="مطالب اخیر" />

            <blog-sidebar-section :items="topPosts" title=" پر بازدید ترین مطالب " />
            
        </div>

    </aside>
</template>