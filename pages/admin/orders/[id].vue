<script setup>
    import orders from '@/api/orders.json'
    import { separatePrice } from 'price-seprator';

    const route = useRoute()

    const order = orders.orders.find(order => order.orderId === route.params.id) || []

    definePageMeta({
        layout: 'admin',
        middleware: 'auth-admin'
    })

    const pictures = [
    'https://picsum.photos/468/468?random=1',
    'https://picsum.photos/468/468?random=2',
    'https://picsum.photos/468/468?random=3',
    'https://picsum.photos/468/468?random=4',
    'https://picsum.photos/468/468?random=5',
    'https://picsum.photos/468/468?random=6'
    ]

    const trackingCode = ref('')

    useHead({
        title: `سفارش شماره ${order.orderId}`
    })
</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">سفارش {{order.orderId}}</h1>


    <div class=" space-y-3 p-2 mt-4 w-full shadow-md rounded-2xl text-sm mb-30">
        <div>
            <div class="p-2">
                <h3 class="text-right font-bold text-lg mb-6">اطلاعات سفارش</h3>
                <ul class=" space-y-2">
                    <li>کد سفارش: <span class="font-bold">{{order.orderId}}</span></li>
                    <li>تاریخ سفارش: <span class="font-bold">{{order.orderDate}}</span></li>
                    <li>وضعیت سفارش: <span :class="['font-bold rounded-md text-white p-1',order.status == 'delivered' ? ' bg-green-400' : 'bg-zinc-400']">{{order.status == 'delivered' ? 'ارسال شده' : 'در حال بررسی'}}</span></li>
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
                    <li>جمع کل خرید: <span class="font-bold">700,000 تومان</span></li>
                    <li>کد تخفیف اعمال شده: <span class="font-bold">SAVE20 (30,000 تومان)</span></li>
                    <li>مبلغ نهایی: <span class="font-bold">{{separatePrice(order.payment.totalAmount)}} تومان</span></li>
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
                <h3 class="text-right font-bold text-lg mb-6">توضیحات</h3>
                <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod, enim?</p>
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
                        <li>مدل: <span class="font-bold">ژوپینگ</span></li>
                        <li>رنگ: <span class="font-bold">طلایی</span></li>
                        <li>سایز: <span class="font-bold">20 سانت</span></li>
                        <li>تعداد: <span class="font-bold">{{item.quantity}}</span></li>
                        <li>قیمت کل: <span class="font-bold">{{separatePrice(item.price)}} تومان</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex justify-center space-x-3 my-5">
            <button class=" rounded-full bg-green-500 cursor-pointer p-3 text-white text-lg">ارسال سفارش</button>
            <button class=" rounded-full bg-red-500 cursor-pointer p-3 text-white text-lg">لغو سفارش </button>
        </div>
        <div class=" my-7 flex justify-center  items-center">
            <h6 class="text-lg mx-3">درج کد رهگیری: </h6>
            <UInput v-model="trackingCode" placeholder="کد رهگیری "  color="neutral"  size="xl"/>
            <button class=" rounded-l-full p-2.5 bg-blue-400 cursor-pointer text-white">اعمال</button>
        </div>
    </div>


</template>