<script setup>
import codes from '~/api/promoCodes.json'


import { h, resolveComponent } from 'vue'
import { useClipboard } from '@vueuse/core'
import { separatePrice } from 'price-seprator'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const columns = [
  {
    accessorKey: 'code',
    header: 'کد تخفیف',
    cell: ({ row }) => row.getValue('code')
  },
  {
    accessorKey: 'title',
    header: 'عنوان',
    cell: ({ row }) => row.getValue('title')
  },
  {
    accessorKey: 'discount',
    header: 'درصد تخفیف',
    cell: ({ row }) => {
      const discount = row.getValue('discount')
      return discount > 0 ? `${discount}٪` : 'بدون تخفیف'
    }
  },
  {
    accessorKey: 'freeShipping',
    header: 'ارسال رایگان',
    cell: ({ row }) => row.getValue('freeShipping') ? '✅' : '❌'
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return status === 'active' ? 'فعال' : 'منقضی شده'
    }
  },
  {
    accessorKey: 'expiresAt',
    header: 'تاریخ انقضا',
    cell: ({ row }) => {
      const date = new Date(row.getValue('expiresAt'))
      return date.toLocaleDateString('fa-IR')
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
            content: { align: 'end' },
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
      label: 'ویرایش کد تخفیف',
      onSelect() {
        openModal(row.original)
      }
    },
  ]
}

const globalFilter = ref('')

const selectedCode = ref(null)
const showModal = ref(false)

const openModal = (code) => {
  selectedCode.value = code
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
        <UTable ref="table" sticky  v-model:global-filter="globalFilter" :data="codes" :columns="columns" class="flex-1 max-h-200" />
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
        <AdminPromoCodeForm :code="selectedCode" :edit="true"/>
      </template>

  </UModal>

</template>
