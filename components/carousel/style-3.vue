<script setup lang="ts">
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6',
  
]

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carousel.value?.emblaApi?.scrollTo(index)
}


const open = reactive(
  Object.fromEntries(Array.from({ length: items.length }, (_, i) => [i, false]))
)

function openModal(index: number) {
  open[index] = true
}

</script>

<template>
  <div class="flex-1 w-full" style="direction:ltr">
    <UCarousel
      ref="carousel"
      v-slot="{ item, index }"
      :items="items"
      :prev="{ onClick: onClickPrev,  class: 'cursor-pointer' }"
      :next="{ onClick: onClickNext,  class: 'cursor-pointer' }"
      class="w-full mx-auto"
      @select="onSelect"
    >
        
    <UButton
        class="cursor-pointer p-0"
        color="neutral"
        variant="subtle"
        @click="openModal(index)"
      >
        <img :src="item" class="rounded-lg w-full h-full" />
    </UButton>

    <UModal :ui="{ content:'max-w-2xl' }" :close="false" v-model:open="open[index]">
        <template #body>
            <img :src="item" class="rounded-lg w-full h-full" />
        </template>
    </UModal>

    </UCarousel>

    <div class="flex gap-1 justify-between pt-4 max-w-xs mx-auto">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="size-11 opacity-25 hover:opacity-100 transition-opacity cursor-pointer"
        :class="{ 'opacity-100': activeIndex === index }"
        @click="select(index)"
      >
        <img :src="item" width="44" height="44" class="rounded-lg">
      </div>
    </div>
  </div>
</template>