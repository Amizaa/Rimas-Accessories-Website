<script setup>
    import { separatePrice } from 'price-seprator';
    const route = useRoute()
    
    definePageMeta({
        layout: 'account'
    })
    
    useHead({
        title: `سفارش شماره ${route.params.id}`
    })


    const {fetchOrderById} = useOrder()
    const order = ref(null)
    const loading = ref(true)

    onMounted(async () => {
    order.value = await fetchOrderById(route.params.id)
    loading.value = false
    })

    const formatPersianDate = (date) => {
        const newDate = new Date(date)
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(newDate)
    }

</script>

<template>
    <div v-if="loading" class="text-center mt-10 text-lg text-gray-500">
        در حال بارگذاری اطلاعات سفارش...
    </div>

    <div v-else-if="order">
        
        <h1 class="text-2xl text-center mt-4 font-azarmehrbold">سفارش {{order.id}}</h1>
    
        <div class=" space-y-3 p-2 mt-4 w-full shadow-md rounded-2xl text-sm">
            <div>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">اطلاعات سفارش</h3>
                    <ul class=" space-y-2">
                        <li>کد سفارش: <span class="font-bold">{{order.id}}</span></li>
                        <li>تاریخ سفارش: <span class="font-bold">{{formatPersianDate(order.order_date)}}</span></li>
                        <li>
                            وضعیت سفارش:
                            <span
                                :class="[
                                    'font-bold rounded-md text-white px-1',
                                    order.status == 'shipped'
                                        ? 'bg-green-400'
                                        : order.status == 'canceled'
                                            ? 'bg-red-400'
                                            : 'bg-zinc-400'
                                ]"
                            >
                                {{
                                    order.status == 'shipped'
                                        ? 'ارسال شده'
                                        : order.status == 'canceled'
                                            ? 'لغو شده'
                                            : 'در حال بررسی'
                                }}
                            </span>
                        </li>
                    </ul>
                </div>
                <USeparator class="mt-4 mb-6"/>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">اطلاعات گیرنده</h3>
                    <ul class=" space-y-2">
                        <li>نام و نام خانوادگی گیرنده: <span class="font-bold">{{order.address.receiver_name}}</span></li>
                        <li>شماره همراه گیرنده: <span class="font-bold">{{order.address.receiver_phone}}</span></li>
                        <li>آدرس گیرنده: <span class="font-bold">{{order.address.province}}، {{order.address.city}}، {{order.address.address_detail}}</span></li>
                        <li>کد پستی آدرس: <span class="font-bold">{{order.address.postal_code}}</span></li>
                    </ul>
                </div>
                <USeparator class="mt-4 mb-6"/>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">اطلاعات پرداخت</h3>
                    <ul class=" space-y-2">
                        <li>جمع کل خرید: <span class="font-bold">{{separatePrice(order.total_amount)}} تومان</span></li>
                    </ul>
                </div>
                <USeparator class="mt-4 mb-6"/>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">اطلاعات ارسال</h3>
                    <ul class=" space-y-2">
                        <li>ارسال از طریق: <span class="font-bold">{{order.shipping_method}}</span></li>
                        <li>کد رهگیری: <span class="font-bold">{{order.tracking_code}}</span></li>
                    </ul>
                </div>
                <USeparator class="mt-4 mb-6"/>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">توضیحات</h3>
                    <p>{{order.description}}</p>
                </div>
                <USeparator class="mt-4 mb-6"/>
                <div class="p-2">
                    <h3 class="text-right font-bold text-lg mb-6">محصولات سفارش داده شده</h3>
                    <div class=" w-full flex gap-3 overflow-hidden items-center justify-start relative mb-2 border p-3 rounded-2xl"  v-for="item in order.items" :key="item.id">
                        <div class="relative w-20 h-20 flex-shrink-0">
                            <img class="absolute rounded-md left-0 top-0 w-full h-full object-cover object-center transition duration-50" :src="item.product.images[0].url" :alt="`${item.product.title} - ${item.variant.title}`">
                        </div>
                        <ul>
                            <li>کد محصول: <span class="font-bold">{{item.product.id}}</span></li>
                            <li>نام محصول: <span class="font-bold">{{item.product.title}}</span></li>
                            <li>دسته بندی: <span class="font-bold">{{item.product.category.name}}</span></li>
                            <li>مدل: <span class="font-bold">{{item.variant.title}}</span></li>
                            <li>تعداد: <span class="font-bold">{{item.quantity}}</span></li>
                            <li>قیمت واحد: <span class="font-bold">{{separatePrice(item.variant.price)}} تومان</span></li>
                            <li>جمع کل: <span class="font-bold">{{separatePrice(item.variant.price * item.quantity)}} تومان</span></li>
                        </ul>
                    </div>
                </div>
    
            </div>
        </div>
    </div>


</template>