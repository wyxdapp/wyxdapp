/**
 * Bug 条件探索测试 - 发布/编辑向导时提交参数缺少经纬度坐标
 *
 * 目标：在未修复代码上运行，发现反例证明 bug 存在。
 *
 * 当前（未修复）逻辑：addGuide.uvue 的 handlePublish() 构建提交参数时，
 * 仅包含 memberGuideKid、imagePhoto、accessiblePlace、servicePrice、
 * guideDescribe、serviceLabel、labelKids、languageKids，
 * 完全没有 latitude 和 longitude 字段。
 *
 * 根因：handlePublish() 未调用 getLocationInfo() 获取用户位置，
 * 也未在 params 中添加经纬度字段。
 *
 * 故障条件：isBugCondition(input) 当
 *   input.action IN ['publish', 'edit']
 *   AND input.source == 'addGuide'
 *   AND input.submittedParams.latitude == NULL
 *   AND input.submittedParams.longitude == NULL
 *
 * **Validates: Requirements 1.1, 2.1, 2.3**
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { buildPublishParams } from './addGuideUtils'
import type { GuideFormData, GuidePublishParams, LocationInfo } from './addGuideUtils'

// ==================== 属性基测试 ====================

describe('Property 1: Fault Condition - 发布/编辑向导时提交参数缺少经纬度坐标', () => {
  /**
   * 生成器：构造有效的向导表单数据
   * 模拟用户在 addGuide 页面填写完整表单后的数据
   */
  const guideFormArb: fc.Arbitrary<GuideFormData> = fc.record({
    memberGuideKid: fc.uuid(),
    imagePhoto: fc.webUrl(),
    accessiblePlace: fc.array(
      fc.constantFrom('北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '长沙'),
      { minLength: 1, maxLength: 5 }
    ),
    servicePrice: fc.integer({ min: 1, max: 9999 }).map(n => n.toString()),
    guideDescribe: fc.string({ minLength: 1, maxLength: 200 }),
    serviceLabel: fc.constantFrom('美食', '摄影', '户外', '文化', '购物'),
    labelKids: fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }),
    languageKids: fc.array(fc.uuid(), { minLength: 0, maxLength: 3 }),
  })

  /**
   * 有效经纬度生成器：模拟 getLocationInfo() 返回的有效定位结果
   */
  const validLocationArb: fc.Arbitrary<LocationInfo> = fc.record({
    latitude: fc.double({ min: -90, max: 90, noNaN: true }).filter(v => v !== 0),
    longitude: fc.double({ min: -180, max: 180, noNaN: true }).filter(v => v !== 0),
  })

  /**
   * 属性测试：对于所有有效的向导表单数据和有效定位结果，
   * buildPublishParams(form, location) 返回的参数中应包含有效的 latitude 和 longitude。
   *
   * 在未修复代码上，此测试预期失败，因为 buildPublishParams 从未添加经纬度字段。
   * 修复后，传入有效 LocationInfo 时参数中应包含经纬度。
   */
  it('发布向导时，提交参数中应包含 latitude 和 longitude 字段', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        validLocationArb,
        (form: GuideFormData, location: LocationInfo) => {
          const params = buildPublishParams(form, location)

          // 期望行为：提交参数中应包含 latitude 和 longitude 字段
          expect(params).toHaveProperty('latitude')
          expect(params).toHaveProperty('longitude')

          // 期望行为：经纬度应为有效数值（非 undefined/null）
          expect(typeof params.latitude).toBe('number')
          expect(typeof params.longitude).toBe('number')

          // 期望行为：经纬度值应与传入的定位结果一致
          expect(params.latitude).toBe(location.latitude)
          expect(params.longitude).toBe(location.longitude)
        }
      ),
      { numRuns: 100 }
    )
  })
})


// ==================== 保持性属性测试 ====================

