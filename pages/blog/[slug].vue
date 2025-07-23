<script setup>
    const route = useRoute()
    const slug = route.params.slug

    const {posts} = usePosts()

    const topViewedPosts = posts
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

    const newestPosts = posts
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 3);

    const post = posts.find(p => p.slug === slug);


</script>

<template>
    <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
        <BlogSidebar :topPosts="topViewedPosts" :newPosts="newestPosts" />

        <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
            <BlogContentHeader :title="post.title" :date="post.published_at" :author="post.author" :image="post.thumbnail"/>

            <BlogContentBody :body="post.excerpt" />

            <BlogContentFooter :tags="post.tags" />
        </main>
        
    </div>

</template>