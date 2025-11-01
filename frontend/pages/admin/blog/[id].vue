<script setup>
definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})
const route = useRoute()
const {fetchById} = useAdmin()
const post = ref('')
post.value = await fetchById('blog-posts',route.params.id)

useHead({
    title: post.title
})

const {uploadImages, updateItem } = useAdmin()

// State for sidebar and editor
const sidebarData = ref({})
const editorContent = ref('')

const toast = useToast()
const submitBlog = async () => {
  const formData = new FormData()

  formData.append("title", sidebarData.value.title)
  formData.append(
    "slug",
    sidebarData.value.title?.trim().replace(/[؟،؛!٪٫٬]/g, "").replace(/\s+/g, "-")
  )
  formData.append("excerpt", sidebarData.value.excerpt)
  sidebarData.value.tags.forEach(tag => {
  formData.append("tags", tag);
  });
  formData.append("content_html", editorContent.value.html)
  formData.append("delta", JSON.stringify(editorContent.value.delta))

  // ✅ Important: only append if user actually picked a file
  if (sidebarData.value.thumbnail instanceof File) {
    formData.append("thumbnail", sidebarData.value.thumbnail)
  }
  const postId = post.value.id

  const response = await updateItem('blog-posts',postId ,formData)

  if (response.success) {

    for (const image of editorContent.value.images || []) {
      const imageResponse = await uploadImages('blog-posts', postId, [image.file])
        
        if (imageResponse.data[0].url) {
          // 3) Replace placeholder in delta
          editorContent.value.delta.ops.forEach(op => {
            if (op.insert.image === image.placeholder) {
              op.insert.image = imageResponse.data[0].url
            }
          })

          editorContent.value.html = editorContent.value.html.replaceAll(
          `src="${image.placeholder}"`,
          `src="${imageResponse.data[0].url}"`)
        }
      
    }
    
    const updateData = {
      delta: editorContent.value.delta,
      content_html: editorContent.value.html
    }

    const response2 = await updateItem('blog-posts', postId, updateData)
    if (!response2.success) {
      toast.add({ title: 'خطا', description: 'به‌روزرسانی بلاگ با خطا مواجه شد.', color: 'error' })
      return
    }else{
      toast.add({ title: 'به‌روزرسانی بلاگ', description: 'به‌روزرسانی بلاگ با موفقیت انجام شد.', color: 'success',onClose: () => navigateTo('/admin/blog')})
    }
    
  }
  
}

const formError = ref({})
const checkForm = () =>{
  formError.value = {}
  
  if (!sidebarData.value.title) {
    formError.value.title = "عنوان بلاگ نمی‌تواند خالی باشد."
  }
  if (!sidebarData.value.tags) {
    formError.value.tags = "برچسب‌ها نمی‌توانند خالی باشند."
  }
  if (!sidebarData.value.excerpt) {
    formError.value.excerpt = "خلاصه بلاگ نمی‌تواند خالی باشد."
  }
  if (!editorContent.value) {
    formError.value.content = "محتوای بلاگ نمی‌تواند خالی باشد."
  }

  if (Object.keys(formError.value).length === 0) {
    submitBlog()
    formError.value = {}
  }else{
    return
  }
}
</script>

<template>
  <h1 class=" text-4xl text-center font-azarmehrbold my-5"> {{post.title}}</h1>
  <UButton @click="checkForm" size="xl" class="cursor-pointer text-center p-2 bg-blue-400 hover:bg-blue-500">
    ویرایش بلاگ
  </UButton>
  <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
    <AdminNewBlogSidabar :post="post" v-model="sidebarData" :form-error="formError"/>
    
    <main class="md:w-2/3 lg:w-3/4 w-full py-1 min-h-screen">
      <AdminQuillEditor :post="post" v-model="editorContent" :error="formError.content"/>
    </main>

  </div>
</template>
