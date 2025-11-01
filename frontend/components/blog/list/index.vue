<script setup>
    const props = defineProps({
        posts: Array,
    })

import { CalendarDateRangeIcon, EyeIcon, UserIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen mb-5">
        <div class="mx-auto max-w-2xl lg:mx-0 border-b mb-10">
            <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl mb-8 mt-4 text-center md:text-start">مطالب ارزشمند</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BlogListCard v-for="post in posts" :key="post.id" :post="post"/>
        </div>
   </main>
</template>


