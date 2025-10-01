<script setup>
    import { separatePrice } from 'price-seprator';

    definePageMeta({
        layout: 'account',
        middleware: 'auth',
    })

    useHead({
        title: 'سفارش های من'
    })

    const {fetchOrders} = useOrder()
    const orders = ref()
    orders.value = await fetchOrders()

</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">سفارش های من</h1>

    <div class=" space-y-3 p-2 mt-4">
        <div v-if="orders.length === 0" class="flex justify-center md:text-3xl mt-6">
            <h1 class=" text-center font-azarmehrbold text-indigo-500">سفارشی برای شما ثبت نشده است</h1>
        </div>

        <div v-else class="w-full p-2 m-3 shadow-md rounded-2xl" v-for="order in orders" :key="order.id">
            <div class="flex justify-between p-2">
                <h3 class="text-right font-bold"><span class=" text-zinc-400 font-normal text-sm">شماره سفارش: </span>{{order.id}}</h3>
                <h3>{{ formatPersianDate(order.order_date) }}</h3>
            </div>
            <USeparator class="mt-4 mb-6"/>
            <div class="my-3  space-y-2">
                <h4>آدرس ارسال شده:</h4>
                <p class=" text-sm">{{order.address.province}}، {{order.address.city}}، {{order.address.address_detail}}</p>
            </div>
            <div class="my-3 space-y-2">
                <h4>جمع کل خرید:</h4>
                <p class=" text-sm">{{separatePrice(order.total_amount)}} تومان</p>
            </div>
            <div class="my-3  space-y-2">
                <h4>محصولات سفارش داده شده:</h4>
                <UCarousel style="direction:ltr" v-slot="{ item }" :items="order.items" :ui="{ item: 'basis-1/3' }">
                    <img :src="item.product.images[0].url" width="234" height="234" class="rounded-lg mx-auto">
                    <p class=" text-center mt-2">{{item.product.title}} - {{item.variant.title}}</p>
                </UCarousel>
            </div>
            <div class="my-3 space-y-2">
                <h4>وضعیت سفارش:</h4>
                <span  :class="['font-bold text-sm rounded-md text-white px-1',order.status == 'shipped'? 'bg-green-400': order.status == 'canceled'? 'bg-red-400': 'bg-zinc-400']">
                    {{
                        order.status === 'pending'
                            ? 'در حال بررسی'
                            : order.status === 'shipped'
                                ? 'ارسال شده '
                                : 'لغو شده'
                    }}
                </span>
            </div>
            <div class="mt-8 mb-3 space-y-2 flex justify-center">
                <button @click="navigateTo(`/my-account/orders/${order.id}`)" class=" text-white p-2 rounded-full cursor-pointer bg-indigo-400 hover:bg-indigo-500 transition-all">مشاهده جزئیات بیشتر</button>
            </div>


            
        </div>
    </div>


</template>