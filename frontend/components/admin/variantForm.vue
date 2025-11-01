<script setup>
const props = defineProps({
  product: Object,
  edit: Boolean,
  add: Boolean,
})
import { ref, reactive, onMounted, watch } from 'vue'

import {priceToPersianWords } from 'price-seprator';

const schema = ref(null);

const state = reactive({
  title: undefined,
  price: undefined,
  stock: undefined,
})

if (props.product && props.edit) {
  state.title = props.product.variant_title
  state.price = parseInt(props.product.price)
  state.stock = props.product.stock
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
    stock: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'تعداد موجودی باید عدد باشد',
      'number.min': 'تعداد موجودی نمی‌تواند کمتر از ۰ باشد',
      'any.required': 'وارد کردن تعداد موجودی الزامی است'
    }),
    
  })
})

const {createItem, updateItem} = useAdmin()

const toast = useToast()
async function onSubmit(event) {
  const payload = {
    title: state.title,
    price: state.price,
    stock: state.stock
  }

  if (props.add) {
    payload.product_id = props.product.product_id
  }

  let response = null
  if (props.edit) {
    response = await updateItem('variants', props.product.variant_id, payload)
  } else if (props.add) {
    response = await createItem('variants', payload)    
  }

  if (response.success) {
    toast.add({ title: 'ویرایش/افزودن نوع محصول', description: 'ویرایش / افزودن نوع محصول با موفقیت انجام شد.', color: 'success',onClose: () => window.location.reload() })
  }else{
    toast.add({ title: 'خطا', description: ' ویرایش / افزودن نوع محصول با خطامواجه شد .', color: 'error' })
  }
}

const emit = defineEmits(['update:modelValue'])

watch(
  () => state,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 grid grid-cols-2 space-x-3 my-5" @submit="onSubmit">
    <div v-if="edit || add" class="col-span-2 mb-4">
      <span class="text-lg font-semibold text-gray-700">عنوان محصول: {{ props.product?.product_title }}</span>
    </div>
    <UFormField size="xl" class="col-span-2 md:col-span-1" label="عنوان" name="title">
      <UInput v-model="state.title" class="w-full" placeholder="عنوان"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="قیمت" name="price">
      <UInput v-model="state.price" class="w-full" placeholder="قیمت به تومان"/>
      <span class=" text-sm text-gray-400">{{priceToPersianWords(state.price)}}</span>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="تعداد" name="stock">
      <UInput v-model="state.stock" class="w-full" placeholder="حداقل 0 عدد"/>
    </UFormField>

    <UButton v-if="add || edit" size="xl" class='cursor-pointer text-center flex justify-center col-span-2 bg-green-400 hover:bg-green-500' type="submit">
      <span class="text-white text-lg font-azarmehr">{{ add ? 'افزودن نوع محصول' : 'ویرایش نوع محصول' }}</span>
    </UButton>
  </UForm>
</template>

