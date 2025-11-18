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

<template>
    <HeaderMenu />
    <div class=" container">
        <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
            <AccountSidebar />

            <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
                <slot />
            </main>
        </div>
    </div>
    <Footer />
</template>