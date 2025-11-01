<script setup>
const props = defineProps({
    data: Array,
    title: String,
    categories: Array,
})


import { h, resolveComponent } from 'vue'
import { useClipboard } from '@vueuse/core'
import { separatePrice } from 'price-seprator'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()


const columns = [
  {
    accessorKey: 'product_id',
    cell: ({ row }) => `${row.getValue('product_id')}`,
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'شماره محصول',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }   
  },
  {
    accessorKey: 'variant_id',
    cell: ({ row }) => `${row.getValue('variant_id')}`,
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'شماره مدل',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }   
  },
  {
    accessorKey: 'product_title',
    cell: ({ row }) => `${row.getValue('product_title')}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'عنوان محصول',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'variant_title',
    cell: ({ row }) => `${row.getValue('variant_title')}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'عنوان مدل',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'category',
    cell: ({ row }) => `${row.getValue('category')}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'دسته بندی',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'features',
    cell: ({ row }) => {
        const features = row.getValue('features')
        return features.join('، ')
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ویژگی ها',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'stock',
    cell: ({ row }) => `${row.getValue('stock') == 0 ? 'ناموجود' : row.getValue('stock')}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'تعداد',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'price',
    cell: ({ row }) => `${separatePrice(parseInt(row.getValue('price')))}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'قیمت',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    accessorKey: 'discount',
    cell: ({ row }) => `${row.getValue('discount')} %`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'درصد تخفیف',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-5.5 text-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
       })
    }  
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

function getRowItems(row) {
  return [
    {
      label: 'ویرایش محصول',
      onSelect() {
        openModal(row.original, 'product')
      }
    },
    {
      label: 'ویرایش نوع محصول',
      onSelect() {
        openModal(row.original, 'variant')
      }
    },
    {
      label: ' افزودن نوع محصول جدید',
      color: 'success',
      onSelect() {
      openModal(row.original, 'addVariant')
      }
    },
    {
      label: ' حذف محصول',
      color: 'error',
      onSelect() {
      openModal(row.original, 'deleteProduct')
      }
    },
    {
      label: ' حذف نوع محصول',
      color: 'error',
      onSelect() {
      openModal(row.original, 'deleteVariant')
      }
    },
  ]
}

const globalFilter = ref('')

const selectedProduct = ref(null)
const showProductModal = ref(false)
const showVariantModal = ref(false)
const showDeleteProductModal = ref(false)
const showDeleteVariantModal = ref(false)
const showNewVariantModal = ref(false)

const openModal = (product, item) => {
  selectedProduct.value = product

  showProductModal.value = false
  showVariantModal.value = false
  showDeleteProductModal.value = false
  showDeleteVariantModal.value = false
  showNewVariantModal.value = false

  switch (item) {
    case 'product':
      showProductModal.value = true
      break
    case 'variant':
      showVariantModal.value = true
      break
    case 'addVariant' :
      showNewVariantModal.value = true
      break
    case 'deleteProduct':
      showDeleteProductModal.value = true
      break
    case 'deleteVariant':
      showDeleteVariantModal.value = true
      break
  }
}

const {deleteItem} = useAdmin()

async function deleteProduct() {
  const response = await deleteItem('products', selectedProduct.value.product_id)
  if (response.success) {
    toast.add({ title: 'حذف محصول', description: 'حذف محصول با موفقیت انجام شد.', color: 'success', onClose: () => window.location.reload()})
  }else{
    toast.add({ title: 'خطا', description: 'حذف محصول با خطا مواجه شد.', color: 'error' })
  }
}

async function deleteVariant() {
  const response = await deleteItem('variants', selectedProduct.value.variant_id)
  if (response.success) {
    toast.add({ 
      title: 'حذف نوع محصول', 
      description: 'حذف نوع محصول با موفقیت انجام شد.', 
      color: 'success',
      onClose: () => window.location.reload()
    })
  }else{
    toast.add({ title: 'خطا', description: 'حذف نوع محصول با خطا مواجه شد.', color: 'error' })
  }
  
}

</script>



<template>
    <div class=" bg-zinc-50 rounded-2xl shadow my-20 p-3">
        <h1 class=" text-2xl font-azarmehrbold text-center mb-5">{{title}}</h1>
        <UInput
        v-model="globalFilter"
        class="max-w-sm mb-4"
        placeholder="جست و جو..."
        />
        <UTable ref="table" sticky  v-model:global-filter="globalFilter" :data="data" :columns="columns" class="flex-1 max-h-200" />
    </div>

    <UModal class=" my-3"
      v-model:open="showProductModal"
      title="ویرایش محصول"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">

      <template #body>
        <AdminProductForm :product="selectedProduct" :edit="true" :categories="categories"/>
      </template>

    </UModal>

    <UModal class=" my-3"
      v-model:open="showVariantModal"
      title="ویرایش نوع محصول"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">

      <template #body>
        <AdminVariantForm :product="selectedProduct" :edit="true" :add="false"/>
      </template>

    </UModal>

    <UModal
      v-model:open="showDeleteProductModal"
      title="حذف محصول"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-md', header: 'justify-center' }"
    >
      <template #body>
        <div class="text-center py-6">
          <p class="leading-loose">آیا مطمئن هستید که می‌خواهید محصول <span class=" px-1 rounded-md bg-indigo-400 text-white">{{selectedProduct.product_title}}</span> را حذف کنید؟</p>
        </div>
      </template>
      <template #footer>
        <UButton color="error" @click="deleteProduct">حذف</UButton>
        <UButton variant="ghost" @click="showDeleteProductModal = false">انصراف</UButton>
      </template>
    </UModal>

    <UModal
      v-model:open="showDeleteVariantModal"
      title="حذف نوع محصول"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-md', header: 'justify-center' }"
    >
      <template #body>
        <div class="text-center py-6">
            <p class="leading-loose">آیا مطمئن هستید که می‌خواهید نوع محصول <span class=" px-1 rounded-md bg-gray-400 text-white">{{selectedProduct.variant_title}}</span> را برای محصول <span class=" px-1 rounded-md bg-indigo-400 text-white">{{selectedProduct.product_title}}</span> حذف کنید؟</p>
        </div>
      </template>
      <template #footer>
        <UButton color="error" @click="deleteVariant">حذف</UButton>
        <UButton variant="ghost" @click="showDeleteVariantModal = false">انصراف</UButton>
      </template>
    </UModal>

    <UModal
      v-model:open="showNewVariantModal"
      title="افزودن نوع محصول جدید"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-4xl', header: 'justify-center' }"
    >
      <template #body>
        <AdminVariantForm :product="selectedProduct" :edit="false" :add="true"/>
      </template>
    </UModal>

</template>
