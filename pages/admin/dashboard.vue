<script lang="ts" setup>
import { ShoppingCartIcon, TruckIcon, UserIcon } from '@heroicons/vue/20/solid';
import { separatePrice } from 'price-seprator';


definePageMeta({
    layout:'admin'
})

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


const yearlyData = [
  { year: '2020', sales: 400, profit: 200 },
  { year: '2021', sales: 600, profit: 300 },
  { year: '2022', sales: 750, profit: 350 },
  { year: '2023', sales: 900, profit: 420 },
  { year: '2024', sales: 1100, profit: 500 },
  { year: '2025', sales: 950, profit: 470 }
]

const monthlyData = [
  { month: 'فروردین', sales: 100, profit: 50 },
  { month: 'اردیبهشت', sales: 120, profit: 55 },
  { month: 'خرداد', sales: 180, profit: 80 },
  { month: 'تیر', sales: 110, profit: 40 },
  { month: 'مرداد', sales: 90, profit: 30 },
  { month: 'شهریور', sales: 130, profit: 60 }
]

const weeklyData = [
  { week: 'هفته اول', sales: 40, profit: 20 },
  { week: 'هفته دوم', sales: 60, profit: 30 },
  { week: 'هفته سوم', sales: 50, profit: 25 },
  { week: 'هفته چهارم', sales: 70, profit: 35 }
]

const dailyData = [
  { day: '01 تیر', sales: 10, profit: 5 },
  { day: '02 تیر', sales: 15, profit: 7 },
  { day: '03 تیر', sales: 8, profit: 4 },
  { day: '04 تیر', sales: 12, profit: 6 },
  { day: '05 تیر', sales: 20, profit: 10 },
  { day: '06 تیر', sales: 18, profit: 9 },
  { day: '07 تیر', sales: 22, profit: 11 }
]

// Chart categories
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

const DonutData = [
  {
    color: '#3b82f6',
    name: 'گوشواره',
    value: 40,
  },
  {
    color: '#a855f7',
    name: 'دستبند',
    value: 20,
  },
  {
    color: '#22c55e',
    name: 'پابند',
    value: 10,
  },
  {
    color: '#ff0000',
    name: 'گردنبند',
    value: 30,
  },
]
</script>

<template>
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

  <div class="grid grid-cols-3 gap-3">
    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">کاربران جدید</h1>
        <span class="text-5xl text-indigo-500 font-bold w-full">25</span>
      </div>
      <div class="w-1/3 max-w-30 flex items-center">
        <UserIcon class="fill-indigo-500" />
      </div>
    </div>

    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">سفارش های جدید</h1>
        <span class="text-5xl text-green-500 font-bold w-full">41</span>
      </div>
      <div class="w-1/3 max-w-25 flex items-center">
        <ShoppingCartIcon class="fill-green-500" />
      </div>
    </div>

    <div class="flex justify-between col-span-3 md:col-span-1 shadow-md rounded-2xl p-3">
      <div class="w-2/3">
        <h1 class="text-2xl mb-8">سفارش های ارسال شده</h1>
        <span class="text-5xl text-amber-500 font-bold w-full">112</span>
      </div>
      <div class="w-1/3 max-w-25 flex items-center">
        <TruckIcon class="fill-amber-500" />
      </div>
    </div>
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




