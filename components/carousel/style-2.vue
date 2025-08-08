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
    :ui="{ item: 'md:basis-1/5 basis-1/2' }"
  >
  <ProductCard :item="item" class=" w-7/8" />
</UCarousel>
</template>

