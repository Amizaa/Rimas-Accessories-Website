<script setup>
const categories = inject('categories').map(cat => ({
  name: cat.name,
  href: `/category/${cat.name}`
}))

const quickLinks = ref([
    {name: 'صفحه اصلی', href: '/'},
    {name: 'وبلاگ', href: '/blog'},
    {name: 'پیشنهادات', href: '/'},
    {name: 'درباره ما', href: '/about-us'},
    {name: 'تماس با ما', href: '/contact-us'},
]);

  const {fetchPosts} = usePosts()
  const posts = ref('')
  posts.value = await fetchPosts()

  const newestPosts = posts.value
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  .slice(0, 5); 

const lastBlogs = newestPosts.map(post => ({
  name: post.title,
  href: `/blog/${post.slug}`
}))
</script>

<template>
    <footer class="bg-gray-900 text-white pt-12 pb-8">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

      <FooterCompanyInfo />

      <FooterColumns title="دسته بندی ها" :items="categories" />
      
      <FooterColumns title="لینک های سریع" :items="quickLinks" />
      
      <FooterColumns title="وبلاگ های اخیر" :items="lastBlogs" />

      <FooterContact />
    </div>

    <FooterRights />
  </div>
</footer>
</template>