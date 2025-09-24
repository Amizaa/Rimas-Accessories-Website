<script setup>
const {fetchAuthenticatedUser,updateUser} = useUser()

const state = reactive({
    firstname: undefined,
    lastname: undefined,
    email:undefined,
    phone:undefined,
});

const schema = ref(null);
const user = ref()

onMounted(async () => {
    const { default: Joi } = await import('joi'); // Or 'joi' if you're using the SSR-safe version
    
    schema.value = Joi.object({
        firstname: Joi.string().label('نام').messages({
        'string.base': 'نام باید یک رشته باشد',
        'string.empty': 'نام نمی‌تواند خالی باشد',
        'any.required': 'لطفا نام را وارد کنید',
        }),
        lastname: Joi.string().label('نام خانوادگی').messages({
        'string.base': 'نام خانوادگی باید یک رشته باشد',
        'string.empty': 'نام خانوادگی نمی‌تواند خالی باشد',
        'any.required': 'لطفا نام خانوادگی را وارد کنید',
        }),
        email: Joi.string().email({ tlds: { allow: false } }).label('ایمیل').optional().allow('').messages({
        'string.email': 'ایمیل وارد شده معتبر نیست',
        'string.empty': 'ایمیل نمی‌تواند خالی باشد',
        }),
        phone: Joi.string().pattern(/^09[0-9]{9}$/).label('شماره همراه').messages({
        'string.pattern.base': 'شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد',
        'string.empty': 'شماره همراه نمی‌تواند خالی باشد',
        'any.required': 'لطفا شماره همراه را وارد کنید',
        }),
                
        });

    user.value = await fetchAuthenticatedUser()

    state.firstname = user.value.first_name
    state.lastname = user.value.last_name
    state.phone = user.value.phone
    state.email = user.value.email
});

const toast = useToast()

const updateHandler = async() =>{
    const payload = {
        first_name: state.firstname,
        last_name: state.lastname,
        phone: state.phone,
        email: state.email,
    }
    const response = await updateUser(payload,user.value.id)

    if (response) {
        toast.add({ title: 'اطلاعات کاربری', description: 'اطلاعات با موفقیت بروزرسانی شد', color: 'success' })  
    }else{
        toast.add({ title: 'خطا', description: 'دوباره تلاش کنید', color: 'error' })
    }
}

</script>


<template>

    <div class="md:col-span-2">
        <div class=" rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <UForm  :schema="schema" :state="state" class="space-y-4 space-x-3 grid grid-cols-6">
                <UFormField class="md:col-span-3 col-span-6" name="firstname" label="نام">
                    <UInput class=" w-full" v-model="state.firstname" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="lastname" label="نام خانوادگی">
                    <UInput class=" w-full" v-model="state.lastname" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="phone" label="شماره همراه">
                    <UInput class=" w-full" v-model="state.phone" />
                </UFormField>
                <UFormField class="md:col-span-3 col-span-6"  name="email" label="ایمیل ">
                    <UInput class=" w-full" v-model="state.email" />
                </UFormField>
            </UForm>
            <div class="flex justify-center">
                <button
                    type="submit"
                    :class="[
                        'rounded-full p-3 my-2 transition-all text-white bg-indigo-400 hover:bg-indigo-500 cursor-pointer'
                    ]"
                    @click="updateHandler"
                >
                بروزرسانی اطلاعات
                </button>
            </div>
        </div>
    
    </div>
</template>



