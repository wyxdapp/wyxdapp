/**
 * 签约服务 API
 */
import { request } from '@/utils/request'

interface GetSignGuidesParams {
  userKid: string
  page?: number
  size?: number
}

interface SignGuideParams {
  userKid: string
  guideKid: string
  guideOrderRate: number
  lineOrderRate: number
}

interface UpdateSignRateParams {
  userKid: string
  guideKid: string
  guideOrderRate: number
  lineOrderRate: number
}

interface GetSignDetailParams {
  userKid: string
  guideKid: string
}

/**
 * 获取签约向导列表
 */
export const getSignGuides = (params: GetSignGuidesParams) => {
  return request.get('/operate/sign-guides', params, false)
}

/**
 * 签约向导
 */
export const signGuide = (params: SignGuideParams) => {
  return request.post('/operate/sign-guide', params, false)
}

/**
 * 更新签约费率
 */
export const updateSignRate = (params: UpdateSignRateParams) => {
  return request.post('/operate/update-sign-rate', params, false)
}

/**
 * 查看签约详情
 */
export const getSignDetail = (params: GetSignDetailParams) => {
  return request.get('/operate/sign-detail', params, false)
}

export default {
  getSignGuides,
  signGuide,
  updateSignRate,
  getSignDetail
}
