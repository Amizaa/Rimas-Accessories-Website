<script setup>
const first = ref(false)
const second = ref(false)

const switchModal = () => {
  first.value = !first.value
  second.value = !second.value
}

const state = reactive({
    phone:undefined,
});

const schema = ref(null); 
const error = computed(() => {
  return schema.value.validate({ phone: state.phone }).error;
})


onMounted(async () => {
  const { default: Joi } = await import('joi'); 
  
    schema.value = Joi.object({
        phone: Joi.string().pattern(/^09[0-9]{9}$/).required().label('شماره موبایل').messages({
        'string.pattern.base': 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد',
        'string.empty': 'شماره موبایل نمی‌تواند خالی باشد',
        'any.required': 'لطفا شماره موبایل را وارد کنید',
        }),

                
        });
});
      

const pincode = ref()

const progress = ref(0)
const duration = 5 // seconds
const intervalMs = 1000
let intervalId = undefined

const remainingSeconds = computed(() => {
  return duration - Math.floor((progress.value / 100) * duration)
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

watch(second, (newVal) => {
  if (newVal) {

    progress.value = 0
    clearInterval(intervalId)

    intervalId = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 100 / duration
      } else {
        clearInterval(intervalId)
         intervalId = undefined
      }
    }, intervalMs)
  } else {
    clearInterval(intervalId)
     intervalId = undefined
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>


<template>
  <UModal closeIcon=" " v-model:open="first" :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr',header: 'justify-center' }">
    <UButton variant="link" class="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 cursor-pointer" label="ورود / ثبت نام" color="neutral"  />


    <template #header>
      <div class=" text-center">
        <h2 class="text-2xl font-azarmehrbold">ورود / ثبت نام</h2>
        <h4 class="text-lg my-2">برای ورود یا ثبت نام شماره همراه خود را وارد کنید</h4>
      </div>
    </template>

    <template #body>
        <UForm  :schema="schema" :state="state" class="w-full" @submit="onSubmit">
          <UFormField class="flex justify-center w-full"  name="phone">
            <UInput style="direction:ltr" :ui="{ base:'text-center'}" class="w-full" size="xl" v-model="state.phone" />
          </UFormField>
        </UForm>

    </template>

    
    <template #footer>
      <div class="space-x-3">
        <UButton size="xl" class="cursor-pointer" label="ادامه" @click="switchModal()" color="primary" :disabled="error" />
        <UButton size="xl" class="cursor-pointer" label="بستن" color="neutral" variant="outline" @click="first = false" />
      </div>
    </template>
  </UModal>

  <UModal closeIcon=" " v-model:open="second" :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr',header: 'justify-center' }">

    <template #header>
      <div class=" text-center">
        <h4 class="text-lg my-2">کد ارسال شده را وارد کنید</h4>
      </div>
    </template>

    <template #body>
      <div class="flex justify-center w-full">
        <UPinInput v-model="pinCode"/>
      </div>
        <div class="space-y-2 mt-2">
          <UProgress v-model="progress" color="primary" />
          <div class="flex justify-between">
            <p @click="switchModal()" class="text-sm text-gray-600 cursor-pointer">
              تغییر شماره
            </p>
            <p v-if="progress == 100" class="text-sm text-gray-600">
              ارسال مجدد کد تایید
            </p>
            <p v-else class="text-sm text-gray-600">
             {{ formatTime(remainingSeconds) }}
            </p>

          </div>
        </div>

    </template>
    
    <template #footer>
      <div class="space-x-3">
        <UButton size="xl" class="cursor-pointer" label="ورود" color="primary" />
        <UButton size="xl" class="cursor-pointer" label="بستن" color="neutral" variant="outline" @click="second = false" />
      </div>
    </template>
  </UModal>

</template>


