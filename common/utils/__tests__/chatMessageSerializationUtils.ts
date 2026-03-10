/**
 * 聊天消息序列化测试工具
 * 
 * 模拟 ChatMessage 类和 MessageType 枚举在 UTS/APP 端的行为，
 * 用于验证 JSON.stringify 序列化时枚举字段的处理。
 */

// ==================== 类型定义 ====================

/**
 * MessageType 枚举 - 模拟 messageStateManager.uts 中的定义
 * 
 * 在 UTS APP 端（Kotlin），枚举值是一个对象实例，
 * JSON.stringify 时不会自动转为其字符串 value，
 * 而是序列化为对象形式或其他非预期格式。
 * 
 * 这里用 class 实例模拟 UTS 枚举在 APP 端的实际行为：
 * 枚举值是一个包含 name 和 value 属性的对象。
 */
export class MessageTypeEnum {
  readonly name: string
  readonly value: string

  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }

  toString(): string {
    // UTS 枚举的 toString() 在 APP 端返回枚举名称（如 "TEXT"），而非值（"text"）
    return this.name
  }
}

/**
 * 模拟 UTS MessageType 枚举的静态成员
 */
export const MessageType = {
  TEXT: new MessageTypeEnum('TEXT', 'text'),
  IMAGE: new MessageTypeEnum('IMAGE', 'image'),
  VOICE: new MessageTypeEnum('VOICE', 'voice'),
  VIDEO: new MessageTypeEnum('VIDEO', 'video'),
  SHARE: new MessageTypeEnum('SHARE', 'share'),
  GIFT: new MessageTypeEnum('GIFT', 'gift'),
  SYSTEM_NOTIFICATION: new MessageTypeEnum('SYSTEM_NOTIFICATION', 'system_notification'),
} as const

export type MessageTypeValue = typeof MessageType[keyof typeof MessageType]

/**
 * 所有有效的 MessageType 值列表
 */
export const ALL_MESSAGE_TYPES: MessageTypeValue[] = [
  MessageType.TEXT,
  MessageType.IMAGE,
  MessageType.VOICE,
  MessageType.VIDEO,
  MessageType.SHARE,
  MessageType.GIFT,
  MessageType.SYSTEM_NOTIFICATION,
]

/**
 * MessageType 枚举值到期望字符串的映射
 */
export const MESSAGE_TYPE_EXPECTED_STRINGS: Record<string, string> = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  VIDEO: 'video',
  SHARE: 'share',
  GIFT: 'gift',
  SYSTEM_NOTIFICATION: 'system_notification',
}


// ==================== MessageStatus 枚举 ====================

export class MessageStatusEnum {
  readonly name: string
  readonly value: string

  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }

  toString(): string {
    return this.name
  }
}

export const MessageStatus = {
  PENDING: new MessageStatusEnum('PENDING', 'pending'),
  SENDING: new MessageStatusEnum('SENDING', 'sending'),
  SENT: new MessageStatusEnum('SENT', 'sent'),
  FAILED: new MessageStatusEnum('FAILED', 'failed'),
  RECEIVED: new MessageStatusEnum('RECEIVED', 'received'),
} as const

// ==================== ChatMessage 类 ====================

/**
 * 模拟 messageStateManager.uts 中的 ChatMessage 类
 * 
 * 关键点：type 字段是 MessageTypeEnum 实例（而非字符串），
 * 这正是导致 JSON.stringify 序列化问题的根源。
 */
export class ChatMessage {
  id: string = ''
  tempId?: string
  content: string = ''
  type: MessageTypeValue = MessageType.TEXT
  senderId: string = ''
  receiverId: string = ''
  status: MessageStatusEnum = MessageStatus.PENDING
  mediaUrl?: string
  thumbUrl?: string
  duration?: number
  createTime: string = ''
  sendTime?: string
  conversationId: string = ''
  retryCount?: number
  isTemp?: boolean
}

// ==================== 模拟工具函数 ====================

/**
 * 模拟 messageHelper.uts 中的 getAnyString 函数
 * 
 * 原始实现：
 *   const jsonObj = JSON.parse(JSON.stringify(obj)) as UTSJSONObject
 *   const val = jsonObj.get(key)
 *   return val?.toString() ?? ''
 */
export function getAnyString(obj: any, key: string): string {
  if (obj == null) return ''
  try {
    const jsonObj = JSON.parse(JSON.stringify(obj))
    const val = jsonObj[key]
    return (val != null && val.toString() !== '') ? val.toString() : ''
  } catch (e) {
    return ''
  }
}

/**
 * 模拟 MessageBubble.uvue 中的 getMessageProp 函数
 * 
 * 原始实现：
 *   const msgStr = JSON.stringify(msgAny)
 *   const msgObj = JSON.parse(msgStr) as UTSJSONObject
 *   const val = msgObj.get(key)
 */
export function getMessageProp(message: any, key: string): any {
  try {
    const msgStr = JSON.stringify(message)
    const msgObj = JSON.parse(msgStr)
    const val = msgObj[key]
    if (val != null) {
      return val
    }
    return ''
  } catch (e) {
    return ''
  }
}

/**
 * 模拟 isTextMessage 判断逻辑
 * 
 * 原始实现（MessageBubble.uvue）：
 *   const type = getMessageProp('type')
 *   const typeStr = type.toString()
 *   return typeStr == 'text' || msgTypeNum == 1
 */
export function isTextMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  if (msgTypeNum === 6 || typeStr === 'share') return false
  if (msgTypeNum === 10 || typeStr === 'system_notification') return false
  return typeStr === 'text' || msgTypeNum === 1
}

