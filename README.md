# StockFlow Miniapp

StockFlow 是进销存移动工作台，基于 uni-app + Vue 3 + TypeScript，同时支持微信小程序与 H5 预览。店员可以查看库存概览、处理采购入库、确认销售出库、查看低库存预警和库存流水。

## 关联仓库

- [StockFlow Admin + Go Gin API](https://github.com/xrlnewman/stockflow-admin)
- [许汝林个人博客项目页](https://field-notes-2fi.pages.dev/projects/stockflow-platform/)

## 快速开始

```bash
npm install
npm test
npm run dev:h5
```

默认不配置 API 地址时使用内置演示数据，不需要账号或密钥即可预览。配置 `VITE_API_BASE_URL` 或 `UNI_APP_API_BASE_URL` 后，客户端请求后台 `/api/v1`，网络错误会保留告警并回退到演示数据，避免页面白屏。

## 产品边界

首版覆盖商品、仓库、采购入库、销售出库、库存预警和流水追溯；退货、批次、支付和多组织管理暂不包含。所有演示数据均为虚构数据，仅用于产品展示。

## 许可

MIT © xrlnewman
