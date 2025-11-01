<script setup>
definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

const route = useRoute()
const id = route.params.id

const {fetchById, fetchUserOrders, fetchUserPromos, createItem, deleteItem, fetchAll} = useAdmin()
const user = ref()
const userOrders = ref()
const promos = ref()
const userPromos = ref()
user.value = await fetchById('users',id)
userOrders.value = await fetchUserOrders(user.value.id)
userPromos.value = await fetchUserPromos(user.value.id)
promos.value = await fetchAll('promos')

const unlinkedPrivatePromos = promos.value.filter((promo) => {
  if (!promo.is_global && promo.status === 'active') {
    const alreadyLinked = userPromos.value.some((link) => link.promo.id === promo.id)
    return !alreadyLinked
  }
  return false
})

const items = unlinkedPrivatePromos.map(promo => ({
    value: promo.id,
    label: `${promo.title} - ${promo.free_shipping ? 'ارسال رایگان' : `${promo.discount} درصد`}`
}))



const showPromoModal = ref(false)
const selectedCode = ref(null)
const notSelectedCode = ref(false)

const toast = useToast()

const addUserPromo = async () => {
  if (!selectedCode.value) {
    notSelectedCode.value = true
    return
  }
  notSelectedCode.value = false

  const payload = {
    user: user.value.id,
    promo_id: selectedCode.value.value
  }

  const response = await createItem('promo-users',payload)

  if (response.success) {
    toast.add({ title: 'اختصاص کد تخفیف', description: 'کد تخفیف با موفقیت به کاربر اختصاص داده شد.', color: 'success', onClose: () => window.location.reload()})
  }else{
    toast.add({ title: 'خطا', description: 'اختصاص کد تخفیف با خطا مواجه شد.', color: 'error' })
  }
}

const removeCode = async(id) =>{

  const response = await deleteItem('promo-users',id)

  if (response.success) {
    toast.add({ title: 'حذف کد تخفیف', description: 'کد تخفیف با موفقیت از لیست کاربر حذف شد', color: 'success', onClose: () => window.location.reload()})
  }else{
    toast.add({ title: 'خطا', description: 'حذف کد تخفیف با خطا مواجه شد.', color: 'error' })
  }

}

useHead({
    title: `مشتری ${user.value.id}`
})
</script>

