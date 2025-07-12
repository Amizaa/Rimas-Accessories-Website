<script setup>
const categories = ref([
  { name: 'گوشواره', href: '#' },
  { name: 'گردنبند', href: '#'},
  { name: 'دستبند', href: '#' },
  { name: 'پابند', href: '#' },
  { name: 'ست', href: '#'},
]);

const quickLinks = ref([
    {name: 'صفحه اصلی', href: '/'},
    {name: 'وبلاگ', href: '/'},
    {name: 'پیشنهادات', href: '/'},
    {name: 'درباره ما', href: '/'},
    {name: 'تماس با ما', href: '/'},
]);

const lastBlogs = ref([
  {
    href: '/',
    name: "چگونه اکسسوری مناسب استایل خود را انتخاب کنیم؟"
  },
  {
    href: '/',
    name: "5 ترند محبوب اکسسوری در سال 2025"
  },
  {
    href: '/',
    name: "نکاتی برای نگهداری از زیورآلات نقره"
  },
  {
    href: '/',
    name: "ترکیب رنگ اکسسوری‌ها با لباس‌های تابستانی"
  },
  {
    href: '/',
    name: "فرق بین زیورآلات دست‌ساز و صنعتی"
  }
 
]);
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