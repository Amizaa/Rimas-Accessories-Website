<script setup>
import posts from '~/api/posts.json'
definePageMeta({
    layout:'admin'
})
const route = useRoute()
const post = posts.find((post) => {return post.id == route.params.id})
</script>

<template>
  <h1 class=" text-4xl text-center font-azarmehrbold my-5"> {{post.title}}</h1>
  <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
    <AdminNewBlogSidabar :post="post"/>
    
    <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
      <AdminQuillEditor :content="null"/>
    </main>

  </div>
</template>
