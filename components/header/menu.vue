<script setup>
import Logo from '@/public/images/Logo2.png'


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

import Ankle from '~/assets/images/ankle.svg'
import Bracelet from '~/assets/images/bracelet.svg'
import Earrings from '~/assets/images/earrings.svg'
import Jewerly from '~/assets/images/jewelry.svg'
import Necklace from '~/assets/images/necklace.svg'
import Heart from '~/assets/images/heart.svg'
import ShoppingCart from '~/assets/images/shopping_cart.svg'
import SearchBar from './searchBar.vue'


const categories = [
  { name: 'گوشواره', description: 'زیباترین گوشواره ها', href: '#', icon: Earrings },
  { name: 'گردنبند', description: 'با گردنبد های ما شیک شوید', href: '#', icon: Necklace },
  { name: 'دستبند', description: 'مناسب دست های ظریف شما', href: '#', icon: Bracelet },
  { name: 'پابند', description: 'اصیل و زیبا بمانید', href: '#', icon: Ankle },
  { name: 'ست', description: 'برای پارتنر های عاشق', href: '#', icon: Jewerly },

]

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="bg-white sticky top-0 shadow z-50">
    <div class="flex lg:hidden w-full justify-center my-4">
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">ریماس اکسسوری</span>
        <img class="h-14 w-auto" :src='Logo' alt="لوگوی ریماس اکسسوری" />
      </a>
      <div class="flex lg:hidden absolute right-6">
        <button type="button" class="  my-auto h-1/2 cursor-pointer -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">باز کردن منوی اصلی</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>
    <nav class="mx-auto flex max-w-8xl items-center justify-between p-2 lg:px-8" aria-label="Global">
      <div class="hidden lg:flex-1 lg:flex">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">ریماس اکسسوری</span>
          <img class="h-10 w-auto" :src="Logo" alt="لوگوی ریماس اکسسوری" />
        </a>
      </div>

      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <Popover class="relative">
          <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold cursor-pointer text-gray-900">
            <ChevronDownIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
            دسته بندی
          </PopoverButton>
          
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in categories" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50">
                  <!-- <div class="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="size-6 text-gray-600 blue group-hover:fill-indigo-600" aria-hidden="true" />
                  </div> -->
                  <div class="flex-auto hover:text-indigo-600">
                    <a :href="`/category/${item.name}`" class="block font-semibold text-gray-900 hover:text-indigo-600">
                      {{ item.name }}
                      <span class="absolute inset-0" />
                    </a>
                    <p class="mt-1 text-gray-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                <a v-for="item in callsToAction" :key="item.name" :href="`/category/${item.name}`" class="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100">
                  <component :is="item.icon" class="size-5 flex-none text-gray-400" aria-hidden="true" />
                  {{ item.name }}
                </a>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
        
        <a href="/blog" class="text-sm/6 font-semibold text-gray-900">وبلاگ</a>
        <a href="#" class="text-sm/6 font-semibold text-gray-900">پیشنهادات</a>
        <a href="/about-us" class="text-sm/6 font-semibold text-gray-900">درباره ما</a>
        <a href="/contact-us" class="text-sm/6 font-semibold text-gray-900">تماس با ما</a>
      </PopoverGroup>

      <div class="flex flex-3 lg:flex-1 justify-center w-full">
        <HeaderSearchBar/>
      </div>

      <div class="flex justify-end space-x-4">
        <HeaderLogin />
        <span>|</span>
        <a href="#">
          <Heart class="text-sm/6 size-7 cursor-pointer hover:fill-red-500"/>
        </a>
        <a href="/cart">
          <ShoppingCart class="text-sm/6 size-7 cursor-pointer hover:fill-blue-600"/>
        </a>
      </div>
    </nav>

      
    <TransitionRoot appear :show="mobileMenuOpen" as="template">
      <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
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
              
                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                  <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    دسته بندی ها
                    <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none']" aria-hidden="true" />
                  </DisclosureButton>
                <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-out"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0">
                    <DisclosurePanel class="mt-2 space-y-2">
                      <DisclosureButton v-for="item in [...categories]" :key="item.name" as="a" :href="`/category/${item.name}`" class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50">{{ item.name }}</DisclosureButton>
                    </DisclosurePanel>
                </transition>
                </Disclosure>
                <a href="/blog" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">وبلاگ</a>
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">پیشنهادات</a>
                <a href="/about-us" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">درباره ما</a>
                <a href="/contact-us" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">تماس با ما</a>
              </div>
            </div>
          </div>
        </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
      
  </header>
</template>

