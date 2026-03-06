import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.uts', '.js', '.json'],
  },
  esbuild: {
    // 让 esbuild 将 .uts 文件当作 TypeScript 处理
    include: /\.(ts|uts)$/,
    loader: 'ts',
  },
  test: {
    include: ['**/*.test.ts'],
    environment: 'node',
  },
})
