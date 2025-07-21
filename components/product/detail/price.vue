<script setup>
    const props = defineProps({
        price: Number,
        available: Boolean,
        off: Number,

    })
    const number = ref(1)

    const realPrice = (props.price * (100 - props.off)) / 100 
</script>

<template>
    <div class="my-4 text-center">
      <div v-if="!available">
          <h3 class="text-2xl text-red-700">موجود نیست</h3>
      </div>
      <div v-else-if="off != 0" class="flex justify-center gap-4">
          <h3 class="text-2xl text-zinc-400 line-through">{{price * number}}</h3>
          <h3 class="text-2xl text-indigo-800 font-bold">{{realPrice * number}} <span class="text-lg text-indigo-200">تومان</span> </h3>
      </div>
      <div v-else>
          <h3 class="text-2xl text-indigo-800">{{price * number}} <span class="text-lg text-indigo-200">تومان</span> </h3>
      </div>
    </div>
    
    <div v-if="available" class="flex justify-center my-4 gap-4 items-center">
      <UInputNumber
      v-model="number"
      :increment="{
        color: 'neutral',
        class: 'cursor-pointer',
        size: 'xl'
      }"
      :decrement="{
        color: 'neutral',
        class: 'cursor-pointer',
        size: 'xl'
      }"
      :min="1" :max="10"
      size="xl"
      color="neutral" highlight
    />
    <span class="text-xl text-zinc-700">عدد</span>
    </div>
</template>