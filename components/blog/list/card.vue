<script setup>
import { CalendarDateRangeIcon, EyeIcon, UserIcon } from '@heroicons/vue/24/outline';

 const props = defineProps({
    post: Object
 })
</script>

<template>
    <article @click="navigateTo(`/blog/${post.slug}`)" class="bg-white rounded-lg shadow-2xl group overflow-hidden transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer">
      <div class="h-48 w-full overflow-hidden">
            <img class="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] group-hover:scale-125 object-end" src="/assets/images/necklace.png" alt="" />
      </div>

        <div class="p-6 pb-4 group-hover:bg-gray-700 duration-[0.3s]">
    
            <h4 class="mt-1 font-semibold text-xl leading-tight truncate group-hover:text-teal-600 duration-[0.3s]">{{post.title}}</h4>
            <div class="mt-2 flex items-center justify-between ">
                <div class="flex justify-center items-center space-x-1 group-hover:text-teal-600">
                    <CalendarDateRangeIcon class="w-5" />
                    <span class="ml-2 text-gray-600 text-sm group-hover:text-teal-600">{{post.published_at}}</span>
                </div>
                <div class="flex justify-center items-center space-x-1 group-hover:text-teal-600">
                    <UserIcon class="w-5" />
                    <span class="ml-2 text-gray-600 text-sm group-hover:text-teal-600">{{post.author}}</span>
                </div>
                <div class="flex justify-center items-center space-x-1 group-hover:text-teal-600">
                    <EyeIcon class="w-5" />
                    <span class="ml-2 text-gray-600 text-sm group-hover:text-teal-600">{{post.views}}</span>
                </div>
            </div>
            <p class="Card-info text-gray-500 mt-2 group-hover:text-white">
            {{ post.excerpt }}
            </p> 
        
      
          <div class="mt-4 flex items-center">
            <span class=" text-gray-500 group-hover:text-white">دسته بندی: <span class="group-hover:text-white font-bold">{{post.category}}</span></span>
          </div>
            <div class="mt-2 flex items-center">
              <span class="ml-2 text-gray-600 text-sm group-hover:text-white">برچسب ها: <span class=" text-gray-800 font-semibold group-hover:text-white">{{post.tags.join(' - ')}}</span> </span>
            </div>
      </div>
    </article>

</template>

