<script setup>
const props = defineProps({
    code: Object,
    edit: Boolean
})

import {now, toCalendar, CalendarDate, PersianCalendar, DateFormatter, getLocalTimeZone, CalendarDateTime, GregorianCalendar } from '@internationalized/date'

const schema = ref(null);


const state = reactive({
  code: undefined,
  title: undefined,
  discount: undefined,
  status: undefined,
  expiresAt: undefined,
  freeShipping: undefined,
  isGlobal: true
})

if (props.code) {
    state.code = props.code.code
    state.title = props.code.title
    state.discount = props.code.discount
    state.status = props.code.status
    state.expiresAt = props.code.expire_date
    state.freeShipping = props.code.free_shipping
    state.isGlobal = props.code.is_global
}

onMounted(async () => {
  const { default: Joi } = await import('joi')
 

 schema.value = Joi.object({
  code: Joi.string()
    .uppercase()
    .required()
    .messages({
      'string.base': 'کد باید یک رشته باشد',
      'string.empty': 'لطفا کد را وارد کنید',
      'any.required': 'لطفا کد را وارد کنید'
    }),

  title: Joi.string()
    .required()
    .messages({
      'string.base': 'عنوان باید یک رشته باشد',
      'string.empty': 'لطفا عنوان را وارد کنید',
      'any.required': 'لطفا عنوان را وارد کنید'
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.base': 'درصد تخفیف باید عدد باشد',
      'number.min': 'تخفیف نمی‌تواند منفی باشد',
      'number.max': 'درصد تخفیف باید بین 0 تا 100 باشد',
      'any.required': 'لطفا درصد تخفیف را وارد کنید'
    }),

  status: Joi.string()
    .valid('active', 'expired', 'disabled')
    .required()
    .messages({
      'string.base': 'وضعیت باید یک رشته باشد',
      'any.only': 'وضعیت باید یکی از مقادیر active، expired یا inactive باشد',
      'any.required': 'لطفا وضعیت را وارد کنید'
    }),

  expiresAt: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'تاریخ انقضا باید معتبر باشد',
      'date.format': 'فرمت تاریخ باید ISO باشد',
      'any.required': 'لطفا تاریخ انقضا را وارد کنید'
    }),

  freeShipping: Joi.bool()
    .messages({
      'boolean.base': 'ارسال رایگان باید درست یا نادرست باشد',
      'any.required': 'لطفا ارسال رایگان را مشخص کنید'
    }),

  isGlobal: Joi.bool()
    .messages({
      'boolean.base': 'عمومی باید درست یا نادرست باشد',
    }),
 })

})

const toast = useToast()

const status = ref([
  { label: 'فعال', value:'active' },
  { label: 'غیر فعال',value: 'disabled'},
  { label: 'منقضی شده',value: 'expired' },
]);



const df = new DateFormatter('fa-IR-u-ca-persian', {
  dateStyle: 'medium'
})

let expireDate = null
let time = null
if (props.edit) {
  const dateTime = new Date(props.code.expire_date);
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  time = ref(`${hours}:${minutes}`);
  
  const grDate = new CalendarDate(new GregorianCalendar(), dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate());
  const prDate = toCalendar(grDate, new PersianCalendar());
  expireDate = new shallowRef(new CalendarDate(new PersianCalendar(), prDate.year, prDate.month, prDate.day))
}else{
  let tehranTime = now('Asia/Tehran');
  let date = new CalendarDate(tehranTime.year, tehranTime.month , tehranTime.day)
  let persianTime = toCalendar(date, new PersianCalendar());
  expireDate =  shallowRef(new CalendarDate(new PersianCalendar(), persianTime.year, persianTime.month , persianTime.day))
  time = ref(`${tehranTime.hour}:${tehranTime.minute}`)
}


import { vMaska } from 'maska/vue'

watchEffect(() => {
  state.expiresAt = getExpiresAt(expireDate.value, time.value)
})

function getExpiresAt(expireDate, timeStr) {
  if (!expireDate || !timeStr) return null
  
  const prDate = new CalendarDate(new PersianCalendar(), expireDate.year, expireDate.month , expireDate.day)
  let grDate = toCalendar(prDate, new GregorianCalendar());
  
  let times = timeStr.split(':')
  const hour = parseInt(times[0], 10)
  const minute = parseInt(times[1], 10)
  
  const fullDate = new CalendarDateTime(grDate.year, grDate.month, grDate.day, hour, minute);
  return fullDate.toString(); 
}

const {updateItem, createItem} = useAdmin()

async function onSubmit() {
  const payload = {
    code: state.code.toUpperCase(),
    title: state.title,
    discount: state.discount,
    status: state.status,
    expire_date: state.expiresAt,
    free_shipping: state.freeShipping,
    is_global: state.isGlobal
  }

  let response = null
  if (props.edit) {
    response = await updateItem('promos', props.code.id, payload)  
  }else{
    response = await createItem('promos', payload)
  }
  
  if (response.success) {
    toast.add({ title: 'افزودن / ویرایش تخفیف', description: 'افزودن / ویرایش تخفیف با موفقیت انجام شد.', color: 'success',onClose: () => window.location.reload() })
  }else{
    toast.add({ title: 'خطا', description: 'افزودن / ویرایش تخفیف با خطا مواجه شد.', color: 'error' })
  }
}

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 grid grid-cols-2 space-x-3 my-10" @submit="onSubmit">
    <UFormField size="xl" class="col-span-2 md:col-span-1" label="عنوان" name="title">
      <UInput v-model="state.title" class="w-full" placeholder="عنوان تخفیف"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="کد تخفیف" name="code">
      <UInput v-model="state.code" class="w-full" placeholder="کد تخفیف با حروف بزرگ"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="درصد تخفیف" name="discount">
      <UInput v-model="state.discount" class="w-full" placeholder="0 تا 100"/>
    </UFormField>
    <UFormField size="xl" class=" col-span-2 md:col-span-1" label="وضعیت" name="status">
        <USelect style="direction:rtl" v-model="state.status" :items="status" class="w-full" />
    </UFormField>
    <UFormField size="xl" class=" col-span-1" name="freeShipping">
        <UCheckbox indicator="start" color="neutral" v-model="state.freeShipping" label="ارسال رایگان" />
    </UFormField>
    <UFormField size="xl" class=" col-span-2 mx-auto" label="تاریخ انقضا" name="expiresAt">
      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{ df.format(expireDate.toDate(getLocalTimeZone())) }} ، ساعت {{ time }}
        </UButton>
        
        <template #content>
          <UCalendar v-model="expireDate" class="p-2" />
          <div class="flex justify-center items-center space-x-3 my-3 cursor-pointer">
            <span>ساعت:</span>
                  <UInput v-maska="'##:##'" placeholder="23:59" v-model="time" class="w-1/2"/>
                </div>
              </template>
        </UPopover>
      </UFormField>

      <UFormField size="xl" class=" col-span-1" name="isGlobal">
          <UCheckbox indicator="start" color="neutral" v-model="state.isGlobal" label="کد عمومی" description="آیا این کد تخفیف برای همه قابل استفاده باشد؟" />
      </UFormField>
      
      
      <UButton size="xl" :class="['cursor-pointer text-center flex justify-center col-span-2', edit ? ' bg-blue-400 hover:bg-blue-500' : 'bg-indigo-400 hover:bg-indigo-500' ]" type="submit">
        {{ edit ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید' }}
      </UButton>
  </UForm>
</template>

