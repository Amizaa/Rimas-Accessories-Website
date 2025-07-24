<script setup>
    const props = defineProps({
        items: Array,
        placeholder: String,
        value: String
    })

    const value = ref(props.value)
    
</script>

<template>
    <div class="flex my-2">
        <USelectMenu style="direction: rtl;" :search-input="{placeholder: 'جست و جو',}" :placeholder="placeholder" v-model="value" :items="items" class="w-full"/>
    </div>
</template>