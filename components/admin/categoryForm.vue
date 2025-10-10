<script setup>
const props = defineProps({
  category: Object,
  edit: Boolean,
})

const schema = ref(null);

const state = reactive({
  name: undefined,
})

if (props.category) {
  state.name = props.category.name
}

onMounted(async () => {
  const { default: Joi } = await import('joi')
  schema.value = Joi.object({
    name: Joi.string().required().messages({
        'title.base': 'عنوان باید رشته باشد',
        'any.required': 'عنوان محصول را وارد کنید'
      })

  })
})

const toast = useToast()
const {createItem, updateItem} = useAdmin()

async function onSubmit(event) {
  const payload = {
    name: state.name,
    slug: state.name.trim().replace(/[؟،:؛!٪٫٬]/g, "").replace(/\s+/g, "-"),
  }

  let response = ''
  if (props.edit) {
    response = await updateItem('categories', props.category.id, payload)
  } else {
    response =  await createItem('categories', payload)
  }

  
  if (response.success) {
    toast.add({ title: 'افزودن / ویرایش دسته بندی', description: 'افزودن / ویرایش دسته بندی با موفقیت انجام شد.', color: 'success',onClose: () => window.location.reload() })
  }else{
    toast.add({ title: 'خطا', description: 'افزودن / ویرایش دسته بندی با خطا مواجه شد.', color: 'error' })
  }

}

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 grid grid-cols-2 space-x-3 my-5" @submit="onSubmit">
    <UFormField size="xl" class="col-span-2" label="نام دسته بندی" name="name">
      <UInput v-model="state.name" class="w-full" placeholder="نام دسته بندی"/>
    </UFormField>

    <UButton size="xl" :class="['cursor-pointer text-center flex justify-center col-span-2', edit ? ' bg-blue-400 hover:bg-blue-500' : 'bg-indigo-400 hover:bg-indigo-500' ]" type="submit">
      {{ edit ? 'ویرایش دسته بندی' : 'افزودن دسته بندی جدید' }}
    </UButton>
  </UForm>


</template>

