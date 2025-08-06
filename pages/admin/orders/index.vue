<script setup lang="ts">
import orders from '~/api/orders2.json'
definePageMeta({
    layout:'admin'
})

const processingOrders = orders
  .flatMap(user => user.orders.map(order => ({ ...order, userId: user.userId })))
  .filter(order => order.status === "processing");

const deliveredOrders = orders
  .flatMap(user => user.orders.map(order => ({ ...order, userId: user.userId })))
  .filter(order => order.status === "delivered");

</script>



<template>
  <AdminOrdersTable :data="processingOrders" title="سفارش های جدید"/>

  <AdminOrdersTable :data="deliveredOrders" title="سفارش های ارسال شده"/>
</template>
