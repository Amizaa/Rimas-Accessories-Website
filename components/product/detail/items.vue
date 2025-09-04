<script setup>
const props = defineProps({
    variants: Array,
    discount: Number,
    productId: Number
})
const selectedVariants = ref([])

const items = props.variants.map(variant => ({
  label: variant.title,
  value: variant.id.toString(),
  firstPrice: Number(variant.price).toLocaleString(),
  actualPrice: Number(variant.price * (1 - props.discount / 100)).toLocaleString(),
  stock: variant.stock,
  disabled: variant.stock === 0
}))

  const quantities = ref({})

  props.variants.forEach(variant => {
    quantities.value[variant.id] = 0 // default quantity
  })


  const { cart, addToCart, setShipping } = useCart()
  const shippingCookie = useCookie('shipping')

  const toast = useToast()

const handleAdd = () => {
  const selectedItems = selectedVariants.value
    .filter(id => quantities.value[id] > 0)
    .map(id => {
      const variant = props.variants.find(v => v.id.toString() === id)
      return {
        productId: props.productId,
        variantId: variant.id,
        quantity: quantities.value[id],
        unitPrice: variant.price * (1 - props.discount / 100)
      }
    })

  if (selectedItems.length === 0) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً حداقل یک محصول با تعداد معتبر انتخاب کنید.',
      color: 'error'
    })
    return
  }

  selectedItems.forEach(item => {
    addToCart(item)
  })

  if (!shippingCookie.value) {
    setShipping({name: "post", price: 45000 })
  }

  toast.add({
    title: 'افزودن به سبد خرید',
    description: 'محصول با موفقیت به سبد خرید اضافه شد.',
    color: 'success'
  })
}

</script>

<template>
  <h3 class="text-lg font-bold my-4 text-center">انتخاب محصول</h3>
  <div class="">
    <template>
      <UCheckboxGroup
        indicator="end"
        variant="card"
        :items="items"
        v-model="selectedVariants"
        :ui="{ fieldset:' grid grid-cols-2 md:grid-cols-3'}"
        style="direction: rtl;"
      >
      <template #label="{ item }">
        <div class="text-right space-y-2" style="direction: ltr;">
          <h4 class="font-semibold text-sm">{{ item.label }}</h4>
          <p class="text-sm text-gray-600">قیمت: <span class=" font-semibold">{{item.actualPrice}}</span><span v-if="discount" class=" line-through text-gray-400 mx-1">{{ item.firstPrice }}</span> تومان </p>
          <UInputNumber 
          class="w-25 text-center"
          v-model="quantities[item.value]"
          :min="1"
          :max="item.stock"
          />
          <span class=" text-sm text-gray-600 ml-2">:تعداد </span>
        </div>
      </template>
      </UCheckboxGroup>
    </template>

    <div class="flex justify-center mt-6">
      <button @click="handleAdd()"  class=" cursor-pointer p-2 rounded-full bg-indigo-400 text-center hover:bg-indigo-500 text-white transition-all duration-300">افزودن به سبد خرید</button>
    </div>

  </div>

</template>