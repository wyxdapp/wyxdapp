/**
 * 订单模块服务 API
 */
import { request } from '@/utils/request'

/**
 * 获取支出订单列表（游客端）
 */
export const getExpenditureList = (data: {
  userKid: string
  pageNumber: number
  pageSize: number
  orderStatus?: number
}) => {
  return request.post('/order/tourist/queryOrderList', data, false)
}

/**
 * 获取收入订单列表（向导端）
 */
export const getIncomeList = (data: {
  userKid: string
  pageNumber: number
  pageSize: number
  orderStatus?: number
}) => {
  return request.post('/order/guide/queryGuideAcceptOrder', data, false)
}

/**
 * 创建向导订单
 */
export const setGuiderOrder = (data: {
  userKid: string
  guideKid: string
  startTime: string
  endTime: string
  travellerList: UTSJSONObject[]
  orderAmount: number
  remark?: string
}) => {
  return request.post('/order/tourist/createFreeTravelOrder', data, false)
}

/**
 * 创建定制订单
 */
export const setRouteOrder = (data: {
  userKid: string
  lineKid: string
  startTime: string
  endTime: string
  travellerList: UTSJSONObject[]
  orderAmount: number
  remark?: string
}) => {
  return request.post('/order/tourist/createOrder', data, false)
}

/**
 * 获取订单详情
 */
export const getGuiderOrderInfo = (data: {
  orderKid: string
  userKid?: string
}) => {
  return request.post('/order/tourist/queryOrderDetails', data, false)
}

/**
 * 取消订单
 * 后端接口可能需要body中包含orderKid，或者body应该为空
 * 参考旧项目：vm.$u.post(`/order/tourist/cancelOrder?orderKid=${data.orderKid}`, data)
 * 旧项目把整个data对象（包含orderKid）作为body发送
 * 
 * 根据错误"参数不能为空"，尝试两种方案：
 * 1. body中包含orderKid（与旧项目一致）
 * 2. 如果不行，再尝试body为空对象
 */
export const setOrderCancel = (data: {
  orderKid: string
  userKid: string // 必需：后端需要userKid参数
  reason?: string
  cancelReason?: string
}) => {
  // 构建body，确保包含orderKid和userKid（后端必需）
  const body: Record<string, string | number> = {
    orderKid: data.orderKid,
    userKid: data.userKid
  }
  
  // 添加取消原因（如果有）
  if (data.cancelReason) {
    body.cancelReason = data.cancelReason
  } else if (data.reason) {
    body.cancelReason = data.reason
  }
  
  return request.post(`/order/tourist/cancelOrder?orderKid=${data.orderKid}`, body, false)
}

/**
 * 申请退款
 */
export const applyOrderRefound = (data: {
  orderKid: string
  refundReason: string
  refundAmount: number
}) => {
  return request.post('/order/refund/applyRefund', data, false)
}

/**
 * 撤销退款申请
 */
export const cancelRefund = (data: {
  orderKid: string
  userKid?: string
}) => {
  return request.post('/order/refund/cancelRefund', data, false)
}

/**
 * 查询退款详情（根据订单ID）
 */
export const queryRefundDetail = (data: {
  orderKid: string
}) => {
  return request.post('/order/refund/queryRefundDetail', data, false)
}

/**
 * 删除订单
 */
export const delOrderInfo = (data: {
  orderKid: string
}) => {
  return request.post('/order/tourist/deleteOrder', data, false)
}

/**
 * 完成订单
 */
export const setOrderComplete = (data: {
  orderKid: string
}) => {
  return request.post(`/order/tourist/completeOrder?orderKid=${data.orderKid}`, data, false)
}

/**
 * 接受订单（向导端）
 */
export const guiderAcceptOrder = (data: {
  orderKid: string
}) => {
  return request.post(`/order/guide/acceptTouristOrder?orderKid=${data.orderKid}`, data, false)
}

/**
 * 拒绝订单（向导端）
 */
export const guiderRejectOrder = (data: {
  orderKid: string
  reason?: string
}) => {
  return request.post(`/order/guide/refuseTouristOrder?orderKid=${data.orderKid}`, data, false)
}

