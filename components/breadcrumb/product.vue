<script setup>
const props = defineProps({
  category: String,
})

const route = useRoute()
const product = route.params.name

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
      label: `${product}`,
      to: `/product/${product}`
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


