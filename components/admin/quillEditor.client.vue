<template>
  <div>
    <div ref="editor" class=" font-azarmehr" />
    <button class=" bg-amber-300" @click="saveContent">save</button>
  </div>
</template>

<script setup>
const props = defineProps({
  content: Object
})

import { ref, onMounted, nextTick } from 'vue'
import Quill from 'quill'
import QuillResizeImage from 'quill-resize-image';
import 'quill/dist/quill.snow.css'

Quill.register("modules/resize", QuillResizeImage);

const toolbarOptions = {
    container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],                     // block styles
        [{ header: 1 }, { header: 2 }],                   // custom headers
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }], // lists
        [{ script: 'sub' }, { script: 'super' }],         // sub/superscript
        [{ indent: '-1' }, { indent: '+1' }],             // indentation
        [{ direction: 'rtl' }],                           // text direction
        [{ size: ['small', false, 'large', 'huge'] }],    // font sizes
        [{ header: [1, 2, 3, 4, 5, 6, false] }],          // header levels
        [{ color: [] }, { background: [] }],              // text/background colors
        [{ font: [] }],                                   // font family
        [{ align: [] }],                                  // text alignment
        ['link', 'image', 'video', 'formula'],            // media and formula
        ['clean']   ,
    ],
   handlers: {
    undo: function () {
      this.quill.history.undo()
    },
    redo: function () {
      this.quill.history.redo()
    }
  }                                      // remove formatting
}

const editor = ref(null)
const quill = ref(null)
onMounted(async () => {
  await nextTick()

  
  if (!editor.value) {
    console.warn('Editor ref is still undefined after nextTick')
    return
  }
  
  quill.value = new Quill(editor.value, {
    theme: 'snow',
    modules:{
      toolbar: toolbarOptions,
      resize: {
        locale: {
          center: 'مرکز', // Optional: Persian labels
          left: 'چپ',
          right: 'راست'
        }
      },
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true
      }
      
    }
    
  })
  
  quill.value.on('text-change', () => {
    const html = quill.value.root.innerHTML
  })
  

  quill.value.root.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      quill.value.history.undo()
    } else if (e.ctrlKey && e.key === 'Z' || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault()
      quill.value.history.redo()
    }
  })
})

const saveContent = async () => {
  const html = quill.value.root.innerHTML
  const delta = quill.value.getContents()

  await $fetch('/api/save-quill-content', {
    method: 'POST',
    body: { content: html, delta: delta }
  })
}


</script>

<style scoped>
.ql-editor img {
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
}

</style>