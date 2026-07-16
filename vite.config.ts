import { defineConfig } from 'vite'
import uniPackage from '@dcloudio/vite-plugin-uni'

// 旧版 uni CLI 在 ESM 配置下会把 CommonJS 默认导出包装成 namespace。
const uni = (uniPackage as unknown as { default?: typeof uniPackage }).default ?? uniPackage

export default defineConfig({
  plugins: [uni()],
  server: { host: '0.0.0.0', port: 4330 },
})
