<script setup>
    const props = defineProps({
        items: Array,
        placeholder: String,
        value: String,
        field: String,
        cartItem: Object,
    })

    const value = ref(props.value)

    const {updateCartItem} = useCart()

    function handleUpdate(value) {
    const original = props.cartItem
    const updates = {
        [props.field]: value
    }

    updateCartItem(original, updates)
    }


    
</script>

<template>
    <div class="flex my-2">
        <USelectMenu  @update:modelValue="val => handleUpdate(val)" style="direction: rtl;" :search-input="{placeholder: 'جست و جو',}" :placeholder="placeholder" v-model="value" :items="items" class="w-full"/>
    </div>
</template>