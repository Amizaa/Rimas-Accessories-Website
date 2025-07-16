<script setup>

const items = useBreadCrumbs()

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


