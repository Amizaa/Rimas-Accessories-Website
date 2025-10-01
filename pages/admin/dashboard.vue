<script lang="ts" setup>
import { ShoppingCartIcon, TruckIcon, UserIcon } from '@heroicons/vue/20/solid';
import { separatePrice } from 'price-seprator';

definePageMeta({
  layout:'admin',
  middleware: 'auth-admin'
})

useHead({
    title: 'داشبورد'
})

const {fetchAll} = useAdmin()
const orders = ref()
const users = ref()
users.value = await fetchAll('users')
orders.value = await fetchAll('orders')

const { dailyData, weeklyData, monthlyData, yearlyData } = groupSales(orders.value) 


const items = ref([
    {
        label: 'سالانه',
        value: 'Year'
    },
    {
    label: 'ماهانه',
    value: 'Month'
    },
    {
    label: 'هفتگی',
    value: 'Week'
    },
    {
    label: 'روزانه',
    value: 'Day'
  }
])

const period = ref('Year')


const categories: Record<string, BulletLegendItemInterface> = {
  sales: { name: 'فروش', color: '#6366f1' }
}

// Dynamic chart data
const chartData = computed(() => {
  switch (period.value) {
    case 'Year':
      return yearlyData.map((d) => ({ x: d.year, sales: d.sales }))
    case 'Month':
      return monthlyData.map((d) => ({ x: d.month, sales: d.sales }))
    case 'Week':
      return weeklyData.map((d) => ({ x: d.week, sales: d.sales }))
    case 'Day':
      return dailyData.map((d) => ({ x: d.day, sales: d.sales }))
    default:
      return []
  }
})

const xFormatter = (i: number): string | number => chartData.value[i]?.x ?? ''

const DonutData = groupSalesByCategory(orders.value)

const newOrders = orders.value.filter(order => order.status === 'pending')
const shippedOrders = orders.value.filter(order => order.status === 'shipped')

const newUsers = users.value.filter(user => {
  const userDate = new Date(user.signup_date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - userDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
})

</script>

<template>
  
  <div class="grid grid-cols-3 gap-3">
    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">کاربران جدید</h1>
        <span class="text-5xl text-indigo-500 font-bold w-full">{{newUsers.length}}</span>
      </div>
      <div class="w-1/3 max-w-30 flex items-center">
        <UserIcon class="fill-indigo-500" />
      </div>
    </div>
    
    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">سفارش های جدید</h1>
        <span class="text-5xl text-green-500 font-bold w-full">{{newOrders.length}}</span>
      </div>
      <div class="w-1/3 max-w-25 flex items-center">
        <ShoppingCartIcon class="fill-green-500" />
      </div>
    </div>
    
    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">سفارش های ارسال شده</h1>
        <span class="text-5xl text-amber-500 font-bold w-full">{{shippedOrders.length}}</span>
      </div>
      <div class="w-1/3 max-w-25 flex items-center">
        <TruckIcon class="fill-amber-500" />
      </div>
    </div>
  </div>
  
  
  <div>
    <span>بازه زمانی: </span>
    <USelect
      style="direction:rtl"
      size="xl"
      v-model="period"
      :items="items"
      class="w-48 my-4"
    />
  </div>
  <div class="my-10">
    <h1 class="text-center font-azarmehrbold text-4xl mb-4">روند فروش</h1>
    <LineChart class="chartt"
      :data="chartData"
      :categories="categories"
      x-label="زمان"
      y-label="میزان فروش"
      :height="420"
      :curve-type="CurveType.MonotoneX"
      :hide-tooltip="false"
      :hide-legend="true"
      :x-num-ticks="6"
      :y-num-ticks="5"
      :min-max-ticks-only="false"
      :x-grid-line="false"
      :y-grid-line="true"
      :x-domain-line="true"
      :y-domain-line="true"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-formatter="xFormatter"
    >
        <template #tooltip="{ values }">
            <h6 class="text-center">{{ values?.x }}</h6>
            <span><span class=" font-bold">فروش: </span>{{separatePrice(values?.sales) }} تومان</span>
        </template>
    </LineChart>
  </div>

  <div class="my-10">
    <h1 class="text-center font-azarmehrbold text-4xl mb-6">سهم هر دسته بندی در فروش</h1>
    <DonutChart
        :data="DonutData.map((i) => i.value)"
        :height="275"
        :labels="DonutData"
        :hide-legend="false"
        :radius="120"
    >
        <div class="absolute text-center">
        <div class="font-semibold">دسته بندی ها</div>
        </div>
    </DonutChart>
  </div>
</template>

<style>
:root{
    --vis-axis-font-family: AzarMehrBold !important;
    --vis-font-family: AzarMehrBold !important
}

</style>




