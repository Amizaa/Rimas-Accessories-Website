<script setup>
    definePageMeta({
        layout: 'account',
        middleware: 'auth',
    })

    useHead({
        title: 'آدرس های من'
    })

    const {fetchAuthenticatedUser} = useUser()
    const user = ref() 
    user.value = await fetchAuthenticatedUser()



</script>

<template>
    <h1 class="text-2xl text-center mt-4 font-azarmehrbold">آدرس های من</h1>

    <AccountAddressEdit :addresses="user?.addresses ?? []" />
    <AccountAddressUserForm :user="user" />

</template>