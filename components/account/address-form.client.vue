<script setup>

const userComposable = useUser(1)   // DO NOT await here

const user = ref('')
user.value = await userComposable.fetchUser()

const toast = useToast()

const open = ref(false)

const state = reactive({
    address: undefined,
    province: undefined,
    city:undefined,
    postCode: undefined,
    receiverPhone: user.value.phone,
    receiverName: `${user.value.first_name} ${user.value.last_name}`,
});


const errors = reactive({
  receiverName: '',
  receiverPhone: '',
  address: '',
  province: '',
  city: '',
  postCode: '',
});


function validateForm(data) {
  let isValid = true;

  // Receiver Name
  if (!data.receiverName || typeof data.receiverName !== 'string') {
    errors.receiverName = 'لطفا نام و نام خانوادگی گیرنده را وارد کنید';
    isValid = false;
  } else {
    errors.receiverName = '';
  }

  if (!data.receiverPhone){
    errors.receiverPhone = 'شماره همراه گیرنده را وارد کنید';
    isValid = false;
  } else if (!/^09[0-9]{9}$/.test(data.receiverPhone)) {
    errors.receiverPhone = 'شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد';
    isValid = false;
  } else {
    errors.receiverPhone = '';
  }


  // Address
  if (!data.address) {
    errors.address = 'لطفا آدرس خود را وارد کنید';
    isValid = false;
  } else {
    errors.address = '';
  }

  // Province
  if (!data.province) {
    errors.province = 'لطفا استان را وارد کنید';
    isValid = false;
  } else {
    errors.province = '';
  }

  // City
  if (!data.city) {
    errors.city = 'لطفا شهر را وارد کنید';
    isValid = false;
  } else {
    errors.city = '';
  }

  if (!data.postCode){
    errors.postCode = 'کد پستی را وارد کنید';
    isValid = false;
  }else if (!/^[0-9]{10}$/.test(data.postCode)) {
    errors.postCode = 'کد پستی باید دقیقاً ۱۰ رقم باشد';
    isValid = false;
  } else {
    errors.postCode = '';
  }

  return isValid;
}


const {provinceOptions} = useProvinces()
const provinceItems = provinceOptions.map(province => province.name)
const provinceId = computed(() =>
{return state.province ? provinceOptions.filter(province => province.name === state.province)[0].id : ''}
)

const CityItems = computed(() =>{
  const {CityOptions} = useCity(parseInt(provinceId.value))
  return CityOptions
})

watch(() => state.province, () => {
  state.city = undefined
})

const {saveAddress} = await useSaveAddress()

const emit = defineEmits(['addressAdded'])

async function onSubmit() {
  const isValid = validateForm(state);

  if (!isValid) {
    return;
  }

  const payload = {
    receiver_name: state.receiverName,
    receiver_phone: state.receiverPhone,
    address_detail: state.address,
    province: state.province,
    city: state.city,
    postal_code: state.postCode,
    user: 1,
  };

  const result = await saveAddress(payload);
  if (result.success) {
    open.value = false;
    toast.add({ title: 'ذخیره آدرس', description: 'آدرس با موفقیت ذخیره شد', color: 'success' })
    emit('addressAdded')
  } else {
    toast.add({ title: 'خطا', description: 'دوباره تلاش کنید', color: 'error' })
  }
}
</script>


<template>
  <UButton variant="link" @click="open = true" class="text-sm font-semibold text-indigo-500 hover:text-indigo-600 cursor-pointer" label=" + اضافه کردن آدرس جدید" color="neutral"  />
  <UModal class=" my-3"
     title="اضافه کردن آدرس جدید"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full cursor-pointer'
    }"
     v-model:open="open" :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">


    <template #body>
        <div v-if="open">
            <UForm :state="state" class="space-y-4 space-x-3 grid grid-cols-6" @submit="onSubmit">
                <UFormField class="col-span-3"  name="receiverName" label="نام و نام خانوادگی گیرنده">
                    <UInput class=" w-full" v-model="state.receiverName" />
                    <span class="text-red-500 text-sm">{{ errors.receiverName }}</span>
                </UFormField>
                <UFormField class="col-span-3"  name="receiverPhone" label="شماره همراه گیرنده">
                    <UInput class=" w-full" v-model="state.receiverPhone" />
                    <span class="text-red-500 text-sm">{{ errors.receiverPhone }}</span>
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6" name="province" label="استان">
                    <USelectMenu placeholder="انتخاب استان"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی استان',}" v-model="state.province" :items="provinceItems" class="w-full" />
                    <span class="text-red-500 text-sm">{{ errors.province }}</span>
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6" name="city" label="شهر">
                    <USelectMenu :disabled="CityItems.length === 0" placeholder="انتخاب شهر"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی شهر',}" v-model="state.city" :items="CityItems" class="w-full" />
                    <span class="text-red-500 text-sm">{{ errors.city }}</span>
                </UFormField>
                <UFormField class="col-span-2"  name="postCode" label="کد پستی">
                    <UInput placeholder="کد پستی 10 رقمی" class=" w-full" v-model="state.postCode" />
                    <span class="text-red-500 text-sm">{{ errors.postCode }}</span>
                </UFormField>
                <UFormField class="col-span-4"  name="address" label="آدرس">
                    <UInput class=" w-full" v-model="state.address" />
                    <span class="text-red-500 text-sm">{{ errors.address }}</span>
                </UFormField>
            
                <div class="flex justify-center col-span-6 my-3">
                   <UButton @click="onSubmit" type="submit" size="xl" class="cursor-pointer" color="primary" >
                        اضافه کردن آدرس جدید
                   </UButton>
                </div>
            </UForm>
        </div>
    </template>

  </UModal>
</template>



