<script setup>
import Logo from '@/public/images/Logo2.png'
const route = useRoute()

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon} from '@heroicons/vue/20/solid'

const items = [
    {name: 'داشبورد', href:'/admin/dashboard'},
    {name: 'مشتری ها', href:'/admin/customers'},
    {name: 'سفارش ها', href: '/admin/orders'},
    {name: 'محصولات', href: '/admin/products'},
    {name: 'دسته بندی ها', href: '/admin/categories'},
    {name: 'بلاگ', href: '/admin/blog'},
    {name: 'کد های تخفیف', href: '/admin/promoCodes'},
]


const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="bg-white sticky top-0 shadow z-50 ">
    <div class="flex w-full justify-center my-4">
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">ریماس اکسسوری</span>
        <img class="h-14 mb-2 w-auto" :src='Logo' alt="لوگوی ریماس اکسسوری" />
      </a>
      <div class="flex absolute right-6">
        <button type="button" class="  my-auto h-1/2 cursor-pointer -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">باز کردن منوی اصلی</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <TransitionRoot class="font-azarmehr" appear :show="mobileMenuOpen" as="template">
      <Dialog as="div"  @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-50 bg-black/25" />
        </TransitionChild>

        <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="-right-100"
            enter-to="right-0"
            leave="duration-200 ease-in"
            leave-from="right-0"
            leave-to="-right-100"
          >
        <DialogPanel class="fixed inset-y-0 -right-100 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">ریماس اکسسوری</span>
              <img class="h-8 w-auto" :src="Logo" alt="" />
            </a>
            <button type="button" class=" cursor-pointer -m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">بستن منو</span>
              <XMarkIcon class="size-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a v-for="(item,index) in items" :key="index" :href="item.href" class="-mx-3 flex justify-between rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    {{ item.name }}
                    <UBadge v-if="item.badge" class="font-bold rounded-full w-6 h-6 text-center">{{item.badge}}</UBadge>
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
      
  </header>
</template>

