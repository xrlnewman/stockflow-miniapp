# StockFlow API Contract v1

小程序端调用 `stockflow-admin` 仓库的 `/api/v1` 接口。统一响应、鉴权、订单状态和错误码以管理仓库中的完整契约为准。

核心接口：

- `GET /service-categories`、`GET /services`、`GET /services/:id`
- `GET/POST /addresses`
- `GET /availability`、`POST /orders`
- `GET /orders`、`GET /orders/:id`、取消、确认、评价
- `GET /workbench/tasks`
- 员工接单、到达、开始、上传凭证、完成

订单状态：`pending_confirmation`、`pending_dispatch`、`assigned`、`en_route`、`serving`、`pending_customer_confirmation`、`completed`、`cancelled`。
