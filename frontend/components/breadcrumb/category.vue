<script setup>

const items = computed(() => {
  return useBreadCrumbs()
})

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


