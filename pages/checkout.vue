<script setup>
  useHead({
      title: 'بررسی اطلاعات'
  })
</script>

<template>
      <div class="container mx-auto p-4 max-w-6xl">
        <Stepper :active="1" class="my-10"/>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <checkout-form />

        <checkout-sidebar :subtotal="450000" :discount="45000" :delivery-cost="60000"/>

        </div>

        <div class="w-full flex p-2 justify-center md:justify-start my-5">
            <NuxtLink to="/cart">
                <button class="rounded-lg bg-white border-2 border-indigo-400 text-indigo-500 shadow p-2 flex items-center cursor-pointer"><span class="text-2xl mx-2">&rArr;</span> بررسی سبد خرید </button>
            </NuxtLink>
        </div>
        
      </div>

</template>