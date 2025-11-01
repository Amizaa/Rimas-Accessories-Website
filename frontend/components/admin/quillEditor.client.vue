<template>
  <div>
    <div ref="editor" class=" font-azarmehr" />
    <p class="text-red-400 mt-3">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  post: Object,
  modelValue: Object,
  error: String
})

const images = ref([])

const emit = defineEmits(['update:modelValue'])

import { ref, onMounted, nextTick } from 'vue'
import Quill from 'quill'
import QuillResizeImage from 'quill-resize-image';
import 'quill/dist/quill.snow.css'

Quill.register("modules/resize", QuillResizeImage);
let quill = null

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
      image: function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          // editor را از this.quill (در handler های Quill) یا quill.value بگیر
          const editor = (typeof this !== 'undefined' && this.quill) ? this.quill : (quill && quill ? quill : null);

          if (!editor) {
            console.warn('Quill editor not initialized yet — saving file for later.');
            // اگر می‌خوایید فایل را نگه دارید تا بعدا وارد کنید:
            images.value.push({ file, placeholder: `__image_${Date.now()}__` });
            return;
          }

          // امن گرفتن selection — ممکنه null باشه (ادیتور فوکوس نداشته باشه)
          const range = editor.getSelection ? editor.getSelection() : null;
          const insertIndex = (range && typeof range.index === 'number') ? range.index : editor.getLength();

          const placeholder = `__image_${Date.now()}__`;
          editor.insertEmbed(insertIndex, 'image', placeholder);
          images.value.push({ file, placeholder });
      
        };
      },


    undo: function () {
      this.quill.history.undo()
    },
    redo: function () {
      this.quill.history.redo()
    }
  }                                      // remove formatting
}

const editor = ref(null)
onMounted(async () => {
  await nextTick()

  
  if (!editor.value) {
    console.warn('Editor ref is still undefined after nextTick')
    return
  }
  
  quill = new Quill(editor.value, {
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

  if (props.post) {
    console.log(props.post.delta);
    if (props.post.delta) {
      try {
        quill.setContents(props.post.delta)   // restore Quill delta
      } catch (err) {
        console.error("Invalid delta:", err)
        quill.root.innerHTML = props.post.content_html || "" // fallback to HTML
      }
    } else if (props.post.content_html) {
      quill.root.innerHTML = props.post.content_html
    }
  }
  
  quill.on('text-change', () => {
    const html = quill.root.innerHTML
  })

  quill.on('text-change', () => {
    emit('update:modelValue', {
      html: quill.root.innerHTML,
      delta: quill.getContents(),
      images: images.value
    })
  })
  

  quill.root.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      quill.history.undo()
    } else if (e.ctrlKey && e.key === 'Z' || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault()
      quill.history.redo()
    }
  })
})


</script>

<style scoped>
.ql-editor img {
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
}

</style>