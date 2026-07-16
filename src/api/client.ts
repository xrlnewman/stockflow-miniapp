export interface DashboardSummary {
  todaySales: number
  pendingInbound: number
  pendingOutbound: number
  lowStock: number
  stockValue: number
}

export interface WarehouseItem { id: string; name: string; address: string; stockKeep: number }
export interface ProductItem { id: string; sku: string; name: string; category: string; warehouse: string; unit: string; stock: number; minStock: number; price: number; status: 'normal' | 'warning' | 'danger' }
export interface StockAlert { productId: string; sku: string; name: string; warehouse: string; stock: number; minStock: number; severity: 'warning' | 'danger' }
export interface PurchaseOrder { id: string; supplier: string; warehouse: string; items: number; amount: number; status: string; createdAt: string }
export interface SalesOrder { id: string; customer: string; warehouse: string; items: number; amount: number; status: string; createdAt: string }
export interface Movement { id: string; product: string; warehouse: string; type: string; quantity: number; source: string; createdAt: string }

export interface ApiRequestOptions { url: string; method: 'GET' | 'POST'; data?: unknown; header?: Record<string, string> }
export interface ApiResponse<T = unknown> { statusCode: number; data: T }
export type ApiRequester = (options: ApiRequestOptions) => Promise<ApiResponse>
export interface ApiClientOptions { baseUrl?: string; request?: ApiRequester; token?: string | (() => string | undefined) }

const demoDashboard: DashboardSummary = { todaySales: 3538, pendingInbound: 1, pendingOutbound: 1, lowStock: 2, stockValue: 46820 }
const demoWarehouses: WarehouseItem[] = [
  { id: 'wh-east', name: '东城中心仓', address: '东城工业园 18 号', stockKeep: 326 },
  { id: 'wh-west', name: '西郊备货仓', address: '西郊物流园 6 号', stockKeep: 188 },
]
const demoProducts: ProductItem[] = [
  { id: 'p-1001', sku: 'ST-1001', name: '轻量通勤双肩包', category: '箱包', warehouse: '东城中心仓', unit: '件', stock: 126, minStock: 40, price: 169, status: 'normal' },
  { id: 'p-1002', sku: 'ST-1002', name: '便携保温杯 480ml', category: '家居', warehouse: '东城中心仓', unit: '件', stock: 18, minStock: 30, price: 89, status: 'warning' },
  { id: 'p-1003', sku: 'ST-1003', name: '有机棉基础 T 恤', category: '服饰', warehouse: '西郊备货仓', unit: '件', stock: 9, minStock: 24, price: 129, status: 'danger' },
  { id: 'p-1004', sku: 'ST-1004', name: '桌面收纳盒套装', category: '家居', warehouse: '西郊备货仓', unit: '套', stock: 64, minStock: 20, price: 59, status: 'normal' },
]
const demoAlerts: StockAlert[] = demoProducts.filter((item) => item.stock <= item.minStock).map((item) => ({ productId: item.id, sku: item.sku, name: item.name, warehouse: item.warehouse, stock: item.stock, minStock: item.minStock, severity: item.stock * 2 <= item.minStock ? 'danger' : 'warning' }))
const demoPurchases: PurchaseOrder[] = [{ id: 'PO20260716001', supplier: '清和供应链', warehouse: '东城中心仓', items: 3, amount: 12800, status: '待入库', createdAt: '2026-07-16T08:30:00Z' }, { id: 'PO20260715008', supplier: '织物工坊', warehouse: '西郊备货仓', items: 2, amount: 7360, status: '已入库', createdAt: '2026-07-15T08:30:00Z' }]
const demoSales: SalesOrder[] = [{ id: 'SO20260716032', customer: '星河生活馆', warehouse: '东城中心仓', items: 8, amount: 3280, status: '待发货', createdAt: '2026-07-16T09:12:00Z' }, { id: 'SO20260716031', customer: '林先生', warehouse: '西郊备货仓', items: 2, amount: 258, status: '已完成', createdAt: '2026-07-16T08:40:00Z' }]
const demoMovements: Movement[] = [{ id: 'MV20260716009', product: '便携保温杯 480ml', warehouse: '东城中心仓', type: '出库', quantity: 12, source: 'SO20260716029', createdAt: '2026-07-16T09:30:00Z' }, { id: 'MV20260716008', product: '轻量通勤双肩包', warehouse: '东城中心仓', type: '入库', quantity: 60, source: 'PO20260716001', createdAt: '2026-07-16T08:45:00Z' }]

