<script setup >

const props = defineProps({
    active: Number
})


const items = ref([
  {
    title: 'بررسی سبد خرید',
    icon: 'i-lucide-monitor-check'
  },
  {
    title: 'اطلاعات ارسال',
    icon: 'i-lucide-truck'
  },
  {
    title: 'پایان خرید',
    icon: 'i-lucide-circle-check'
  }
])
</script>

<template>
  <UStepper size="xl" disabled v-model="props.active" :items="items" class="w-full" />
</template>