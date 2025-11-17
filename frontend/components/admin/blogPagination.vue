<script setup>

    const itemsPerPage = 6
    const page = ref(1)

    const {fetchAll} = useAdmin()
    const posts = ref([])

    const postResponse = await fetchAll('blog-posts')
    posts.value = postResponse.results

    // Slice products based on current page
    const paginatedPosts = computed(() => {
        const start = (page.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return posts.value.slice(start, end)
    })

</script>

<template>
    <div v-if="paginatedPosts.length == 0" class="mt-5">
        <h1 class="text-xl text-center text-red-900">پستی برای نمایش وجود ندارد</h1>
    </div>
    <div v-else class="p-2 md:p-4">
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <li v-for="(post, index) in paginatedPosts" :key="index">
                <AdminPostCard :post="post" class="w-full shadow-tag" />
            </li>
        </ul>

      <div class="flex justify-center my-5" style="direction:ltr">
          <UPagination
            v-model:page="page"
            :total="posts.length"
            :items-per-page="itemsPerPage"
            :ui="{ wrapper: 'justify-center mt-6' }"
            active-color="neutral"
            show-edges
            show-controls
            :sibling-count="1"
          />
      </div>
    </div>
</template>