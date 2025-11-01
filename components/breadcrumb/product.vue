<script setup>
const props = defineProps({
  category: String,
  productTitle: String,
})

let items = [   
    {
      label: 'خانه',
      to: '/'
    },
    {
      label: `${props.category}`,
      to: `/category/${props.category}`
    },
    {
      label: `${props.productTitle}`,
      to: `/product/${props.productTitle}`
    },
]

</script>

<template>
<UBreadcrumb 
  :items="items"
>
  <template #separator>
    <span class="mx-2 text-muted">/</span>
  </template>
</UBreadcrumb>
</template>

<style>
nav[aria-label="breadcrumb"] ol > li:last-of-type .truncate {
  color: #1c1c1c;
}
</style>


