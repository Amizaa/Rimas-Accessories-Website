<script setup>

import { ProductList, SidebarFilter } from '#components';

</script>

<template>
    <div class="mt-5 shadow bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row">
        <SidebarFilter />
        
        <ProductList />

    </div>

</template>