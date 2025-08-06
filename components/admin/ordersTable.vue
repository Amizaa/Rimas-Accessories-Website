<script setup >
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
    accessorKey: 'orderId',
    cell: ({ row }) => `#${row.getValue('orderId')}`,
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'شماره سفارش',
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
    accessorKey: 'userId',
    cell: ({ row }) => `${row.getValue('userId')}`,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'سفارش دهنده',
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
    accessorKey: 'orderDate',
    cell: ({ row }) => {
      return new Date(row.getValue('orderDate')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'تاریخ',
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
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const color = {
        processing: 'secondary',
        delivered: 'success',
      }[row.getValue('status')]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status') == 'processing'? 'در حال بررسی' : 'ارسال شده'
      )
    }
  },
  {
    accessorKey: 'totalAmount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('payment'))
      
      const formatted = `${separatePrice(amount)} تومان`
      
      return h('div', { class: 'text-right font-medium' }, formatted)
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'مبلغ کل',
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
      label: 'مشاهده مشتری',
      onSelect() {
        navigateTo(`customers/${row.original.userId}`)
      }
    },
    {
      label: 'مشاهده جزئیات بیشتر',
      onSelect() {
        navigateTo(`orders/${row.original.orderId}`)
      }
    }
  ]
}

const globalFilter = ref('')
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

</template>
