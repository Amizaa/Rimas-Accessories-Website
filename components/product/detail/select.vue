<script setup>
    const props = defineProps({
        items: Array,
        title: String,
        placeholder: String,
        modelValue: String
    })

    const value = ref(props.modelValue)

    const emit = defineEmits(['update:modelValue'])

    watch(value, (newVal) => {
        emit('update:modelValue', newVal)
    })
</script>

<template>
    <div class="flex my-8 space-x-5">
        <p class="text-lg font-bold">{{ title }}:</p>
        <USelectMenu style="direction: rtl;" :search-input="{placeholder: 'جست و جو',}" :placeholder="placeholder" v-model="value" :items="items" class="w-3/4" size="xl" />
    </div>
</template>