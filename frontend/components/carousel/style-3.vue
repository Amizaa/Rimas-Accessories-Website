<script setup lang="ts">
const props = defineProps({
  images: Array
})

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
  Object.fromEntries(Array.from({ length: props.images.length }, (_, i) => [i, false]))
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
      :items="images"
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
      <div class="rounded-lg w-full h-90 bg-white relative overflow-hidden">
        <img :src="item.url"  class="h-full w-full rounded-lg object-cover"/>
      </div>
    </UButton>

    <UModal :ui="{ content:'max-w-2xl' }" :close="false" v-model:open="open[index]">
        <template #body>
            <img :src="item.url" class="rounded-lg w-full h-full" />
        </template>
    </UModal>

    </UCarousel>

    <div class="flex gap-1 justify-between pt-4 max-w-xs mx-auto">
      <div
        v-for="(item, index) in images"
        :key="index"
        class="size-11 opacity-25 hover:opacity-100 transition-opacity cursor-pointer"
        :class="{ 'opacity-100': activeIndex === index }"
        @click="select(index)"
      >
        <div class="rounded-lg w-full h-10 bg-white relative overflow-hidden">
          <img :src="item.url"  class="h-full w-full rounded-lg object-cover"/>
        </div>
      </div>
    </div>
  </div>
</template>