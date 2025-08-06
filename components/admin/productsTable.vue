<script setup>
const props = defineProps({
    data: Array,
    title: String
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
    accessorKey: 'id',
    cell: ({ row }) => `${row.getValue('id')}`,
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
    accessorKey: 'title',
    cell: ({ row }) => `${row.getValue('title')}`,
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
    accessorKey: 'quantity',
    cell: ({ row }) => `${row.getValue('quantity') == 0 ? 'ناموجود' : row.getValue('quantity')}`,
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
    cell: ({ row }) => `${separatePrice(row.getValue('price'))} تومان`,
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
        class: '-mx-2.5',
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
        openModal(row.original)
      }
    },
  ]
}

const globalFilter = ref('')

const selectedProduct = ref(null)
const showModal = ref(false)

const openModal = (product) => {
  console.log(product);
  selectedProduct.value = product
  showModal.value = true
}
</script>



<template>
    <div class=" bg-zinc-50 rounded-2xl shadow my-20 p-3">
        <h1 class=" text-2xl font-azarmehrbold text-center mb-5">{{title}}</h1>
        <UInput
        v-model="globalFilter"
        class="max-w-sm mb-4"
        placeholder="فیلتر..."
        />
        {{ globalFilter }}
        <UTable ref="table" sticky  v-model:global-filter="globalFilter" :data="data" :columns="columns" class="flex-1 max-h-200" />
    </div>

    <UModal class=" my-3"
      v-model:open="showModal"
      title="ویرایش محصول"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">

      <template #body>
        <AdminProductForm :product="selectedProduct" :edit="true"/>
      </template>

  </UModal>

</template>
