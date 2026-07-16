import { describe, expect, it } from 'vitest'
import { createApiClient, type ApiRequestOptions, type ApiResponse } from '../src/api/client'

describe('StockFlow 库存工作台', () => {
  it('默认返回完整的库存概览、商品和预警演示数据', async () => {
    const client = createApiClient()
    const dashboard = await client.fetchDashboard()
    const products = await client.fetchProducts()
    const alerts = await client.fetchStockAlerts()
    expect(dashboard).toMatchObject({ pendingInbound: 1, pendingOutbound: 1, lowStock: 2 })
    expect(products).toHaveLength(4)
    expect(alerts.map((item) => item.severity)).toEqual(['warning', 'danger'])
  })

  it('请求失败时回退演示数据并携带幂等键', async () => {
    const calls: ApiRequestOptions[] = []
    const request = async (options: ApiRequestOptions): Promise<ApiResponse> => {
      calls.push(options)
      if (options.url.endsWith('/dashboard')) return { statusCode: 200, data: { code: 0, data: { todaySales: 888, pendingInbound: 2, pendingOutbound: 3, lowStock: 1, stockValue: 99 } } }
      throw new Error('network offline')
    }
    const client = createApiClient({ baseUrl: 'https://api.example.com/api/v1', request })
    await expect(client.fetchDashboard()).resolves.toMatchObject({ todaySales: 888 })
    await expect(client.receivePurchase('PO20260716001')).resolves.toMatchObject({ id: 'PO20260716001' })
    expect(calls[1].header?.['Idempotency-Key']).toBe('stockflow-purchase-PO20260716001')
  })
})
