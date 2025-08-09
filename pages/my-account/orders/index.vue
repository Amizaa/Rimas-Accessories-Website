<script setup>
    import orders from '@/api/orders.json'
    import { separatePrice } from 'price-seprator';

    definePageMeta({
        layout: 'account'
    })

    useHead({
        title: 'سفارش های من'
    })

    const items = [
    'https://picsum.photos/468/468?random=1',
    'https://picsum.photos/468/468?random=2',
    'https://picsum.photos/468/468?random=3',
    'https://picsum.photos/468/468?random=4',
    'https://picsum.photos/468/468?random=5',
    'https://picsum.photos/468/468?random=6'
    ]
</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">سفارش های من</h1>

    <div class=" space-y-3 p-2 mt-4">
        <div class="w-full p-2 m-3 shadow-md rounded-2xl" v-for="order in orders.orders" :key="order.orderId">
            <div class="flex justify-between p-2">
                <h3 class="text-right font-bold"><span class=" text-zinc-400 font-normal text-sm">شماره سفارش: </span>{{order.orderId}}</h3>
                <h3>{{order.orderDate}}</h3>
            </div>
            <USeparator class="mt-4 mb-6"/>
            <div class="my-3  space-y-2">
                <h4>آدرس ارسال شده:</h4>
                <p class=" text-sm">{{order.shipping.address}}</p>
            </div>
            <div class="my-3 space-y-2">
                <h4>جمع کل خرید:</h4>
                <p class=" text-sm">{{separatePrice(order.payment.totalAmount)}} تومان</p>
            </div>
            <div class="my-3  space-y-2">
                <h4>محصولات سفارش داده شده:</h4>
                <UCarousel style="direction:ltr" v-slot="{ item }" :items="items" :ui="{ item: 'basis-1/3' }">
                    <img :src="item" width="234" height="234" class="rounded-lg">
                </UCarousel>
            </div>
            <div class="mt-8 mb-3 space-y-2 flex justify-center">
                <button @click="navigateTo(`/my-account/orders/${order.orderId}`)" class=" text-white p-2 rounded-full cursor-pointer bg-indigo-400 hover:bg-indigo-500 transition-all">مشاهده جزئیات بیشتر</button>
            </div>


            
        </div>
    </div>


</template>