<script setup>
    import { useClipboard } from '@vueuse/core'

    definePageMeta({
        layout: 'account'
    })

    useHead({
        title: 'کد های تخفیف من'
    })

    const { copy } = useClipboard()
    const toast = useToast()

    const copyCode = (code) =>{
        copy(code)
        
        toast.add({
        title: 'کد تخفیف کپی شد',
        color: 'success'
        })
    }

    const {fetchPromoCodes} = usePromo()
    const promoCodes = ref()
    promoCodes.value = await fetchPromoCodes()

    const calculateRemainingTime = (time) => {
        const target = new Date(time); // future date
        const now = new Date();
    
        const diffMs = target - now; // difference in milliseconds
    
        if (diffMs > 0) {
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            return diffDays
        } else {
            return 0
        }

    }

</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">کد های تخفیف من</h1>

    <div class=" p-2 mt-4 space-y-4">
        <template  v-for="(code, index) in promoCodes" :key="index">
            <div class="flex justify-between items-center w-full shadow rounded-2xl p-3 bg-green-200">
                <h1 class=" md:text-lg text-sm">
                    {{code.promo.title}}
                    ({{ code.promo.discount ? `${code.promo.discount} درصد` : 'ارسال رایگان' }})
                </h1>
                <p class=" md:text-lg text-sm">
                    <span>مدت اعتبار : </span>
                    <span class=" font-bold"> {{ calculateRemainingTime(code.promo.expire_date) }} روز</span>
                </p>
                <code @click="copyCode(code.promo.code)" class="text-2xl cursor-pointer">{{code.promo.code}}</code>
            </div>
        </template>
    </div>


</template>