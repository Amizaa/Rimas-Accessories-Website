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


const columns = [
  {
    accessorKey: 'id',
    cell: ({ row }) => `#${row.getValue('id')}`,
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
    cell: ({ row }) => {
      const user = row.original.user
      const firstName = user.first_name
      const lastName = user.last_name
      if (firstName || lastName) {
      return `${firstName ?? ''} ${lastName ?? ''}`.trim()
      }
      return user.phone
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: ' سفارش دهنده',
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
    accessorKey: 'order_date',
    cell: ({ row }) => { return formatPersianDate(row.getValue('order_date'))},
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
        pending: 'secondary',
        shipped: 'success',
        canceled: 'error'
      }[row.getValue('status')]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status') === 'pending'
          ? 'در حال بررسی'
          : row.getValue('status') === 'canceled'
            ? 'لغو شده'
            : 'ارسال شده'
      )
    }
  },
  {
    accessorKey: 'total_amount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('total_amount'))
      
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
        navigateTo(`orders/${row.original.id}`)
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
