<script setup>
import { NuxtLink } from '#components';

    const props = defineProps({
        title: String,
        items: Array,
    })
</script>

<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <ul class="space-y-2">
            <li v-for="item in items" :key="item">
                <NuxtLink :to="item.href" class="text-gray-400 hover:text-white transition">{{ item.name }}</NuxtLink>
            </li>
        </ul>
    </div>

</template>