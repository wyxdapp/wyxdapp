/**
 * addGuide 页面参数构建逻辑 - 可测试的纯函数提取
 *
 * 从 addGuide.uvue 的 handlePublish() 中提取参数构建逻辑，
 * 使其可在 Node.js 环境中进行属性测试。
 */

/** 向导表单数据 */
export interface GuideFormData {
  memberGuideKid: string
  imagePhoto: string
  accessiblePlace: string[]
  servicePrice: string
  guideDescribe: string
  serviceLabel: string
  labelKids: string[]
  languageKids: string[]
}

/** 位置信息 */
export interface LocationInfo {
  latitude: number
  longitude: number
}

/** 提交参数（当前未修复版本） */
export interface GuidePublishParams {
  memberGuideKid: string
  imagePhoto: string
  accessiblePlace: string
  servicePrice: number
  guideDescribe: string
  serviceLabel: string
  labelKids: string[]
  languageKids: string[]
  latitude?: number
  longitude?: number
}

/**
 * 构建发布参数（修复后版本）
 * 
 * 从 addGuide.uvue handlePublish() 提取的参数构建逻辑。
 * 当提供有效经纬度（非 0）时，在返回的 params 中包含 latitude/longitude。
 */
export function buildPublishParams(form: GuideFormData, location?: LocationInfo): GuidePublishParams {
  const params: GuidePublishParams = {
    memberGuideKid: form.memberGuideKid,
    imagePhoto: form.imagePhoto.trim(),
    accessiblePlace: form.accessiblePlace.join(','),
    servicePrice: parseFloat(form.servicePrice),
    guideDescribe: form.guideDescribe.trim(),
    serviceLabel: form.serviceLabel,
    labelKids: form.labelKids,
    languageKids: form.languageKids,
  }

  // 仅在经纬度有效（非 0）时添加，避免覆盖后端已有数据
  if (location && location.latitude !== 0 && location.longitude !== 0) {
    params.latitude = location.latitude
    params.longitude = location.longitude
  }

  return params
}
