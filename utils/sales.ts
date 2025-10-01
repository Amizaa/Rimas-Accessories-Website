export interface Order {
  id: number
  order_date: string // ISO string
  total_amount: string
  status: string
}

export function groupSales(orders: Order[]) {
  const daily: Record<string, number> = {}
  const weekly: Record<string, number> = {}
  const monthly: Record<string, number> = {}
  const yearly: Record<string, number> = {}

  const faDayFormatter = new Intl.DateTimeFormat("fa-IR", { day: "2-digit", month: "long" })
  const faMonthFormatter = new Intl.DateTimeFormat("fa-IR", { month: "long", year: "numeric" })
  const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" })

  orders
    .filter(o => o.status === "shipped")
    .forEach(order => {
      const total = parseFloat(order.total_amount)
      const d = new Date(order.order_date)

      // --- Daily
      const dayKey = d.toISOString().split("T")[0] // YYYY-MM-DD
      daily[dayKey] = (daily[dayKey] || 0) + total

      // --- Weekly (ISO week calculation)
      const temp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      const dayNum = temp.getUTCDay() || 7
      temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil((((+temp - +yearStart) / 86400000) + 1) / 7)
      const weekKey = `هفته ${weekNo} ام`
      weekly[weekKey] = (weekly[weekKey] || 0) + total

      // --- Monthly
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      monthly[monthKey] = (monthly[monthKey] || 0) + total

      // --- Yearly
      const yearKey = d.getFullYear().toString()
      yearly[yearKey] = (yearly[yearKey] || 0) + total
    })

  return {
    dailyData: Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, sales]) => ({ day: faDayFormatter.format(new Date(day)), sales })),

    weeklyData: Object.entries(weekly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, sales]) => ({ week, sales })),

    monthlyData: Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, sales]) => ({ month: faMonthFormatter.format(new Date(month + "-01")), sales })),

    yearlyData: Object.entries(yearly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, sales]) => ({ year: parseInt(year), sales })),
  }
}


// utils/sales.ts
export function groupSalesByCategory(orders: any[]) {
   if (!Array.isArray(orders)) {
    console.warn("⚠️ Expected orders array, got:", orders)
    return []
  }

  // category -> total quantity
  const categoryTotals: Record<string, number> = {}

  orders
    .filter(o => o.status === "shipped") // ✅ only shipped orders
    .forEach(order => {
      order.items.forEach((item: any) => {
        const categoryName = item.product.category.name
        const quantity = item.quantity

        categoryTotals[categoryName] =
          (categoryTotals[categoryName] || 0) + quantity
      })
    })

  // calculate grand total quantity
  const grandTotal = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  )

  // define some colors for categories
  const colors = [
    "#3b82f6", // blue
    "#a855f7", // purple
    "#22c55e", // green
    "#ef4444", // red
    "#f59e0b", // yellow
    "#06b6d4", // cyan
  ]

  // convert to donut chart format
  const DonutData = Object.entries(categoryTotals).map(([name, value], i) => ({
    color: colors[i % colors.length],
    name,
    value: Math.round((value / grandTotal) * 100), // percentage based on quantity
  }))

  return DonutData
}

