<script setup>
    const props = defineProps({
        body: String,
    })
</script>

<template>
    <div class=" text-right">
        {{ body }}
    </div>
</template>