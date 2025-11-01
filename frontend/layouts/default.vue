<template>
    <HeaderMenu />
    <div class=" md:container">

        <slot />

    </div>
    <Footer />
</template>

<script setup>
const categories  = await useFetchCategories()

const {fetchPosts} = usePosts()
const posts = ref('')
posts.value = await fetchPosts()

const newestPosts = posts.value
.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
.slice(0, 5); 


provide('categories', categories)   
provide('posts', newestPosts)   
</script>