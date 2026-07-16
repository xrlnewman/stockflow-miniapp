<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchDashboard, fetchStockAlerts, fetchWarehouses, type DashboardSummary, type StockAlert, type WarehouseItem } from '../../api/client'

const loading = ref(true)
const dashboard = ref<DashboardSummary>({ todaySales: 0, pendingInbound: 0, pendingOutbound: 0, lowStock: 0, stockValue: 0 })
const alerts = ref<StockAlert[]>([])
const warehouses = ref<WarehouseItem[]>([])

async function load() {
  loading.value = true
  try { [dashboard.value, alerts.value, warehouses.value] = await Promise.all([fetchDashboard(), fetchStockAlerts(), fetchWarehouses()]) } finally { loading.value = false }
}
function money(value: number) { return `¥${value.toLocaleString('zh-CN')}` }
onMounted(load)
</script>

<template>
  <view class="page safe-top home">
    <view class="topline"><view><text class="eyebrow">STOCK FLOW / 2026</text><text class="title">库存清晰，<br /><text class="accent">生意更从容</text></text></view><view class="avatar">许</view></view>
    <view class="hero card"><view><text class="hero-kicker">今日经营概览</text><text class="hero-title">每一件商品，<br />都值得被准确管理</text><text class="hero-note">采购入库 · 销售出库 · 库存预警<br />小团队也能用好的免费进销存</text></view><text class="hero-mark">▦</text></view>
    <view v-if="loading" class="state card"><text class="state-icon">◌</text>正在同步库存数据…</view>
    <template v-else>
      <view class="metric-grid"><view class="metric card"><text class="metric-label">今日销售</text><text class="metric-value">{{ money(dashboard.todaySales) }}</text><text class="metric-trend">↗ 较昨日 +12.8%</text></view><view class="metric card"><text class="metric-label">库存总值</text><text class="metric-value">{{ money(dashboard.stockValue) }}</text><text class="metric-trend blue">{{ warehouses.length }} 个仓库</text></view></view>
      <view class="quick-grid"><view class="quick card" @click="uni.navigateTo({ url: '/pages/workbench/workbench' })"><text class="quick-icon orange">＋</text><text class="quick-name">快速入库</text><text class="small muted">登记采购到货</text></view><view class="quick card" @click="uni.navigateTo({ url: '/pages/orders/orders' })"><text class="quick-icon">↗</text><text class="quick-name">销售出库</text><text class="small muted">处理 {{ dashboard.pendingOutbound }} 笔待发货</text></view></view>
      <view class="section-head"><text class="section-title">库存预警</text><text class="section-more">{{ dashboard.lowStock }} 项需要补货</text></view>
      <view class="alert-list"><view v-for="item in alerts" :key="item.productId" class="alert card"><view class="alert-icon" :class="item.severity">!</view><view class="alert-info"><text class="alert-name">{{ item.name }}</text><text class="small muted">{{ item.warehouse }} · {{ item.sku }}</text></view><view class="alert-stock"><text :class="item.severity">{{ item.stock }}</text><text class="small muted">/{{ item.minStock }} {{ item.severity === 'danger' ? '严重' : '偏低' }}</text></view></view></view>
      <view class="section-head"><text class="section-title">仓库概览</text><text class="section-more">全部仓库 →</text></view>
      <view class="warehouse-list"><view v-for="warehouse in warehouses" :key="warehouse.id" class="warehouse card"><view class="warehouse-mark">⌂</view><view><text class="warehouse-name">{{ warehouse.name }}</text><text class="small muted">{{ warehouse.address }}</text></view><text class="warehouse-count">{{ warehouse.stockKeep }}<small> SKU</small></text></view></view>
    </template>
  </view>
</template>

<style scoped lang="scss">
.topline { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:34rpx; }.title { display:block; margin-top:15rpx; }.accent { color:var(--brand); }.avatar { width:72rpx; height:72rpx; border-radius:24rpx; display:flex; align-items:center; justify-content:center; background:var(--brand); color:white; font-weight:800; font-size:30rpx; }.hero { min-height:310rpx; padding:34rpx; display:flex; overflow:hidden; position:relative; background:var(--ink); color:white; border:0; }.hero-kicker { color:#B7C9EA; font-size:22rpx; }.hero-title { display:block; margin-top:16rpx; font-size:40rpx; line-height:1.3; font-weight:800; }.hero-note { display:block; margin-top:18rpx; color:#D7E1F5; font-size:23rpx; line-height:1.65; }.hero-mark { position:absolute; right:24rpx; bottom:-30rpx; font-size:220rpx; color:var(--brand); opacity:.8; transform:rotate(-8deg); }.metric-grid { display:grid; grid-template-columns:1fr 1fr; gap:20rpx; margin-top:22rpx; }.metric { padding:24rpx; min-height:160rpx; }.metric-label { color:var(--muted); font-size:23rpx; display:block; }.metric-value { display:block; margin-top:10rpx; font-size:36rpx; font-weight:800; color:var(--ink); }.metric-trend { display:block; margin-top:9rpx; color:var(--success); font-size:21rpx; font-weight:700; }.metric-trend.blue { color:var(--brand); }.quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:20rpx; margin-top:20rpx; }.quick { padding:24rpx; min-height:154rpx; }.quick-icon { color:var(--brand); font-size:38rpx; display:block; }.quick-icon.orange { color:var(--action); }.quick-name { display:block; font-size:28rpx; font-weight:800; margin:8rpx 0 7rpx; }.section-more { color:var(--brand); font-size:24rpx; }.alert-list,.warehouse-list { display:flex; flex-direction:column; gap:14rpx; }.alert { padding:18rpx; display:flex; align-items:center; }.alert-icon { width:64rpx; height:64rpx; border-radius:18rpx; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:32rpx; margin-right:18rpx; }.alert-icon.warning { background:#FFF6D8; color:#A77900; }.alert-icon.danger { background:#FDE8E8; color:#C24141; }.alert-info { flex:1; }.alert-name { display:block; font-size:28rpx; font-weight:800; margin-bottom:6rpx; }.alert-stock { text-align:right; }.alert-stock text:first-child { display:block; font-size:35rpx; font-weight:800; }.alert-stock text.warning { color:#A77900; }.alert-stock text.danger { color:#C24141; }.warehouse { display:flex; align-items:center; padding:20rpx; }.warehouse-mark { width:66rpx; height:66rpx; border-radius:18rpx; background:var(--brand-soft); color:var(--brand); display:flex; align-items:center; justify-content:center; font-size:30rpx; margin-right:18rpx; }.warehouse-name { display:block; font-size:28rpx; font-weight:800; margin-bottom:6rpx; }.warehouse-count { margin-left:auto; color:var(--brand); font-size:32rpx; font-weight:800; }.warehouse-count small { font-size:20rpx; color:var(--muted); font-weight:600; }.state { margin-top:22rpx; }
</style>
