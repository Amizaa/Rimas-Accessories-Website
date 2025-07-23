<script setup>
    const props = defineProps({
        posts: Array,
    })

import { CalendarDateRangeIcon, EyeIcon, UserIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
        <div class="mx-auto max-w-2xl lg:mx-0 border-b mb-10">
            <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl mb-8 mt-4 text-center md:text-start">مطالب ارزشمند</h2>
        </div>
        <div class="flex flex-col">
            <article v-for="post in posts" :key="post.id" class="flex shadow-lg  p-2 m-4 odd:bg-indigo-200 even:bg-amber-200 rounded-xl  hover:scale-105 transition-all duration-300 cursor-pointer">
                <a :href="`/blog/${post.slug}`" class=" w-full flex gap-3 overflow-hidden items-center justify-start">
                    <div class="relative w-40 h-40 flex-shrink-0">
                        <img class="absolute rounded-md left-0 top-0 w-full h-full object-cover object-center transition duration-50" src="/assets/images/blog/bracelet.png">
                    </div>
    
                    <div class="flex flex-col gap-3 w-full py-2">
                        <h2 class="sm:text-xl text-lg font-bold text-center">{{ post.title }}</h2>

                        <div class="flex justify-center space-x-3 my-2">
                            <span class="flex gap-1  items-center">
                                <user-icon class="w-5" />
                                <p class="text-sm">{{post.author}}</p>
                            </span>
                            <span class="flex gap-1  items-center">
                                <calendar-date-range-icon class="w-5"/>
                                <p class="text-sm">{{post.published_at}}</p>
                            </span>
                            <span class="flex gap-1  items-center">
                                <eye-icon class="w-5"/> 
                                <p class="text-sm">{{post.views}}</p>
                            </span>
                        </div>

                        <p class="text-gray-500 text-center">{{ post.excerpt }}</p>
    
                    </div>
                </a>
            </article>
        </div>
   </main>
</template>


