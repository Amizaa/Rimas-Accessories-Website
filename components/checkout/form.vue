<script setup>
const state = reactive({
    firstname: undefined,
    lastname: undefined,
    address: undefined,
    province: undefined,
    city:undefined,
    postCode: undefined,
    email:undefined,
    phone:undefined,
    description:undefined
});

const schema = ref(null); // Use ref so it's reactive

onMounted(async () => {
    const { default: Joi } = await import('joi'); // Or 'joi' if you're using the SSR-safe version
    
    schema.value = Joi.object({
        firstname: Joi.string().required().label('نام').messages({
        'string.base': 'نام باید یک رشته باشد',
        'string.empty': 'نام نمی‌تواند خالی باشد',
        'any.required': 'لطفا نام را وارد کنید',
        }),
        lastname: Joi.string().required().label('نام خانوادگی').messages({
        'string.base': 'نام خانوادگی باید یک رشته باشد',
        'string.empty': 'نام خانوادگی نمی‌تواند خالی باشد',
        'any.required': 'لطفا نام خانوادگی را وارد کنید',
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
        email: Joi.string().email({ tlds: { allow: false } }).label('ایمیل').optional().allow('').messages({
        'string.email': 'ایمیل وارد شده معتبر نیست',
        'string.empty': 'ایمیل نمی‌تواند خالی باشد',
        }),
        phone: Joi.string().pattern(/^09[0-9]{9}$/).required().label('شماره موبایل').messages({
        'string.pattern.base': 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد',
        'string.empty': 'شماره موبایل نمی‌تواند خالی باشد',
        'any.required': 'لطفا شماره موبایل را وارد کنید',
        }),
        postCode: Joi.string().pattern(/^[0-9]{10}$/).required().label('کد پستی').messages({
        'string.pattern.base': 'کد پستی باید دقیقاً ۱۰ رقم باشد',
        'string.empty': 'کد پستی نمی‌تواند خالی باشد',
        'any.required': 'لطفا کد پستی را وارد کنید',
        }),
        description: Joi.string().allow('').optional()
                
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

    <div class="md:col-span-2">
        <div class=" rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <UForm  :schema="schema" :state="state" class="space-y-4 space-x-3 grid grid-cols-6" @submit="onSubmit">
                <UFormField class="md:col-span-3 col-span-6" name="firstname" label="نام">
                    <UInput class=" w-full" v-model="state.firstname" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="lastname" label="نام خانوادگی">
                    <UInput class=" w-full" v-model="state.lastname" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="phone" label="شماره موبایل">
                    <UInput class=" w-full" v-model="state.phone" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="email" label="ایمیل (اختیاری)">
                    <UInput class=" w-full" v-model="state.email" />
                </UFormField>
                <UFormField class="md:col-span-2 col-span-6" name="province" label="استان">
                    <USelectMenu placeholder="انتخاب استان"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی استان',}" v-model="state.province" :items="provinceItems" class="w-full" />
                </UFormField>
                <UFormField class="md:col-span-2 col-span-6" name="city" label="شهر">
                    <USelectMenu :disabled="CityItems.length === 0" placeholder="انتخاب شهر"  style="direction: ltr;" :search-input="{placeholder: 'جست و جوی شهر',}" v-model="state.city" :items="CityItems" class="w-full" />
                </UFormField>
                <UFormField class="md:col-span-2 col-span-6"  name="postCode" label="کد پستی">
                    <UInput placeholder="کد پستی 10 رقمی" class=" w-full" v-model="state.postCode" />
                </UFormField>
                <UFormField class="col-span-6"  name="address" label="آدرس">
                    <UInput class=" w-full" v-model="state.address" />
                </UFormField>
                
                <UFormField class="col-span-6" label="توضیحات تکمیلی (اختیاری)" name="description">
                    <UTextarea class="w-full" placeholder="هر توضیحی که در رابطه با سفارش مورد نیاز است را در اینجا بیان کنید" v-model="state.description"/>
                </UFormField>

            </UForm>
        </div>
    
    </div>
</template>



