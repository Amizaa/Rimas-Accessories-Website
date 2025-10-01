<script setup lang="ts">
definePageMeta({
    layout:'admin',
    middleware: 'auth-admin'
})

useHead({
    title: 'سفارش ها'
})

const {fetchAll} = useAdmin()
const orders = ref()
orders.value = await fetchAll('orders')
console.log(orders.value);


const pendingOrders = orders.value
  .filter(order => order.status === "pending")
  .map(order => ({ ...order, userId: order.address.user }));

const shippedOrders = orders.value
  .filter(order => order.status === "shipped" || order.status === "canceled")
  .map(order => ({ ...order, userId: order.address.user }));



</script>



<template>
  <AdminOrdersTable :data="pendingOrders" title="سفارش های جدید"/>

  <AdminOrdersTable :data="shippedOrders" title="سفارش های ارسال یا لغو شده"/>
</template>
