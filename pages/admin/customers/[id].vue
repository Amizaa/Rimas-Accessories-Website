<script setup>
definePageMeta({
    layout:'admin'
})

import UsersData from '~/api/users.json'
import orders from '@/api/orders.json'
import { separatePrice } from 'price-seprator';

const route = useRoute()
const id = route.params.id

const user = UsersData.find((user) => {
    return user.id == id
})

const items = [
'https://picsum.photos/468/468?random=1',
'https://picsum.photos/468/468?random=2',
'https://picsum.photos/468/468?random=3',
'https://picsum.photos/468/468?random=4',
'https://picsum.photos/468/468?random=5',
'https://picsum.photos/468/468?random=6'
]

useHead({
    title: `مشتری ${user.id}`
})
</script>

<template>
    <div>
        <h1 class="text-3xl text-center font-azarmehrbold my-6 underline underline-offset-16">کاربر {{id}}</h1>

        <h3 class="text-xl font-azarmehrbold mt-10">اطلاعات فردی</h3>
        <div class="grid grid-cols-3 my-5 p-3 shadow rounded-2xl bg-zinc-50 space-y-5">
            <div class=" col-span-3 md:col-span-1">
                <span class=" text-xl">نام: <span class=" font-bold">{{user.firstName}}</span></span>
            </div>
            <div class=" col-span-3 md:col-span-1">
                <span class=" text-xl">نام خانوادگی: <span class=" font-bold">{{user.lastName}}</span></span>
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
                <span class=" text-xl">نام گیرنده: <span class=" font-bold">{{address.receiverName}}</span></span>
                <span class=" text-xl">شماره همراه گیرنده: <span class=" font-bold">{{address.receiverPhone}}</span></span>
                <span class=" text-xl">استان: <span class=" font-bold">{{address.province}}</span></span>
                <span class=" text-xl">شهر: <span class=" font-bold">{{address.city}}</span></span>
                <span class=" text-xl">آدرس: <span class=" font-bold">{{address.address}}</span></span>
                <span class=" text-xl">کد پستی: <span class=" font-bold">{{address.postcode}}</span></span>
            </div>
        </div>
    </div>


    <h3 class="text-xl font-azarmehrbold mt-10">سفارش های ثبت شده</h3>
    <div class="rounded-2xl flex flex-col my-4">
        <div v-for="order in orders.orders" :key="order.orderId" :class="['rounded-2xl my-4 shadow',order.status == 'processing' ? ' bg-zinc-50' : 'bg-green-200' ]">
            <h1 class="text-lg text-center mt-4 font-azarmehrbold">سفارش {{order.orderId}}</h1>
            <div class=" space-y-3 p-2 mt-4 w-full rounded-2xl text-sm">
                <div>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">اطلاعات سفارش</h3>
                        <ul class=" space-y-2">
                            <li>کد سفارش: <span class="font-bold">{{order.orderId}}</span></li>
                            <li>تاریخ سفارش: <span class="font-bold">{{order.orderDate}}</span></li>
                            <li>وضعیت سفارش: <span class="font-bold">{{order.status == 'delivered' ? 'ارسال شده' : 'در حال بررسی'}}</span></li>
                        </ul>
                    </div>
                    <USeparator class="mt-4 mb-6"/>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">اطلاعات گیرنده</h3>
                        <ul class=" space-y-2">
                            <li>نام و نام خانوادگی گیرنده: <span class="font-bold">{{order.shipping.recieverName}}</span></li>
                            <li>شماره همراه گیرنده: <span class="font-bold">{{order.shipping.recieverPhone}}</span></li>
                            <li>آدرس گیرنده: <span class="font-bold">{{order.shipping.province}}، {{order.shipping.city}}، {{order.shipping.address}}</span></li>
                            <li>کد پستی آدرس: <span class="font-bold">{{order.shipping.postCode}}</span></li>
                        </ul>
                    </div>
                    <USeparator class="mt-4 mb-6"/>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">اطلاعات پرداخت</h3>
                        <ul class=" space-y-2">
                            <li>جمع کل خرید: <span class="font-bold">{{separatePrice(order.payment.totalAmount)}} تومان</span></li>
                        </ul>
                    </div>
                    <USeparator class="mt-4 mb-6"/>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">اطلاعات ارسال</h3>
                        <ul class=" space-y-2">
                            <li>ارسال از طریق: <span class="font-bold">{{order.shipping.shippingMethod}}</span></li>
                            <li>کد رهگیری: <span class="font-bold">{{order.shipping.trackingCode}}</span></li>
                        </ul>
                    </div>
                    <USeparator class="mt-4 mb-6"/>
                    <div class="p-2">
                        <h3 class="text-right font-bold text-lg mb-6">محصولات سفارش داده شده</h3>
                        <div class=" w-full flex gap-3 overflow-hidden items-center justify-start relative mb-2 border p-3 rounded-2xl"  v-for="item in order.items" :key="item.productId">
                            <div class="relative w-20 h-20 flex-shrink-0">
                                <img class="absolute rounded-md left-0 top-0 w-full h-full object-cover object-center transition duration-50" src="/assets/images/blog/bracelet.png">
                            </div>
                            <ul>
                                <li>کد محصول: <span class="font-bold">{{item.productId}}</span></li>
                                <li>نام محصول: <span class="font-bold">{{item.name}}</span></li>
                                <li>دسته بندی: <span class="font-bold">{{item.category}}</span></li>
                                <li>تعداد: <span class="font-bold">{{item.quantity}}</span></li>
                                <li>قیمت کل: <span class="font-bold">{{separatePrice(item.price)}} تومان</span></li>
                            </ul>
                        </div>
                    </div>
        
                </div>
            </div>
        </div>
    </div>

</template>