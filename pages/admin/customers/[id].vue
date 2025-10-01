<script setup>
definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

const route = useRoute()
const id = route.params.id

const {fetchById, fetchUserOrders} = useAdmin()
const user = ref()
const userOrders = ref()
user.value = await fetchById('users',id)
userOrders.value = await fetchUserOrders(user.value.id)


useHead({
    title: `مشتری ${user.value.id}`
})
</script>

<template>
    <div>
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
                <span class=" text-xl">نام گیرنده: <span class=" font-bold">{{address.receiver_name}}</span></span>
                <span class=" text-xl">شماره همراه گیرنده: <span class=" font-bold">{{address.receiver_phone}}</span></span>
                <span class=" text-xl">استان: <span class=" font-bold">{{address.province}}</span></span>
                <span class=" text-xl">شهر: <span class=" font-bold">{{address.city}}</span></span>
                <span class=" text-xl">آدرس: <span class=" font-bold">{{address.address_detail}}</span></span>
                <span class=" text-xl">کد پستی: <span class=" font-bold">{{address.postal_code}}</span></span>
            </div>
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
    </div>

</template>