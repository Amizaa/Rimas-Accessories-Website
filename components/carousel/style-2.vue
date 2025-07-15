<script setup>
  const props = defineProps({
    items: Array,
  })

</script>

<template>
  <UCarousel
    v-slot="{ item }"
    loop
    :auto-scroll="{speed:1}"
    :items="items"
    :ui="{ item: 'basis-1/3' }"
  >
  <ProductCard :item="item" class=" w-7/8" />
</UCarousel>
</template>

