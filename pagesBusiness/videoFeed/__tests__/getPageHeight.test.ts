/**
 * Bug 条件探索测试 - H5 端 swiper 高度超出可视区域
 *
 * 目标：在未修复代码上运行，发现反例证明 bug 存在。
 * 当前（未修复）逻辑：initPage() 优先使用 screenHeight，
 * 仅在 screenHeight 无效时才回退到 windowHeight。
 * 在 H5 端，screenHeight > windowHeight（浏览器 UI 占用空间），
 * 导致 swiper 容器高度超出可视区域，底部内容被裁切。
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1**
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { getPageHeight } from '../videoFeedUtils'
import type { SystemInfo } from '../videoFeedUtils'

// ==================== 属性基测试 ====================

describe('Property 1: Fault Condition - H5 端 swiper 高度超出可视区域', () => {
  /**
   * 属性测试：对于所有满足 platform == 'h5' AND screenHeight > windowHeight 的输入，
   * getPageHeight(input) 应返回 windowHeight（期望行为）。
   *
   * 在未修复代码上，此测试预期失败，因为 getPageHeight 总是返回 screenHeight。
   * 失败即证明 bug 存在。
   */
  it('H5 端：当 screenHeight > windowHeight 时，pageHeight 应等于 windowHeight', () => {
    fc.assert(
      fc.property(
        // 生成器：构造 H5 环境下 screenHeight > windowHeight 的系统信息
        fc.record({
          // windowHeight：浏览器可视区域高度，合理范围 300-1200px
          windowHeight: fc.integer({ min: 300, max: 1200 }),
          // heightDiff：浏览器 UI 占用的高度差，合理范围 20-200px
          heightDiff: fc.integer({ min: 20, max: 200 }),
        }).map(({ windowHeight, heightDiff }) => ({
          platform: 'h5' as string,
          screenHeight: windowHeight + heightDiff, // 确保 screenHeight > windowHeight
          windowHeight,
        })),
        // 断言：H5 端 pageHeight 应等于 windowHeight，而非 screenHeight
        (systemInfo: SystemInfo) => {
          const result = getPageHeight(systemInfo)
          // 期望行为：H5 端应使用 windowHeight
          expect(result).toBe(systemInfo.windowHeight)
        }
      ),
      { numRuns: 100 }
    )
  })
})


// ==================== 属性基测试：保持不变 ====================

/**
 * Property 2: Preservation - APP 端全屏高度行为保持不变
 *
 * 观察优先方法论：
 * - 观察 1：getPageHeight({ platform: 'app', screenHeight: 812, windowHeight: 812 }) 返回 812
 * - 观察 2：getPageHeight({ platform: 'app', screenHeight: 844, windowHeight: 745 }) 返回 844
 *   （APP 端始终使用 screenHeight，无论 windowHeight 是什么值）
 * - 观察 3：当 screenHeight 和 windowHeight 都有效时，非 H5 平台始终返回 screenHeight
 *
 * 属性：对于所有非 H5 平台的输入，getPageHeight(input) 应返回 screenHeight
 * 此测试在未修复代码上应通过（当前逻辑对非 H5 平台是正确的）。
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 */
describe('Property 2: Preservation - APP 端全屏高度行为保持不变', () => {
  /**
   * 属性测试：对于所有非 H5 平台（platform != 'h5'），
   * getPageHeight(input) 应始终返回 screenHeight。
   *
   * 在未修复代码上，此测试预期通过，因为当前逻辑优先使用 screenHeight，
   * 这对 APP 端是正确的行为。
   */
  it('非 H5 平台：pageHeight 应始终等于 screenHeight', () => {
    // 非 H5 平台列表（APP 端及其他原生平台）
    const nonH5Platforms = ['app', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'android', 'ios']

    fc.assert(
      fc.property(
        // 生成器：构造非 H5 平台的系统信息
        fc.record({
          // 从非 H5 平台列表中随机选择
          platform: fc.constantFrom(...nonH5Platforms),
          // screenHeight：设备屏幕高度，合理范围 500-2000px
          screenHeight: fc.integer({ min: 500, max: 2000 }),
          // windowHeight：可视窗口高度，合理范围 300-2000px
          windowHeight: fc.integer({ min: 300, max: 2000 }),
        }),
        // 断言：非 H5 平台 pageHeight 应始终等于 screenHeight
        (systemInfo: SystemInfo) => {
          const result = getPageHeight(systemInfo)
          // 保持不变：非 H5 平台始终使用 screenHeight，保持全屏沉浸式体验
          expect(result).toBe(systemInfo.screenHeight)
        }
      ),
      { numRuns: 200 }
    )
  })

  /**
   * 属性测试：对于所有平台，swiper 滑动切换逻辑不受高度计算影响。
   * 验证 getPageHeight 返回的高度始终为正数，确保 swiper 容器可正常渲染。
   *
   * 在未修复代码上，此测试预期通过。
   */
  it('所有平台：pageHeight 始终为有效正数，确保 swiper 可正常渲染', () => {
    const allPlatforms = ['h5', 'app', 'mp-weixin', 'mp-alipay', 'android', 'ios']

    fc.assert(
      fc.property(
        fc.record({
          platform: fc.constantFrom(...allPlatforms),
          // 包含有效和无效的高度值，测试兜底逻辑
          screenHeight: fc.oneof(
            fc.integer({ min: 1, max: 2000 }),   // 有效值
            fc.integer({ min: -100, max: 0 })     // 无效值
          ),
          windowHeight: fc.oneof(
            fc.integer({ min: 1, max: 2000 }),   // 有效值
            fc.integer({ min: -100, max: 0 })     // 无效值
          ),
        }),
        // 断言：无论输入如何，pageHeight 始终为正数
        (systemInfo: SystemInfo) => {
          const result = getPageHeight(systemInfo)
          // swiper 容器高度必须为正数才能正常渲染和滑动
          expect(result).toBeGreaterThan(0)
        }
      ),
      { numRuns: 200 }
    )
  })
})