/**
 * 模拟 isImageMessage 判断逻辑
 */
export function isImageMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  return typeStr === 'image' || msgTypeNum === 2
}

/**
 * 模拟 parseApiMessages 输出的普通对象格式（对照组）
 */
export function createPlainMessageObject(
  id: string,
  senderId: string,
  receiverId: string,
  type: string,
  content: string,
  createTime: string
): Record<string, any> {
  return {
    id,
    senderId,
    receiverId,
    fromUserKid: senderId,
    toUserKid: receiverId,
    type,           // 字符串，如 "text"
    messageType: getMessageTypeNumber(type),
    content,
    createTime,
    status: 'sent',
    duration: 0,
  }
}

/**
 * 模拟 getMessageTypeNumber
 */
export function getMessageTypeNumber(typeStr: string): number {
  if (typeStr === 'text') return 1
  if (typeStr === 'image') return 2
  if (typeStr === 'video') return 3
  if (typeStr === 'voice') return 4
  if (typeStr === 'share') return 6
  if (typeStr === 'gift') return 7
  if (typeStr === 'system_notification') return 10
  return 1
}

// ==================== 保持性测试辅助函数 ====================

/**
 * 有效的消息类型字符串列表
 */
export const VALID_MESSAGE_TYPE_STRINGS = ['text', 'image', 'voice', 'video', 'share', 'gift', 'system_notification']

/**
 * 模拟 messageHelper.uts 中的 mergeMessagesWithoutDuplicates 函数
 *
 * 去重逻辑：
 * 1. 按 ID 去重
 * 2. 按内容+发送者+时间戳（前10位）去重
 */
export function mergeMessagesWithoutDuplicates(
  newMessages: Array<any>,
  existingMessages: Array<any>
): Array<any> {
  const existingIds: string[] = []
  const existingFingerprints: string[] = []

  for (const msg of existingMessages) {
    const msgId = getAnyString(msg, 'id')
    if (msg != null && msgId !== '') {
      existingIds.push(msgId)
    }
    const senderId = getAnyString(msg, 'senderId')
    const content = getAnyString(msg, 'content')
    const createTime = getAnyString(msg, 'createTime')
    const timePrefix = createTime.length >= 10 ? createTime.substring(0, 10) : createTime
    const fingerprint = senderId + '|' + content + '|' + timePrefix
    existingFingerprints.push(fingerprint)
  }

  const uniqueNewMessages: any[] = []
  const newMsgs = Array.isArray(newMessages) ? newMessages : []
  for (const msg of newMsgs) {
    if (msg == null) continue
    const msgId = getAnyString(msg, 'id')
    if (msgId === '') continue

    // 检查 ID 是否重复
    if (existingIds.includes(msgId)) continue

    // 检查内容指纹是否重复
    const senderId = getAnyString(msg, 'senderId')
    const content = getAnyString(msg, 'content')
    const createTime = getAnyString(msg, 'createTime')
    const timePrefix = createTime.length >= 10 ? createTime.substring(0, 10) : createTime
    const fingerprint = senderId + '|' + content + '|' + timePrefix
    if (existingFingerprints.includes(fingerprint)) continue

    uniqueNewMessages.push(msg)
    existingIds.push(msgId)
    existingFingerprints.push(fingerprint)
  }

  return [...existingMessages, ...uniqueNewMessages]
}

/**
 * 模拟 getMessageKey - 获取消息的唯一标识
 * 用于消息列表渲染的 key
 */
export function getMessageKey(message: any): string {
  const id = getAnyString(message, 'id')
  return id !== '' ? id : ''
}

/**
 * 模拟 isMessageSelf - 判断消息是否为当前用户发送
 */
export function isMessageSelf(message: any, currentUserId: string): boolean {
  const senderId = getAnyString(message, 'senderId')
  if (senderId !== '' && senderId === currentUserId) return true
  // 兼容 fromUserKid 字段
  const fromUserKid = getAnyString(message, 'fromUserKid')
  if (fromUserKid !== '' && fromUserKid === currentUserId) return true
  return false
}

/**
 * 模拟 createLocalMessage - 创建本地发送消息
 * 与 messageHelper.uts 中的 createLocalMessage 逻辑一致
 */
export function createLocalMessage(
  tempId: string,
  senderId: string,
  type: string,
  content: string,
  status: string,
  senderAvatar?: string
): Record<string, any> {
  return {
    id: tempId,
    senderId: senderId,
    type: type,
    content: content,
    createTime: new Date().toISOString(),
    status: status,
    senderAvatar: senderAvatar ?? '',
  }
}

/**
 * 模拟 isVoiceMessage 判断逻辑
 */
export function isVoiceMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  return typeStr === 'voice' || msgTypeNum === 4
}

/**
 * 模拟 isVideoMessage 判断逻辑
 */
export function isVideoMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  return typeStr === 'video' || msgTypeNum === 3
}

/**
 * 模拟 isShareMessage 判断逻辑
 */
export function isShareMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  return typeStr === 'share' || msgTypeNum === 6
}

/**
 * 模拟 isGiftMessage 判断逻辑
 */
export function isGiftMessage(message: any): boolean {
  const type = getMessageProp(message, 'type')
  const messageType = getMessageProp(message, 'messageType')
  const typeStr = type.toString()
  const msgTypeNum = parseInt(messageType.toString())
  return typeStr === 'gift' || msgTypeNum === 7
}
