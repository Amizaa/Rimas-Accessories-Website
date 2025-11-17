<script setup>

const {fetchAll} = useAdmin()
const products = ref()
const categories = ref()

const categoryResponse = await fetchAll('categories')
categories.value = categoryResponse.results

import { h, resolveComponent } from 'vue'

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
          label: 'کد دسته بندی',
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
    accessorKey: 'name',
    cell: ({ row }) => row.getValue('name'),
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'نام دسته بندی',
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
    accessorKey: 'slug',
    header: 'اسلاگ',
    cell: ({ row }) => row.getValue('slug')
  },
  {
    accessorKey: 'product_count',
    cell: ({ row }) => {
      const count = row.getValue('product_count')
      return count > 0 ? `${count}` : 'بدون محصول ثبت شده'
    },
    header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'تعداد محصولات ثبت شده',
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
      label: 'ویرایش دسته بندی ',
      onSelect() {
        openModal(row.original,true)
      }
    },
    {
      label: 'حذف دسته بندی ',
      color: 'error',
      onSelect() {
        openModal(row.original,false)
      }
    },
  ]
}

const globalFilter = ref('')

const selectedCat = ref(null)
const showModal = ref(false)
const showDelete = ref(false)

const openModal = (category,edit) => {
  selectedCat.value = category

  if (edit) {
    showModal.value = true
    showDelete.value = false
  }else{    
    showModal.value = false
    showDelete.value = true
  }
}

const {deleteItem} = useAdmin()

async function deleteCategory() {
  const response = await deleteItem('categories', selectedCat.value.id)
  if (response.success) {
    toast.add({ title: 'حذف دسته بندی', description: 'حذف دسته بندی با موفقیت انجام شد.', color: 'success', onClose: () => window.location.reload()})
  }else{
    toast.add({ title: 'خطا', description: 'حذف دسته بندی با خطا مواجه شد.', color: 'error' })
  }
}

</script>



<template>
  <div class=" bg-zinc-50 rounded-2xl shadow my-20 p-3">
        <UInput
        v-model="globalFilter"
        class="max-w-sm mb-4"
        placeholder="فیلتر..."
        />
        {{ globalFilter }}
        <UTable ref="table" sticky v-model:global-filter="globalFilter" :data="categories" :columns="columns" class="flex-1 max-h-200" />
    </div>

    <UModal class=" my-3"
      v-model:open="showModal"
      title="ویرایش دسته بندی"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">

      <template #body>
        <AdminCategoryForm :category="selectedCat" :edit="true"/>
      </template>

  </UModal>

  <UModal
      v-model:open="showDelete"
      title="حذف دسته بندی"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-md', header: 'justify-center' }"
    >
      <template #body>
        <div class="text-center py-6">
          <p class="leading-loose">آیا مطمئن هستید که می‌خواهید دسته بندی <span class=" px-1 rounded-md bg-indigo-400 text-white">{{selectedCat?.name}}</span> را حذف کنید؟</p>
        </div>
      </template>
      <template #footer>
        <UButton color="error" @click="deleteCategory">حذف</UButton>
        <UButton variant="ghost" @click="showDelete = false">انصراف</UButton>
      </template>
  </UModal>

</template>
