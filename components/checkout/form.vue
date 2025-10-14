<script setup>
const {fetchAuthenticatedUser, updateUser} = useUser()   // DO NOT await here

const user = ref('')
user.value = await fetchAuthenticatedUser()

const addresses = computed(() => user.value?.addresses ?? [])

const items = computed(() => {
    return addresses.value.map(address => ({
            label: address.address_detail,
            value: address.id.toString(),
            receiver_name: address.receiver_name,
            receiver_phone: address.receiver_phone,
            province: address.province,
            city: address.city,
            postal_code: address.postal_code
            }))
}) 
const selectedAddress = ref(addresses.value[0]?.id.toString())

const state = reactive({
    firstname: user.value?.first_name,
    lastname: user.value?.last_name,
    email:user.value?.email,
    phone: user.value?.phone,
    description:undefined
});

const errors = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: ''
});


function validateForm(data) {
  let isValid = true;

  if (!data.firstname) {
    errors.firstname = 'لطفا نام خود را وارد کنید';
    isValid = false;
  } else {
    errors.firstname = '';
  }
  
  if (!data.lastname) {
    errors.lastname = 'لطفا نام خانوادگی خود را وارد کنید';
    isValid = false;
  } else {
    errors.lastname = '';
  }

  if (!data.phone){
    errors.phone = 'شماره همراه خود را وارد کنید';
    isValid = false;
  } else if (!/^09[0-9]{9}$/.test(data.phone)) {
    errors.phone = 'شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد';
    isValid = false;
  } else {
    errors.phone = '';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
  errors.email = 'فرمت ایمیل معتبر نیست';
  isValid = false;
  } else {
  errors.email = '';
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

const emit = defineEmits(['validated'])

async function submitForm() {
  const isValid = validateForm(state);
  if (!isValid) {
    return
  }

  const userUpdatedData = {
    first_name: state.firstname,
    last_name: state.lastname,
    phone: state.phone,
    email: state.email
  }
  await updateUser(userUpdatedData,user.value?.id)

  emit('validated', {
    selectedAddress: selectedAddress.value,
  })
}

defineExpose({ submitForm })

async function refreshUser() {
  const updatedUser = await fetchAuthenticatedUser()
  user.value = updatedUser

  selectedAddress.value = addresses.value[0]?.id.toString()
}
</script>


<template>
        <div class=" rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <UForm :state="state" class="space-y-4 space-x-3 grid grid-cols-6">
                <UFormField class="md:col-span-3 col-span-6" name="firstname" label="نام">
                    <UInput class=" w-full" v-model="state.firstname" />
                    <span class="text-red-500 text-sm">{{ errors.firstname }}</span>
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="lastname" label="نام خانوادگی">
                    <UInput class=" w-full" v-model="state.lastname" />
                    <span class="text-red-500 text-sm">{{ errors.lastname }}</span>
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="phone" label="شماره همراه">
                    <UInput class=" w-full" v-model="state.phone" />
                    <span class="text-red-500 text-sm">{{ errors.phone }}</span>
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="email" label="ایمیل (اختیاری)">
                    <UInput class=" w-full" v-model="state.email" />
                    <span class="text-red-500 text-sm">{{ errors.email }}</span>
                </UFormField>
                <div class="col-span-6">
                    <h4 class=" text-center text-sm mb-3">انتخاب آدرس</h4>
                    <URadioGroup
                        indicator="hidden"
                        variant="card"
                        :items="items"
                        v-model="selectedAddress"
                        :ui="{ fieldset:' grid grid-cols-2 md:grid-cols-3' , item:' cursor-pointer'}"
                        style="direction: rtl;"
                    >
                        <template #label="{ item }">
                            <div class="text-right space-y-2" style="direction: ltr;">
                                <p class=" text-sm">گیرنده: <span class="font-semibold">{{ item.receiver_name }}</span></p>
                                <p class=" text-sm">شماره همراه گیرنده: <span class="font-semibold">{{ item.receiver_phone }}</span></p>
                                <p class=" text-sm"> کد پستی: <span class="font-semibold">{{ item.postal_code }}</span></p>
                                <p class="font-semibold text-sm">{{item.province}} - {{item.city}} - {{ item.label }}</p>
                            </div>
                        </template>
                    </URadioGroup>        
                </div>
                <div class="col-span-6">
                    <AccountAddressForm @addressAdded="refreshUser" :user="user"/>
                </div>
                
                <UFormField class="col-span-6" label="توضیحات تکمیلی (اختیاری)" name="description">
                    <UTextarea class="w-full" placeholder="هر توضیحی که در رابطه با سفارش مورد نیاز است را در اینجا بیان کنید" v-model="state.description"/>
                </UFormField>

            </UForm>
        </div>

</template>



