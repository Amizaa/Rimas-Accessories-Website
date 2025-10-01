<script setup>
import UserIcon from '@/assets/images/user.png'

definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

//https://ui.nuxt.com/components/command-palette#with-ignore-filter

const {fetchAll} = useAdmin()
const userData = ref()
userData.value = await fetchAll('users')

const users = userData.value.map(user => ({
  label: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : ' ',
  suffix: user.phone,
  to: `/admin/customers/${user.id}`,
  avatar: {
    src: UserIcon
  }
}))



const searchTerm = ref('')

function onSelect() {
  searchTerm.value = ''
}

useHead({
    title: 'مشتری ها'
})

</script>

<template>
    <div>
        <h1 class=" text-center font-azarmehrbold text-4xl my-5">کاربران ثبت نام کرده</h1>
        <UCommandPalette
          v-model:search-term="searchTerm"
          :groups="[{ id: 'users', items: users }]"
          class="flex-1"
          @update:model-value="onSelect"
          placeholder="جست و جوی کاربران"
          style="direction: rtl;"
          :ui="{item:' text-xl', itemLeadingAvatarSize:'xl'}"
        />
    </div>
</template>

