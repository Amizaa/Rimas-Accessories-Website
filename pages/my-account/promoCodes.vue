<script setup>
    import { useClipboard } from '@vueuse/core'
    import promoCodes from '@/api/promoCodes.json'

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

</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">کد های تخفیف من</h1>

    <div class=" p-2 mt-4 space-y-4">
        <template  v-for="[code, details] in Object.entries(promoCodes[0])" :key="code">
            <div v-if="details.status == 'active'" class="flex justify-between items-center w-full shadow rounded-2xl p-3 bg-green-200">
                <h1 class=" md:text-lg text-sm">
                    {{details.title}}
                    ({{ details.discount ? `${details.discount} درصد` : 'ارسال رایگان' }})
                </h1>
                <code @click="copyCode(code)" class="text-2xl cursor-pointer">{{code}}</code>
            </div>
        </template>
    </div>


</template>