<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/store/cart'
import { useToast } from '#imports'

const props = defineProps({
  variants: { type: Array, required: true },
  discount: { type: Number, default: 0 },
  productId: { type: Number, required: true }
})

const selectedVariants = ref([])
const quantities = ref({})


const items = computed(() =>
  props.variants.map(variant => ({
    label: variant.title,
    value: variant.id.toString(),
    firstPrice: Number(variant.price).toLocaleString(),
    actualPrice: Number(variant.price * (1 - props.discount / 100)).toLocaleString(),
    stock: variant.stock,
    disabled: variant.stock === 0
  }))
)

props.variants.forEach(variant => {
  quantities.value[variant.id] = 0
})

const { addItem, setShipping } = useCartStore()

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

  // 🔹 افزودن به سبد خرید
  selectedItems.forEach(item => {
    addItem(item)
  })

  setShipping({ name: 'post'})

  toast.add({
    title: 'موفقیت‌آمیز ✅',
    description: 'محصول با موفقیت به سبد خرید اضافه شد.',
    color: 'success'
  })

  selectedVariants.value = []
  Object.keys(quantities.value).forEach(key => (quantities.value[key] = 0))
}
</script>

<template>
  <div>
    <h3 class="text-lg font-bold my-4 text-center">انتخاب محصول</h3>

    <UCheckboxGroup
      v-model="selectedVariants"
      :items="items"
      indicator="end"
      variant="card"
      :ui="{ fieldset: 'grid grid-cols-2 md:grid-cols-3 gap-4' }"
      style="direction: rtl;"
    >
      <template #label="{ item }">
        <div class="text-right space-y-2" style="direction: ltr;">
          <h4 class="font-semibold text-sm">{{ item.label }}</h4>
          <p class="text-sm text-gray-600">
            قیمت:
            <span class="font-semibold">{{ item.actualPrice }}</span>
            <span
              v-if="props.discount"
              class="line-through text-gray-400 mx-1"
              >{{ item.firstPrice }}</span
            >
            تومان
          </p>

          <div class="flex items-center justify-end space-x-2">
            <UInputNumber
              class="w-20 text-center"
              v-model="quantities[item.value]"
              :min="1"
              :max="item.stock"
              :disabled="item.disabled"
            />
            <span class="text-sm text-gray-600">تعداد:</span>
          </div>
        </div>
      </template>
    </UCheckboxGroup>

    <div class="flex justify-center mt-6">
      <button
        @click="handleAdd"
        class="cursor-pointer px-6 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-300"
      >
        افزودن به سبد خرید
      </button>
    </div>
  </div>
</template>