<template>

    <h1 class="text-3xl text-center font-azarmehrbold my-6 underline underline-offset-16">کاربر {{id}}</h1>

    <h3 class="text-xl font-azarmehrbold mt-10">اطلاعات فردی</h3>
    <div class="grid grid-cols-3 my-5 p-3 shadow rounded-2xl bg-zinc-50 space-y-5">
        <div class=" col-span-3 md:col-span-1">
            <span class=" text-xl">نام: <span class=" font-bold">{{user.first_name}}</span></span>
        </div>
        <div class=" col-span-3 md:col-span-1">
            <span class=" text-xl">نام خانوادگی: <span class=" font-bold">{{user.last_name}}</span></span>
        </div>
        <div class=" col-span-3 md:col-span-1">
            <span class=" text-xl">شماره همراه: <span class=" font-bold">{{user.phone}}</span></span>
        </div>
        <div class=" col-span-3 md:col-span-1">
            <span class=" text-xl">ایمیل: <span class=" font-bold">{{user.email}}</span></span>
        </div>
    </div>

    
    <h3 class="text-xl font-azarmehrbold mt-10">اطلاعات آدرس</h3>
    <div class="grid grid-cols-3 my-5 p-3 shadow rounded-2xl bg-zinc-50 space-y-5 gap-3">
        <div v-for="(address,index) in user.addresses" :key="index" class=" col-span-3 md:col-span-1 flex flex-col space-y-3 bg-zinc-200 p-2 rounded-2xl">
            <span>نام گیرنده: <span class=" font-bold">{{address.receiver_name}}</span></span>
            <span>شماره همراه گیرنده: <span class=" font-bold">{{address.receiver_phone}}</span></span>
            <span>استان: <span class=" font-bold">{{address.province}}</span></span>
            <span>شهر: <span class=" font-bold">{{address.city}}</span></span>
            <span>آدرس: <span class=" font-bold">{{address.address_detail}}</span></span>
            <span>کد پستی: <span class=" font-bold">{{address.postal_code}}</span></span>
        </div>
        <div v-if="user.addresses?.length === 0" class=" col-span-3 text-center text-gray-500">این کاربر آدرس ثبت شده ای ندارد.</div>

    </div>
    
    <h3 class="text-xl font-azarmehrbold mt-10">کد های تخفیف</h3>
    <div class="grid grid-cols-3 my-5 p-3 shadow rounded-2xl bg-zinc-50 space-y-5 gap-3">
        <div
        v-for="(code, index) in userPromos"
        :key="index"
        :class="[
            'col-span-3 md:col-span-1 flex flex-col space-y-3 p-2 rounded-2xl',
            code.promo.status === 'active' ? 'bg-green-400' :
            code.promo.status === 'disabled' ? 'bg-yellow-400' :
            code.promo.status === 'expired' ? 'bg-red-400' : '',
            code.used ? 'opacity-50' : 'opacity-100'
        ]"
        >
            <span >کد تخفیف: <span class=" font-bold">{{code.promo.code}} ( {{code.promo.title}} )</span></span>
            <span >درصد تخفیف: <span class=" font-bold">{{code.promo.discount}}%</span></span>
            <span >تاریخ انقضا: <span class=" font-bold">{{formatPersianDate(code.promo.expire_date)}}</span></span>
            <span >وضعیت: <span class=" font-bold">{{code.promo.status === 'active' ? 'فعال' : code.promo.status === 'disabled' ? 'غیر فعال' : 'منقضی شده'}} - {{code.used ? 'استفاده شده' : 'استفاده نشده'}}</span></span>
            <button @click="removeCode(code.id)" v-if="code.promo.status == 'active' && !code.used" class=" rounded-full text-white cursor-pointer bg-red-800 hover:bg-red-900 p-2">حذف کد تخفیف از لیست کاربر</button>
        </div>
        <div v-if="userPromos?.length === 0" class=" col-span-3 text-center text-gray-500">این کاربر کد تخفیف اختصاصی ندارد.</div>
        <div class="flex justify-center my-2 col-span-3">
            <button class=" px-2 py-1 text-white rounded-full bg-indigo-400 hover:bg-indigo-500 cursor-pointer" @click="showPromoModal = true">اختصاص کد تخفیف جدید به کاربر</button>
        </div>
    </div>


    <h3 class="text-xl font-azarmehrbold mt-10">سفارش های ثبت شده</h3>
    <div class="grid grid-cols-3 my-5 p-3 shadow rounded-2xl bg-zinc-50 space-y-5 gap-3" >
        <div v-for="order in userOrders" :key="order.id" class="rounded-2xl my-4 shadow-2xl">
            <h1 class="text-lg text-center mt-4 font-azarmehrbold">سفارش {{order.id}}</h1>
            <div class=" space-y-3 p-2 mt-4 w-full rounded-2xl text-sm">
                <div>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">اطلاعات سفارش</h3>
                        <ul class=" space-y-2">
                            <li>کد سفارش: <span class="font-bold">{{order.id}}</span></li>
                            <li>تاریخ سفارش: <span class="font-bold">{{formatPersianDate(order.order_date)}}</span></li>
                            <li>وضعیت سفارش: <span :class="['font-bold rounded-md text-white px-1',
                                order.status == 'shipped'
                                ? 'bg-green-400'
                                : order.status == 'canceled'
                                ? 'bg-red-400'
                                : 'bg-zinc-400'
                                ]">{{order.status == 'shipped'? 'ارسال شده': order.status == 'canceled'? 'لغو شده': 'در حال بررسی'}}</span></li>
                            <li class="flex justify-center mt-3 text-white bg-indigo-300 hover:bg-indigo-400 cursor-pointer p-1 rounded-2xl"><button class="" @click="navigateTo(`/admin/orders/${order.id}`)">مشاهده جزئیات بیشتر</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="userOrders?.length === 0" class=" col-span-3 text-center text-gray-500">این کاربر سفارشی ثبت نکرده است.</div>
    </div>

    
  <UModal
      v-model:open="showPromoModal"
      title="اختصاص کد تخفیف به کاربر"
      :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
      :ui="{ footer: 'justify-center', content: 'divide-none font-azarmehr max-w-md', header: 'justify-center' }"
    >
      <template #body>
        <div class="flex flex-col justify-center w-full">
            <p class="mb-2 font-semibold">انتخاب کد : </p>
            <USelectMenu v-model="selectedCode" :items="items" class=" w-full"/>
            <p v-if="notSelectedCode" class=" text-red-400 mt-2">باید یک کد را انتخاب کنید</p>
        </div>
      </template>
      <template #footer>
        <UButton color="success" @click="addUserPromo">اختصاص</UButton>
        <UButton variant="error" @click="showPromoModal = false">انصراف</UButton>
      </template>
  </UModal>

</template>