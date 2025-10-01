<script setup>
    import { separatePrice } from 'price-seprator';
    
    definePageMeta({
        layout: 'admin',
        middleware: 'auth-admin'
    })

    const route = useRoute()

    const {fetchOrderById, updateItem} = useAdmin()
    const order = ref()
    order.value = await fetchOrderById(route.params.id)

    const trackingCode = ref('')

    useHead({
        title: `سفارش شماره ${order.value.id}`
    })

    const trackingError = ref(false)

    const toast = useToast()

    const sendOrder = async () => {
        if (!trackingCode.value || trackingCode.value == '') {
            trackingError.value = true
            return
        }
        trackingError.value = false
        await updateItem('orders',order.value.id, {
            status: 'shipped',
            tracking_code: trackingCode.value,
            shipped_date: new Date().toISOString()
        })
        order.value.status = 'shipped'
        order.value.tracking_code = trackingCode.value
        order.value.shipped_date = new Date().toISOString()
        toast.add({ title: 'وضعیت سفارش', description: 'سفارش با موفقیت ارسال شد', color: 'success' })

    }

    const cancelOrder = async () => {
        const response = await updateItem('orders',order.value.id, {
            status: 'canceled',
            tracking_code: null
        })
        if (response.success) {
            order.value.status = 'canceled'
            order.value.tracking_code = null
            toast.add({ title: 'وضعیت سفارش', description: 'سفارش با موفقیت لغو شد', color: 'success' })
            console.log(response.data);
        }else{
            toast.add({ title: 'خطا', description: response.error, color: 'error' })
        }
    }
</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">سفارش {{order.id}}</h1>


    <div class=" space-y-3 p-2 mt-4 w-full shadow-md rounded-2xl text-sm mb-30">
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
                                'font-bold rounded-md text-white p-1',
                                order.status === 'shipped'
                                    ? 'bg-green-400'
                                    : order.status === 'canceled'
                                        ? 'bg-red-400'
                                        : 'bg-zinc-400'
                            ]"
                        >
                            {{
                                order.status === 'shipped'
                                    ? 'ارسال شده'
                                    : order.status === 'canceled'
                                        ? 'لغو شده'
                                        : 'در حال بررسی'
                            }}
                        </span>
                    </li>
                </ul>
            </div>
            <USeparator class="mt-4 mb-6"/>
            <div class="p-2">
                <h3 class="text-right font-bold text-lg mb-6">اطلاعات مشتری</h3>
                <ul class=" space-y-2">
                    <li>نام و نام خانوادگی: <span class="font-bold">{{order.user.first_name}} {{order.user.last_name}}</span></li>
                    <li>ایمیل: <span class="font-bold">{{order.user.email}}</span></li>
                    <li>شماره تماس: <span class="font-bold">{{order.user.phone}}</span></li>
                </ul>
            </div>
            <USeparator class="mt-4 mb-6"/>
            <div class="p-2">
                <h3 class="text-right font-bold text-lg mb-6">اطلاعات آدرس</h3>
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
                    <li>مبلغ نهایی: <span class="font-bold">{{separatePrice(parseInt(order.total_amount))}} تومان</span></li>
                </ul>
            </div>
            <USeparator class="mt-4 mb-6"/>
            <div class="p-2">
                <h3 class="text-right font-bold text-lg mb-6">اطلاعات ارسال</h3>
                <ul class=" space-y-2">
                    <li>ارسال از طریق: <span class="font-bold">{{order.shipping_method}}</span></li>
                    <li v-if="order.status == 'shipped'">تاریخ ارسال: <span class="font-bold">{{formatPersianDate(order.shipped_date)}}</span></li>
                    <li  v-if="order.status == 'shipped'">کد رهگیری: <span class="font-bold">{{order.tracking_code}}</span></li>
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
                <div  v-for="item in order.items" :key="item.id" class=" w-full flex gap-3 overflow-hidden items-center justify-start relative mb-2 border p-3 rounded-2xl">
                    <div class="relative w-20 h-20 flex-shrink-0">
                        <img class="absolute rounded-md left-0 top-0 w-full h-full object-cover object-center transition duration-50" :src="item.product.images[0].url" :alt="item.product.title"/>
                    </div>
                    <ul>
                        <li>کد محصول: <span class="font-bold">{{item.product.id}}</span></li>
                        <li>نام محصول: <span class="font-bold">{{item.product.title}}</span></li>
                        <li>دسته بندی: <span class="font-bold">{{item.product.category.name}}</span></li>
                        <li>مدل: <span class="font-bold">{{item.variant.title}}</span></li>
                        <li>تعداد: <span class="font-bold">{{item.quantity}}</span></li>
                        <li>قیمت کل: <span class="font-bold">{{separatePrice(parseInt(item.variant.price))}} تومان</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="order.status === 'pending'" class="flex justify-center space-x-3 my-5">
            <button @click="sendOrder()" class=" rounded-full bg-green-500 cursor-pointer p-3 text-white text-lg">ارسال سفارش</button>
            <button @click="cancelOrder()" class=" rounded-full bg-red-500 cursor-pointer p-3 text-white text-lg">لغو سفارش </button>
        </div>
        <div v-if="order.status === 'pending'" class="flex justify-center  items-center">
            <h6 class="text-lg mx-3">درج کد رهگیری: </h6>
            <UInput v-model="trackingCode" placeholder="کد رهگیری "  color="neutral"  size="xl"/>
            <p v-if="trackingError" class="text-red-500 mx-2">لطفا کد رهگیری را وارد کنید</p>
        </div>
    </div>


</template>