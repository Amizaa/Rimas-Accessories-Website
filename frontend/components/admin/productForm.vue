<script setup>
const props = defineProps({
  product: Object,
  edit: Boolean,
  categories: Array,
})

const schema = ref(null);

const variants = ref([])
variants.value.push({ id: Date.now(), data: { title: '', price: '', stock: '' } })
const images = ref([])
const primaryImage = ref('')
const previewImages = ref([])

const state = reactive({
  title: undefined,
  features: undefined,
  discount: undefined,
  category: undefined,
})

if (props.product) {
  state.title = props.product.product_title
  state.features = props.product.features
  state.discount = props.product.discount
  state.category = props.product.category
  previewImages.value = props.product.images.map(img => img) || []
}

onMounted(async () => {
  const { default: Joi } = await import('joi')
  schema.value = Joi.object({
    title: Joi.string().required().messages({
        'title.base': 'عنوان باید رشته باشد',
        'any.required': 'عنوان محصول را وارد کنید'
      }),
    features: Joi.array()
      .items(
          Joi.string()
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'ویژگی‌ها باید به صورت لیست وارد شوند',
        'array.min': 'حداقل یک ویژگی باید وارد شود',
        'any.required': 'وارد کردن ویژگی‌ها الزامی است'
      }),
    discount: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        'number.base': 'درصد تخفیف باید عدد باشد',
        'number.min': 'درصد تخفیف نمی‌تواند کمتر از ۰ باشد',
        'number.max': 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد',
        'any.required': 'وارد کردن درصد تخفیف الزامی است'
      }),
    category: Joi.string()
      .required()
      .messages({
        'string.base': 'دسته‌بندی باید به صورت رشته وارد شود',
        'any.required': 'انتخاب دسته‌بندی الزامی است'
      })

  })
})

const toast = useToast()
const {createItem, updateItem, uploadImages, deleteItem} = useAdmin()

async function onSubmit(event) {
  const payload = {
    title: state.title,
    features: state.features,
    discount: state.discount,
    category_id: props.categories.find(cat => cat.value === state.category)?.id,
    price: 0,
  }

  if (!props.edit) {
    payload.variants = variants.value.map(variant => ({
      title: variant.data.title,
      price: parseInt(variant.data.price),
      stock: parseInt(variant.data.stock)
    }))
  }

  
  let response = ''
  if (props.edit) {
    response = await updateItem('products', props.product.product_id, payload)
    if (response.success && (images.value.length > 0 || primaryImage.value)) {
      let files = images.value.map((image) => {
        return {
          image: image,
          is_primary: false
        }
      })
  
      files.push({image: primaryImage.value , is_primary: true})
      response = await uploadImages("products", response.data.id, files)
    }
  } else {
    response =  await createItem('products', payload)
    if (response.success && (images.value.length > 0 || primaryImage.value)) {
      let files = images.value.map((image) => {
        return {
          image: image,
          is_primary: false
        }
      })
  
      files.push({image: primaryImage.value , is_primary: true})
      response = await uploadImages("products", response.data.id, files)
    }

  }

  
  if (response.success) {
    toast.add({ title: 'افزودن / ویرایش محصول', description: 'افزودن / ویرایش محصول با موفقیت انجام شد.', color: 'success',onClose: () => window.location.reload() })
  }else{
    toast.add({ title: 'خطا', description: 'افزودن / ویرایش محصول با خطا مواجه شد.', color: 'error' })
  }

}

function addVariant() {
  variants.value.push({ id: Date.now(), data: { title: '', price: '', stock: '' } })
}

function removeVariant(index) {
  if (variants.value.length > 1) {
    variants.value.splice(index, 1)
  }else{
    toast.add({ title: 'خطا', description: 'حداقل باید یک نوع (مدل) برای محصول وجود داشته باشد.', color: 'error' })
  }
}