/**
 * Property 2: Preservation - 非经纬度相关行为保持不变
 *
 * 目标：验证 buildPublishParams 对非经纬度字段的转换逻辑在修复前后保持一致。
 * 在未修复代码上运行应全部通过，确认基线行为。
 *
 * 观察（未修复代码）：
 * - 表单字段正确转换：accessiblePlace join、servicePrice 转数字、imagePhoto/guideDescribe trim
 * - labelKids、languageKids 等数组字段原样传递
 * - 定位失败时发布流程不受阻断（buildPublishParams 不依赖定位信息）
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 */
describe('Property 2: Preservation - 非经纬度相关行为保持不变', () => {
  /**
   * 生成器：构造有效的向导表单数据（含边界情况）
   */
  const guideFormArb: fc.Arbitrary<GuideFormData> = fc.record({
    memberGuideKid: fc.uuid(),
    imagePhoto: fc.webUrl().map(url => fc.sample(fc.constantFrom(url, `  ${url}  `, `${url} `), 1)[0]),
    accessiblePlace: fc.array(
      fc.constantFrom('北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '长沙', '武汉', '南京'),
      { minLength: 1, maxLength: 5 }
    ),
    servicePrice: fc.integer({ min: 1, max: 99999 }).map(n => n.toString()),
    guideDescribe: fc.string({ minLength: 1, maxLength: 200 }).map(s => {
      // 有时添加前后空格以测试 trim
      const pad = fc.sample(fc.constantFrom('', ' ', '  '), 1)[0]
      return pad + s + pad
    }),
    serviceLabel: fc.constantFrom('美食', '摄影', '户外', '文化', '购物'),
    labelKids: fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }),
    languageKids: fc.array(fc.uuid(), { minLength: 0, maxLength: 3 }),
  })

  it('accessiblePlace 数组应正确 join 为逗号分隔字符串', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          const params = buildPublishParams(form)
          const expected = form.accessiblePlace.join(',')
          expect(params.accessiblePlace).toBe(expected)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('servicePrice 应正确转换为数字', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          const params = buildPublishParams(form)
          expect(params.servicePrice).toBe(parseFloat(form.servicePrice))
          expect(typeof params.servicePrice).toBe('number')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('imagePhoto 应正确 trim 去除前后空格', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          const params = buildPublishParams(form)
          expect(params.imagePhoto).toBe(form.imagePhoto.trim())
          // 确保没有前后空格
          expect(params.imagePhoto).toBe(params.imagePhoto.trim())
        }
      ),
      { numRuns: 100 }
    )
  })

  it('guideDescribe 应正确 trim 去除前后空格', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          const params = buildPublishParams(form)
          expect(params.guideDescribe).toBe(form.guideDescribe.trim())
          expect(params.guideDescribe).toBe(params.guideDescribe.trim())
        }
      ),
      { numRuns: 100 }
    )
  })

  it('memberGuideKid、serviceLabel、labelKids、languageKids 应原样传递', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          const params = buildPublishParams(form)
          expect(params.memberGuideKid).toBe(form.memberGuideKid)
          expect(params.serviceLabel).toBe(form.serviceLabel)
          expect(params.labelKids).toEqual(form.labelKids)
          expect(params.languageKids).toEqual(form.languageKids)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('buildPublishParams 不依赖定位信息，定位失败不影响参数构建', () => {
    fc.assert(
      fc.property(
        guideFormArb,
        (form: GuideFormData) => {
          // 无论是否有定位信息，buildPublishParams 都应正常返回结果
          const params = buildPublishParams(form)

          // 返回的参数对象应包含所有必需的非经纬度字段
          expect(params).toHaveProperty('memberGuideKid')
          expect(params).toHaveProperty('imagePhoto')
          expect(params).toHaveProperty('accessiblePlace')
          expect(params).toHaveProperty('servicePrice')
          expect(params).toHaveProperty('guideDescribe')
          expect(params).toHaveProperty('serviceLabel')
          expect(params).toHaveProperty('labelKids')
          expect(params).toHaveProperty('languageKids')

          // 返回的参数对象应为有效对象（不为 null/undefined）
          expect(params).toBeDefined()
          expect(params).not.toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
})
