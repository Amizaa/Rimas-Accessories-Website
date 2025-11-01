<script setup>
    const route = useRoute()
    const slug = route.params.slug

    const {fetchPostBySlug, fetchPosts} = usePosts()
    const posts = ref('')
    posts.value = await fetchPosts()
    
    const topViewedPosts = posts.value
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
    
    const newestPosts = posts.value
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 3);
    
    const post = ref('')
    post.value = await fetchPostBySlug(slug)
    
    useHead({
        title: post.value.title
    })

</script>

<template>
    <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
        <BlogSidebar :topPosts="topViewedPosts" :newPosts="newestPosts" />

        <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
            <BlogContentHeader :excerpt="post.excerpt" :title="post.title" :date="post.published_at" :author="post.author" :image="post.thumbnail"/>

            <BlogContentBody :body="post.content_html" />

            <BlogContentFooter :tags="post.tags" />
        </main>
        
    </div>

</template>