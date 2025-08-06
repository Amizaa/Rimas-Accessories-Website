<script setup>
import UserIcon from '@/assets/images/user.png'
import UsersData from '~/api/users.json'

definePageMeta({
    layout:'admin'
})

//https://ui.nuxt.com/components/command-palette#with-ignore-filter
const users = UsersData.map(user => ({
  label: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ' ',
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

