<script setup>
    const {fetchPosts} = usePosts()
    const posts = ref('')
    posts.value = await fetchPosts()

    useHead({
        title: 'وبلاگ'
    })

    const topViewedPosts = posts.value
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

    const newestPosts = posts.value
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 3);
</script>

<template>
    <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
        <BlogSidebar :topPosts="topViewedPosts" :newPosts="newestPosts" />

        <BlogList :posts="posts" />
    </div>

    
</template>