async function deleteImage(id,idx) {
  const response = await deleteItem('product-images', id)
  if (response.success) {
    toast.add({ title: 'حذف تصویر', description: 'حذف تصویر با موفقیت انجام شد.', color: 'success' })
    previewImages.value.splice(idx, 1)  
  }else{
    toast.add({ title: 'خطای حذف تصویر', description: 'حذف تصویر با خطامواجه شد .', color: 'error' })
  }
}

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 grid grid-cols-2 space-x-3 my-5" @submit="onSubmit">
    <UFormField size="xl" class="col-span-2 md:col-span-1" label="عنوان" name="title">
      <UInput v-model="state.title" class="w-full" placeholder="عنوان محصول"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="ویژگی ها" name="features">
      <UInputTags style="direction:rtl" v-model="state.features" class="w-full" placeholder="بعد از وارد کردن هر ویژگی Enter را بزنید"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="درصد تخفیف" name="discount">
      <UInput v-model="state.discount" class="w-full" placeholder="از 0 تا 100"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="دسته بندی" name="category">
      <USelect style="direction:rtl" v-model="state.category" :items="categories" class="w-full" />
    </UFormField>

    <USeparator class=" col-span-2" />
    <div class="col-span-2" v-if="!edit">
      <h1 class="text-xl font-azarmehrbold text-green-500 text-center my-5">انواع (مدل های) محصول</h1>
      <div v-for="(variant, idx) in variants" :key="variant.id" class="border border-gray-300 rounded-lg p-3 mb-3 relative">
      <span>نوع {{ idx + 1 }}</span>
      <button
        type="button"
        class="absolute top-2 left-2 text-red-500 hover:text-red-700 cursor-pointer border border-red-500 hover:border-red-700 rounded-full px-2"
        @click="removeVariant(idx)"
      >
        X
      </button>
      <AdminVariantForm v-model="variants[idx].data" :product="null" :edit="false" :add="false" />
      </div>
      <UButton
      type="button"
      class="mt-2 cursor-pointer text-center flex justify-center border-dashed border-2 col-span-2"
      color="green"
      @click="addVariant"
      >
      + افزودن نوع جدید
    </UButton>
  </div>
  
  <USeparator class=" col-span-2" />
  <div class="col-span-2">
    <h1 class="text-xl font-azarmehrbold text-green-500 text-center my-5">تصاویر محصول</h1>
    <div class="flex justify-center gap-4">
      <UFileUpload
        v-model="primaryImage"
        layout="grid"
        position="outside"
        label="آپلود تصویر اصلی محصول"
        description="SVG, PNG, JPG or GIF"
        class="w-96"
        :ui="{
          base: 'min-h-48 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cuersor-pointer',
          content: 'flex flex-col items-center justify-center p-5',
        }"
      />
      <UFileUpload
      v-model="images"
      layout="grid"
          position="outside"
          multiple
          label="آپلود تصاویر دیگر محصول"
          description="SVG, PNG, JPG or GIF"
          class="w-96"
          :ui="{
            base: 'min-h-48 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cuersor-pointer',
            content: 'flex flex-col items-center justify-center p-5',
          }"
        />
      </div>

      <div v-if="edit" class="grid grid-cols-3 gap-3 mt-4">
        <div v-for="(img, idx) in previewImages" :key="idx" class="relative">
            <img :src="img.url" alt="تصویر محصول" :class="['object-cover rounded',  img.is_primary ? ' border-green-600 border-4' : 'border-0']" />
            <button
            type="button"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            @click="deleteImage(img.id,idx)"
            title="حذف تصویر"
              >×</button>
            <p v-if="img.is_primary" class=" w-full text-center text-green-600">تصویر اصلی</p>

          </div>
      </div>
    </div>


    <UButton size="xl" :class="['cursor-pointer text-center flex justify-center col-span-2', edit ? ' bg-blue-400 hover:bg-blue-500' : 'bg-indigo-400 hover:bg-indigo-500' ]" type="submit">
      {{ edit ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
    </UButton>
  </UForm>


</template>

