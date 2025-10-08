<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  post: Object,
  modelValue: Object,
  formError: Object
})
const emit = defineEmits(['update:modelValue'])

const schema = ref(null)

const state = reactive({
  title: undefined,
  excerpt: undefined,
  thumbnail: undefined,
  tags: undefined,
})

const thumbnailPrev = ref(null)
if (props.post) {
  state.title = props.post.title
  state.excerpt = props.post.excerpt
  thumbnailPrev.value = props.post.thumbnail
  state.tags = props.post.tags
}


watch(state, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

onMounted(async () => {
  const { default: Joi } = await import('joi')
  schema.value = Joi.object({
    id: Joi.number().integer().min(1).required(),
    slug: Joi.string().pattern(/^[\u0600-\u06FFa-zA-Z0-9\-]+$/).max(100).required(),
    title: Joi.string().max(100).required(),
    excerpt: Joi.string().max(300).required(),
    thumbnail: Joi.string().uri({ allowRelative: true }).required(),
    tags: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.base': 'تگ ها باید به صورت لیست وارد شوند',
      'array.min': 'حداقل یک تگ باید وارد شود',
      'any.required': 'وارد کردن تگ ها الزامی است'
    }),
  })
})

</script>


<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 py-4 md:block shadow-md p-2">
        <div class="sticky top-22">
            <UForm :schema="schema" :state="state" class="space-y-4 space-x-3 my-5">
                <UFormField size="xl" class="ccol-span-1" label="عنوان" name="title">
                    <UInput v-model="state.title" class="w-full" placeholder="عنوان بلاگ"/>
                    <p v-if="formError.title" class=" text-red-400">{{ formError.title }}</p>
                </UFormField>
                <UFormField size="xl" class="col-span-1" label="تصویر" name="thumnail">
                      <UFileUpload v-model="state.thumbnail" accept="image/*" class="w-full min-h-48" />
                      <p v-if="formError.thumbnail && !thumbnailPrev" class=" text-red-400">{{ formError.thumbnail }}</p>
                      <div v-if="thumbnailPrev" class="mt-2">
                        <span> تصویر قبلی:</span>
                        <img :src="thumbnailPrev" alt="Thumbnail Preview" class="mt-2 w-full h-auto rounded border-2" />
                      </div>
                </UFormField>
                <UFormField size="xl" class=" col-span-2 md:col-span-1" label="تگ ها" name="tags">
                  <UInputTags style="direction:rtl" v-model="state.tags" class="w-full" placeholder="بعد از وارد کردن هر تگ Enter را بزنید"/>
                  <p v-if="formError.tags" class=" text-red-400">{{ formError.tags }}</p>
                </UFormField>
                <UFormField size="xl" class=" col-span-2 md:col-span-1" label="توضیحات مختصر" name="excerpt">
                  <UTextarea style="direction:rtl" v-model="state.excerpt" class="w-full" placeholder="توضیحات مختصر بلاگ را در چند جمله بنویسید" />
                  <p v-if="formError.excerpt" class=" text-red-400">{{ formError.excerpt }}</p>
                </UFormField>
            </UForm>
            
        </div>
    </aside>
</template>