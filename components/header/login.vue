<script setup>
import userIcon from '~/assets/images/user.svg'
const {verifyOtp,requestOtp,fetchAuthenticatedUser} = useUser()


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
const phoneError = computed(() => {
  return schema.value.validate({ phone: state.phone }).error;
})



const user = ref(null)
const loading = ref(true)
onMounted(async () => {
  const { default: Joi } = await import('joi'); 
  
  schema.value = Joi.object({
    phone: Joi.string().pattern(/^09[0-9]{9}$/).required().label('شماره موبایل').messages({
      'string.pattern.base': 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد',
      'string.empty': 'شماره موبایل نمی‌تواند خالی باشد',
      'any.required': 'لطفا شماره موبایل را وارد کنید',
    }),
    
    
  });
  user.value = await fetchAuthenticatedUser()
  loading.value = false;
});


const pincode = ref()
const codeError = ref(false)

const progress = ref(0)
const duration = 120 // seconds
const intervalMs = 1000
let intervalId = undefined

const remainingSeconds = computed(() => {
  return duration - Math.floor((progress.value / 120) * duration)
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const resetTimer = () => {

  progress.value = 0
  clearInterval(intervalId)
  
  intervalId = setInterval(() => {
    if (progress.value < 120) {
      progress.value += 120 / duration
    } else {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }, intervalMs)
  
}

onUnmounted(() => {
  clearInterval(intervalId)
})

const sendOtp = async () => {
  resetTimer()
  await requestOtp(state.phone)
}

const login = async () => {
  const loggedInUser = await verifyOtp(state.phone, parseInt(pincode.value.join('')))
  if (loggedInUser) {
    codeError.value = false
    user.value = loggedInUser
    navigateTo("/my-account/profile")
  } else {
    codeError.value = true
  }

}

</script>


<template>
  <h4 v-if="loading" class="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 cursor-pointer size-7"></h4>
  <userIcon v-else-if="!loading && user && !user.is_staff" @click="navigateTo('/my-account/profile')" class="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 cursor-pointer size-7"/>
  <userIcon v-else-if="!loading && user && user.is_staff" @click="navigateTo('/admin/dashboard')" class="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 cursor-pointer size-7"/>
  <UModal v-else closeIcon=" " v-model:open="first" :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr',header: 'justify-center' }">
    <UButton variant="link" class="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 cursor-pointer" label="ورود / ثبت نام" color="neutral"  />


    <template #header>
      <div class=" text-center">
        <h2 class="text-2xl font-azarmehrbold">ورود / ثبت نام</h2>
        <h4 class="text-lg my-2">برای ورود یا ثبت نام شماره همراه خود را وارد کنید</h4>
      </div>
    </template>

    <template #body>
        <UForm  :schema="schema" :state="state" class="w-full" >
          <UFormField class="flex justify-center w-full"  name="phone">
            <UInput style="direction:ltr" :ui="{ base:'text-center'}" class="w-full" size="xl" v-model="state.phone" />
          </UFormField>
        </UForm>

    </template>

    
    <template #footer>
      <div class="space-x-3">
        <UButton size="xl" class="cursor-pointer" label="ادامه" @click="sendOtp(); switchModal()" color="primary" :disabled="phoneError" />
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
        <UPinInput :length="6"  v-model="pincode"/>
      </div>
        <div class="space-y-2 mt-2">
          <UProgress max="120"  v-model="progress" color="primary" />
          <div class="flex justify-between">
            <p @click="switchModal()" class="text-sm text-gray-600 cursor-pointer">
              تغییر شماره
            </p>
            <p v-if="progress == 120 || remainingSeconds == 0" @click="sendOtp()" class="text-sm text-gray-600 cursor-pointer">
              ارسال مجدد کد تایید
            </p>
            <p v-else class="text-sm text-gray-600">
             {{ formatTime(remainingSeconds) }}
            </p>

          </div>
          <div class="text-center">
            <p v-if="codeError" class=" text-red-600">کد وارد شده صحیح نمیباشد</p>
          </div>
        </div>

    </template>
    
    <template #footer>
      <div class="space-x-3">
        <UButton v-if="progress != 120" size="xl" class="cursor-pointer" label="ورود" color="primary" @click="login()"/>
        <UButton size="xl" class="cursor-pointer" label="بستن" color="neutral" variant="outline" @click="second = false" />
      </div>
    </template>
  </UModal>

</template>


