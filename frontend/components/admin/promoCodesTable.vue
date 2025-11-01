<script setup>

const {fetchAll} = useAdmin()
const codes = ref()
codes.value = await fetchAll('promos')


import { h, resolveComponent } from 'vue'
import { useClipboard } from '@vueuse/core'
import { separatePrice } from 'price-seprator'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const columns = [
  {
    accessorKey: 'id',
    cell: ({ row }) => row.getValue('id'),
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'شماره کد تخفیف',
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
    cell: ({ row }) => {
      const discount = row.getValue('discount')
      return discount > 0 ? `${discount}٪` : 'بدون تخفیف'
    },
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
    accessorKey: 'free_shipping',
    cell: ({ row }) => row.getValue('free_shipping') ? '✅' : '❌',
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ارسال رایگان',
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
    accessorKey: 'is_global',
    cell: ({ row }) => row.getValue('is_global') ? '✅' : '❌',
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'عمومی',
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
    cell: ({ row }) => {
      const color = {
        active: 'success',
        disabled: 'neutral',
        expired: 'error'
      }[row.getValue('status')]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status') === 'active'
          ? 'فعال'
          : row.getValue('status') === 'disabled'
            ? 'غیر فعال'
            : 'منقضی شده'
      )
    },
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'وضعیت',
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
    accessorKey: 'expire_date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('expire_date'))
      return date.toLocaleDateString('fa-IR')
    },
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'تاریخ انقضا',
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
        openModal(row.original,true)
      }
    },
    {
      label: 'حذف کد تخفیف',
      color: 'error',
      onSelect() {
        openModal(row.original,false)
      }
    },
  ]
}

const globalFilter = ref('')

const selectedCode = ref(null)
const showModal = ref(false)
const showDelete = ref(false)

const openModal = (code,edit) => {
  selectedCode.value = code

  if (edit) {
    showModal.value = true
    showDelete.value = false
  }else{    
    showModal.value = false
    showDelete.value = true
  }
}

const {deleteItem} = useAdmin()

async function deleteCode() {
  const response = await deleteItem('promos', selectedCode.value.id)
  if (response.success) {
    toast.add({ title: 'حذف تخفیف', description: 'حذف تخفیف با موفقیت انجام شد.', color: 'success', onClose: () => window.location.reload()})
  }else{
    toast.add({ title: 'خطا', description: 'حذف محصول با خطا مواجه شد.', color: 'error' })
  }
}

</script>



<template>
  <div class=" bg-zinc-50 rounded-2xl shadow my-20 p-3">
      <p class=" mt-2 mb-4 "><span class=" font-semibold text-red-500">توجه: </span>اگر میخواهید کد تخفیف مورد نظر را به کاربر خاصی اختصاص دهید، به صفحه <NuxtLink class=" text-gray-400 hover:text-gray-500" to="/admin/customers">مشتری ها  </NuxtLink>مراجعه کنید</p>
        <UInput
        v-model="globalFilter"
        class="max-w-sm mb-4"
        placeholder="فیلتر..."
        />
        {{ globalFilter }}
        <UTable ref="table" sticky v-model:global-filter="globalFilter" :data="codes" :columns="columns" class="flex-1 max-h-200" />
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

  <UModal
      v-model:open="showDelete"
      title="حذف کد تخفیف"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-md', header: 'justify-center' }"
    >
      <template #body>
        <div class="text-center py-6">
          <p class="leading-loose">آیا مطمئن هستید که می‌خواهید کد تخفیف <span class=" px-1 rounded-md bg-indigo-400 text-white">{{selectedCode.code}} ( {{selectedCode.title}} )</span> را حذف کنید؟</p>
        </div>
      </template>
      <template #footer>
        <UButton color="error" @click="deleteCode">حذف</UButton>
        <UButton variant="ghost" @click="showDelete = false">انصراف</UButton>
      </template>
  </UModal>

</template>
