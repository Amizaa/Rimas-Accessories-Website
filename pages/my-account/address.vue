<script setup>
    definePageMeta({
        layout: 'account'
    })

    useHead({
        title: 'آدرس های من'
    })

  const receivers = [
    {
      "receiverName": "حامد رحیمی",
      "receiverPhone": "09123456789",
      "address": "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      "province": "تهران",
      "city": "تهران",
      "postCode": "1234567890"
    },
    {
      "receiverName": "سارا محمدی",
      "receiverPhone": "09987654321",
      "address": "اصفهان، خیابان چهارباغ، پلاک ۴۵",
      "province": "اصفهان",
      "city": "اصفهان",
      "postCode": "9876543210"
    }
  ]

</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">آدرس های من</h1>

    <AccountAddressEdit :receivers="receivers" />

    <AccountAddressForm />

</template>