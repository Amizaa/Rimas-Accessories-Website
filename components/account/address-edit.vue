<script setup>
import { EnvelopeIcon, MapPinIcon, PhoneIcon, UserCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  receivers: Object
})

const state = reactive({
    address: undefined,
    province: undefined,
    city: undefined,
    postCode: undefined,
    receiverPhone: undefined,
    receiverName: undefined,
});


const schema = ref(null); // Use ref so it's reactive

onMounted(async () => {
    const { default: Joi } = await import('joi'); // Or 'joi' if you're using the SSR-safe version
    
    schema.value = Joi.object({
        receiverName: Joi.string().required().label('نام و نام خانوادگی گیرنده').messages({
        'string.base': 'نام و نام خانوادگی گیرنده باید یک رشته باشد',
        'string.empty': 'نام و نام خانوادگی گیرنده نمی‌تواند خالی باشد',
        'any.required': 'لطفا نام و نام خانوادگی گیرنده را وارد کنید', 
        }),
        receiverPhone: Joi.string().pattern(/^09[0-9]{9}$/).label('شماره همراه').required().messages({
        'string.pattern.base': 'شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد',
        'string.empty': 'شماره همراه نمی‌تواند خالی باشد',
        'any.required': 'لطفا شماره همراه گیرنده را وارد کنید',
        }),
        address: Joi.string().required().label('آدرس').messages({
        'string.base': 'آدرس باید یک رشته باشد',
        'string.empty': 'آدرس نمی‌تواند خالی باشد',
        'any.required': 'لطفا آدرس خود را وارد کنید',
        }),
        province: Joi.string().required().label('استان').label('استان')
        .messages({
        'string.empty': 'استان نمی‌تواند خالی باشد',
        'any.required': 'لطفا استان را وارد کنید',
        }),
        city: Joi.string().required().label('شهر').messages({
        'string.empty': 'شهر نمی‌تواند خالی باشد',
        'any.required': 'لطفا شهر را وارد کنید',
        }),
        postCode: Joi.string().pattern(/^[0-9]{10}$/).required().label('کد پستی').messages({
        'string.pattern.base': 'کد پستی باید دقیقاً ۱۰ رقم باشد',
        'string.empty': 'کد پستی نمی‌تواند خالی باشد',
        'any.required': 'لطفا کد پستی را وارد کنید',
        }),
                
        });
});


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

const showModal = ref(false)

const openModal = (receiver) => {
    showModal.value = true

    state.receiverName = receiver.receiverName
    state.receiverPhone = receiver.receiverPhone
    state.address = receiver.address
    state.province = receiver.province
    state.city = receiver.city
    state.postCode = receiver.postCode
}

</script>


<template>
    <div class="grid grid-cols-3 gap-4 mt-3">
        <div @click="openModal(receiver)" v-for="(receiver,index) in receivers" :key="index" class=" col-span-3 lg:col-span-1 p-2 shadow bg-gray-100 rounded-lg space-y-3 cursor-pointer hover:scale-105 transition-all">
            <span class=" space-x-2 flex items-center">
                <UserCircleIcon class="w-6" />
                <h3>{{receiver.receiverName}}</h3>
            </span>
            <span class=" space-x-2 flex items-center">
                <PhoneIcon class="w-6" />
                <h3>{{receiver.receiverPhone}}</h3>
            </span>
            <span class=" space-x-2 flex items-center">
                <MapPinIcon class="w-6" />
                <h3 class=" line-clamp-1">{{receiver.address}}</h3>
            </span>
            <span class=" space-x-2 flex items-center">
                <EnvelopeIcon class="w-6" />
                <h3>{{receiver.postCode}}</h3>
            </span>
        </div>
    </div>

    <UModal class=" my-3"
    v-model:open="showModal"
     title="ویرایش آدرس"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full cursor-pointer'
    }"
     :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">

    <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4 space-x-3 grid grid-cols-6" >
            <UFormField class="col-span-3"  name="receiverName" label="نام و نام خانوادگی گیرنده">
                <UInput class=" w-full" v-model="state.receiverName" />
            </UFormField>
            <UFormField class="col-span-3"  name="receiverPhone" label="شماره همراه گیرنده">
                <UInput class=" w-full" v-model="state.receiverPhone" />
            </UFormField>
            <UFormField class="md:col-span-3 col-span-6" name="province" label="استان">
                <USelectMenu placeholder="انتخاب استان"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی استان',}" v-model="state.province" :items="provinceItems" class="w-full" />
            </UFormField>
            <UFormField class="md:col-span-3 col-span-6" name="city" label="شهر">
                <USelectMenu :disabled="CityItems.length === 0" placeholder="انتخاب شهر"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی شهر',}" v-model="state.city" :items="CityItems" class="w-full" />
            </UFormField>
            <UFormField class="col-span-2"  name="postCode" label="کد پستی">
                <UInput placeholder="کد پستی 10 رقمی" class=" w-full" v-model="state.postCode" />
            </UFormField>
            <UFormField class="col-span-4"  name="address" label="آدرس">
                <UInput class=" w-full" v-model="state.address" />
            </UFormField>
        
            <div class="flex justify-center col-span-6 my-3">
                <UButton type="submit" size="xl" class="cursor-pointer" label="ویرایش" color="primary" :disabled="error" />
            </div>
        </UForm>
    </template>

  </UModal>

</template>



