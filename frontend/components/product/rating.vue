<template>

    <div class="flex space-x-2 justify-center my-4">
      <svg
        v-for="n in 5"
        :key="n"
        class="w-8 h-8 text-gray-400 cursor-pointer hover:text-yellow-400"
        :class="n <= selectedRating ? 'text-yellow-400' : ''"
        fill="currentColor"
        viewBox="0 0 20 20"
        @click="setRating(n)"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286
               3.95 4.146.018c.958.004 1.355 1.226.584 
               1.818l-3.36 2.455 1.287 3.951c.3.922-.756 
               1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1
               .541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-
               .018 1.286-3.95z"
        />
      </svg>
    </div>

    <div class="flex justify-center">
      <button
        class=" bg-indigo-400 text-white px-4 py-2 rounded-full hover:bg-indigo-500 transition-all duration-300 cursor-pointer"
        @click="submitRating"
      >
        ثبت امتیاز
      </button>
    </div>

</template>

<script setup>
import { ref } from 'vue'

const selectedRating = ref(0)
const submittedRating = ref(0)

function setRating(rating) {
  selectedRating.value = rating
}

function submitRating() {
  if (selectedRating.value > 0) {
    submittedRating.value = selectedRating.value
  } else {
    alert('Please select a rating before submitting.')
  }
}
</script>