type RuntimeEnv = Record<string, string | undefined>
function runtimeEnv(): RuntimeEnv {
  const viteEnv = ((import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {}) as RuntimeEnv
  const globalEnv = globalThis as typeof globalThis & { __UNI_APP_API_BASE_URL__?: string; process?: { env?: RuntimeEnv } }
  return { ...globalEnv.process?.env, ...viteEnv, UNI_APP_API_BASE_URL: viteEnv.UNI_APP_API_BASE_URL ?? globalEnv.__UNI_APP_API_BASE_URL__ ?? globalEnv.process?.env?.UNI_APP_API_BASE_URL }
}
export function getApiBaseUrl(env: RuntimeEnv = runtimeEnv()): string { return (env.VITE_API_BASE_URL ?? env.UNI_APP_API_BASE_URL ?? '').trim().replace(/\/$/, '') }

function readToken(): string | undefined {
  const runtime = globalThis as typeof globalThis & { uni?: { getStorageSync?: (key: string) => unknown }; localStorage?: { getItem: (key: string) => string | null } }
  try { const uni = runtime.uni?.getStorageSync?.('stockflow_access_token'); if (typeof uni === 'string' && uni) return uni; return runtime.localStorage?.getItem('stockflow_access_token') || undefined } catch { return undefined }
}
async function defaultRequest(options: ApiRequestOptions): Promise<ApiResponse> {
  const runtime = globalThis as typeof globalThis & { uni?: { request?: (options: Record<string, unknown>) => void }; fetch?: (input: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ status: number; json: () => Promise<unknown> }> }
  if (runtime.uni?.request) return new Promise((resolve, reject) => runtime.uni?.request?.({ url: options.url, method: options.method, data: options.data, header: options.header, success: (response: { statusCode: number; data: unknown }) => resolve({ statusCode: response.statusCode, data: response.data }), fail: reject }))
  if (runtime.fetch) { const response = await runtime.fetch(options.url, { method: options.method, headers: { 'Content-Type': 'application/json', ...options.header }, body: options.method === 'POST' ? JSON.stringify(options.data ?? {}) : undefined }); return { statusCode: response.status, data: await response.json() } }
  throw new Error('当前运行环境没有可用的 HTTP 请求器')
}
function unwrap<T>(response: ApiResponse): T { if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(`API 请求失败：HTTP ${response.statusCode}`); const envelope = response.data as { code?: unknown; data?: unknown; message?: string } | null; if (!envelope || envelope.code !== 0) throw new Error(typeof envelope?.message === 'string' ? envelope.message : 'API 响应不符合契约'); return envelope.data as T }
function page<T>(value: T[] | { list?: T[] }): T[] { return Array.isArray(value) ? value : value.list ?? [] }
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T }

export interface ApiClient {
  fetchDashboard(): Promise<DashboardSummary>
  fetchWarehouses(): Promise<WarehouseItem[]>
  fetchProducts(keyword?: string): Promise<ProductItem[]>
  fetchStockAlerts(): Promise<StockAlert[]>
  fetchPurchaseOrders(): Promise<PurchaseOrder[]>
  receivePurchase(id: string): Promise<PurchaseOrder>
  fetchSalesOrders(): Promise<SalesOrder[]>
  shipSale(id: string): Promise<SalesOrder>
  fetchMovements(): Promise<Movement[]>
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = (options.baseUrl ?? getApiBaseUrl()).trim().replace(/\/$/, '')
  const request = options.request ?? defaultRequest
  const authHeader = (extra: Record<string, string> = {}) => { const token = typeof options.token === 'function' ? options.token() : options.token ?? readToken(); return token ? { ...extra, Authorization: `Bearer ${token}` } : extra }
  async function remote<T>(path: string, method: 'GET' | 'POST', data?: unknown, extra?: Record<string, string>): Promise<T> { return unwrap<T>(await request({ url: `${baseUrl}${path}`, method, data, header: authHeader(extra) })) }
  async function fallback<T>(name: string, value: T, action: () => Promise<T>): Promise<T> { if (!baseUrl) return clone(value); try { return await action() } catch (error) { console.warn(`[StockFlow API] ${name} 请求失败，已回退演示数据`, error); return clone(value) } }
  return {
    fetchDashboard: () => fallback('dashboard', demoDashboard, () => remote<DashboardSummary>('/dashboard', 'GET')),
    fetchWarehouses: () => fallback('warehouses', demoWarehouses, async () => page(await remote<{ list?: WarehouseItem[] }>('/warehouses', 'GET'))),
    fetchProducts: (keyword = '') => fallback('products', keyword ? demoProducts.filter((item) => `${item.name}${item.sku}`.includes(keyword)) : demoProducts, async () => page(await remote<{ list?: ProductItem[] }>(`/products?keyword=${encodeURIComponent(keyword)}`, 'GET'))),
    fetchStockAlerts: () => fallback('stock-alerts', demoAlerts, async () => page(await remote<{ list?: StockAlert[] }>('/stocks/alerts', 'GET'))),
    fetchPurchaseOrders: () => fallback('purchase-orders', demoPurchases, async () => page(await remote<{ list?: PurchaseOrder[] }>('/purchase-orders', 'GET'))),
    receivePurchase: (id) => fallback('purchase-receive', demoPurchases.find((item) => item.id === id) ?? demoPurchases[0], () => remote<PurchaseOrder>(`/purchase-orders/${id}/receive`, 'POST', {}, { 'Idempotency-Key': `stockflow-purchase-${id}` })),
    fetchSalesOrders: () => fallback('sales-orders', demoSales, async () => page(await remote<{ list?: SalesOrder[] }>('/sales-orders', 'GET'))),
    shipSale: (id) => fallback('sales-ship', demoSales.find((item) => item.id === id) ?? demoSales[0], () => remote<SalesOrder>(`/sales-orders/${id}/ship`, 'POST', {}, { 'Idempotency-Key': `stockflow-sale-${id}` })),
    fetchMovements: () => fallback('stock-movements', demoMovements, async () => page(await remote<{ list?: Movement[] }>('/stock-movements', 'GET'))),
  }
}

const defaultClient = createApiClient()
export const fetchDashboard = () => defaultClient.fetchDashboard()
export const fetchWarehouses = () => defaultClient.fetchWarehouses()
export const fetchProducts = (keyword?: string) => defaultClient.fetchProducts(keyword)
export const fetchStockAlerts = () => defaultClient.fetchStockAlerts()
export const fetchPurchaseOrders = () => defaultClient.fetchPurchaseOrders()
export const receivePurchase = (id: string) => defaultClient.receivePurchase(id)
export const fetchSalesOrders = () => defaultClient.fetchSalesOrders()
export const shipSale = (id: string) => defaultClient.shipSale(id)
export const fetchMovements = () => defaultClient.fetchMovements()