/**
 * 评价订单
 */
export const setTravelAppraise = (data: {
  orderKid: string
  userKid: string
  evaluateScore: number
  evaluateContent: string
  evaluateImages?: string[]
}) => {
  return request.post('/behavior/evaluate/addEvaluate', data, false)
}

/**
 * 同意退款（向导端）
 */
export const guiderAcceptRefound = (data: {
  refundKid: string
}) => {
  return request.post(`/order/guide/agreeTouristRefund?refundKid=${data.refundKid}`, data, false)
}

/**
 * 拒绝退款（向导端）
 */
export const guiderRejectRefound = (data: {
  refundKid: string
  reason?: string
}) => {
  return request.post(`/order/guide/guideRefuseApplyRefund?refundKid=${data.refundKid}`, data, false)
}

/**
 * 修改订单价格（向导端）
 * POST /order/guide/updateOrderPrice
 * 
 * 注意：参数名称需要与后端接口保持一致
 * 旧项目使用：vm.$u.post('/order/guide/updateOrderPrice', data)
 * data包含：orderKid, orderPrice 或 orderAmount
 */
export const updateGuiderOrderPrice = (data: {
  orderKid: string
  orderPrice?: number
  orderAmount?: number
}) => {
  // 构建body，确保参数名称正确
  const body: Record<string, string | number> = {
    orderKid: data.orderKid
  }
  
  // 优先使用orderPrice，如果没有则使用orderAmount
  if (data.orderPrice !== undefined) {
    body.orderPrice = data.orderPrice
  } else if (data.orderAmount !== undefined) {
    body.orderPrice = data.orderAmount  // 后端可能期望orderPrice
    body.orderAmount = data.orderAmount  // 同时传递orderAmount以防万一
  }
  
  return request.post('/order/guide/updateOrderPrice', body, false)
}

/**
 * 发布抢单
 */
export const setGrabOrder = (data: {
  userKid: string
  startTime: string
  endTime: string
  destination: string
  travellerCount: number
  budget: number
  requirement: string
}) => {
  return request.post('/order/tourist/createGrabOrder', data, false)
}

/**
 * 修改抢单
 */
export const updateGrabOrder = (data: {
  orderKid: string
  startTime?: string
  endTime?: string
  destination?: string
  travellerCount?: number
  budget?: number
  requirement?: string
}) => {
  return request.post('/order/tourist/updateGrabOrder', data, false)
}

/**
 * 抢单列表
 */
export const grabOrderList = (data: {
  pageNumber: number
  pageSize: number
  cityName?: string
}) => {
  return request.post('/order/guide/queryGrabOrder', data, false)
}

/**
 * 抢单（向导端）
 */
export const guiderGrabOrder = (data: {
  orderKid: string
  guideKid: string
}) => {
  return request.post('/order/guide/grabOrder', data, false)
}

/**
 * 创建VIP会员订单
 */
export const createVipOrder = (data: {
  userKid: string
  vipType: string // 10月卡 20年卡
  totalMoney: number
}, idempotencyKey?: string) => {
  return request.post('/order/tourist/createVipOrder', data, false)
}

/**
 * 创建礼物订单
 */
export const createGiftOrder = (data: {
  userKid: string
  giftKid: string
  receiveUserKid: string
  totalMoney: number
  giftName: string
  giftImage: string
}, idempotencyKey?: string) => {
  return request.post('/order/tourist/createGiftOrder', data, false)
}

export default {
  getExpenditureList,
  getIncomeList,
  setGuiderOrder,
  setRouteOrder,
  getGuiderOrderInfo,
  setOrderCancel,
  applyOrderRefound,
  cancelRefund,
  queryRefundDetail,
  delOrderInfo,
  setOrderComplete,
  guiderAcceptOrder,
  guiderRejectOrder,
  setTravelAppraise,
  guiderAcceptRefound,
  guiderRejectRefound,
  updateGuiderOrderPrice,
  setGrabOrder,
  updateGrabOrder,
  grabOrderList,
  guiderGrabOrder,
  createVipOrder
}
