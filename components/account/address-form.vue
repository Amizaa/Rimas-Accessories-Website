<script setup>
const open = ref(false)

const state = reactive({
    address: undefined,
    province: undefined,
    city:undefined,
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

</script>


<template>
    <UModal class=" my-3"
     title="اضافه کردن آدرس جدید"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full cursor-pointer'
    }"
     v-model:open="open" :ui="{ footer: 'justify-center',content: 'divide-none font-azarmehr max-w-4xl',header: 'justify-center' }">
    <UButton variant="link" class="text-lg font-semibold text-indigo-500 hover:text-indigo-600 cursor-pointer" label=" + اضافه کردن آدرس جدید" color="neutral"  />


    <template #body>
        <UForm  :schema="schema" :state="state" class="space-y-4 space-x-3 grid grid-cols-6" @submit="onSubmit">
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
                <UButton type="submit" size="xl" class="cursor-pointer" label="اضافه کردن" color="primary" :disabled="error" />
            </div>
        </UForm>
    </template>

  </UModal>

</template>



