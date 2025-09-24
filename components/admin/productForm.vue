<script setup>
const props = defineProps({
  product: Object,
  edit: Boolean
})

import { priceToEnglishWords, priceToPersianWords, separatePrice } from 'price-seprator';

const schema = ref(null);

const state = reactive({
  title: undefined,
  price: undefined,
  features: undefined,
  discount: undefined,
  quantity: undefined,
  category: undefined
})

if (props.product) {
  state.title = props.product.title
  state.price = props.product.price
  state.features = props.product.features
  state.discount = props.product.discount
  state.quantity = props.product.quantity
  state.category = props.product.category
}

onMounted(async () => {
  const { default: Joi } = await import('joi')
  schema.value = Joi.object({
    title: Joi.string().required().messages({
        'title.base': 'عنوان باید رشته باشد',
        'any.required': 'عنوان را وارد کنید'
      }),
    price: Joi.number().required().messages({
        'number.base': 'قیمت باید عدد باشد',
        'any.required': 'قیمت را وارد کنید'
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

    quantity: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.base': 'تعداد موجودی باید عدد باشد',
        'number.min': 'تعداد موجودی نمی‌تواند کمتر از ۰ باشد',
        'any.required': 'وارد کردن تعداد موجودی الزامی است'
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
async function onSubmit(event) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
}

const categories = ref([
  { label: 'گوشواره', value:'گوشواره' },
  { label: 'گردنبند',value: 'گردنبند'},
  { label: 'دستبند',value: 'دستبند' },
  { label: 'پابند',value: 'پابند' },
  { label: 'ست',value: 'ست'},
]);
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 grid grid-cols-2 space-x-3 my-5" @submit="onSubmit">
    <UFormField size="xl" class="col-span-2 md:col-span-1" label="عنوان" name="title">
      <UInput v-model="state.title" class="w-full" placeholder="عنوان محصول"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="قیمت" name="price">
      <UInput v-model="state.price" class="w-full" placeholder="قیمت به تومان"/>
      <span class=" text-sm text-gray-400">{{priceToPersianWords(state.price)}}</span>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="ویژگی ها" name="features">
      <UInputTags style="direction:rtl" v-model="state.features" class="w-full" placeholder="بعد از وارد کردن هر ویژگی Enter را بزنید"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="درصد تخفیف" name="discount">
      <UInput v-model="state.discount" class="w-full" placeholder="از 0 تا 100"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="تعداد" name="quantity">
      <UInput v-model="state.quantity" class="w-full" placeholder="حداقل 0 عدد"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="دسته بندی" name="category">
      <USelect style="direction:rtl" v-model="state.category" :items="categories" class="w-full" />
    </UFormField>


    <UButton size="xl" :class="['cursor-pointer text-center flex justify-center col-span-2', edit ? ' bg-blue-400 hover:bg-blue-500' : 'bg-indigo-400 hover:bg-indigo-500' ]" type="submit">
      {{ edit ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
    </UButton>
  </UForm>
</template>

