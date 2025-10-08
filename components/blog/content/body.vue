<script setup>
import 'quill/dist/quill.snow.css'

const props = defineProps({
  body: String,
})
</script>

<template>
  <div class="ql-editor text-right" v-html="body"></div>
</template>

<style>
.ql-editor {
  direction: rtl;
  font-family: "Vazirmatn", sans-serif;
  line-height: 1.8;
}
</style>

