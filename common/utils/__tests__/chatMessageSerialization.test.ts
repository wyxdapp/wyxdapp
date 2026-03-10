/**
 * Bug 条件探索测试 - WebSocket 实时消息 MessageType 枚举序列化失败
 *
 * 目标：在未修复代码上运行，发现反例证明 bug 存在。
 *
 * 当前（未修复）逻辑：
 * - chatService.onMessageChange 回调传递 ChatMessage 类实例数组
 * - ChatMessage.type 字段为 MessageType 枚举值（如 MessageType.TEXT）
 * - detail.uvue 的 setupMessageListeners 将 ChatMessage 实例强制转换为 UTSJSONObject
 * - getAnyString 和 getMessageProp 通过 JSON.stringify → JSON.parse 访问属性
 * - MessageType 枚举值在 JSON.stringify 时无法正确序列化为 "text" 等字符串
 * - 导致 isTextMessage() 等类型判断全部返回 false，消息气泡为空
 *
 * 故障条件：isBugCondition(input)
 *   input 是 ChatMessage 类实例
 *   AND input.type 是 MessageType 枚举值（而非字符串）
 *   AND JSON.stringify(input) 后 type 字段不等于 "text"/"image" 等字符串
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  ChatMessage,
  MessageType,
  MessageStatus,
  MessageTypeEnum,
  ALL_MESSAGE_TYPES,
  MESSAGE_TYPE_EXPECTED_STRINGS,
  getAnyString,
  getMessageProp,
  isTextMessage,
  isImageMessage,
  createPlainMessageObject,
} from './chatMessageSerializationUtils'

// ==================== 生成器 ====================

/**
 * ChatMessage 实例生成器
 * 模拟 WebSocket 实时接收的消息（type 为 MessageType 枚举实例）
 */
const chatMessageArb: fc.Arbitrary<ChatMessage> = fc.record({
  id: fc.uuid(),
  content: fc.string({ minLength: 1, maxLength: 200 }),
  typeIndex: fc.integer({ min: 0, max: ALL_MESSAGE_TYPES.length - 1 }),
  senderId: fc.uuid(),
  receiverId: fc.uuid(),
  createTime: fc.date().map(d => d.toISOString()),
  conversationId: fc.uuid(),
}).map(data => {
  const msg = new ChatMessage()
  msg.id = data.id
  msg.content = data.content
  msg.type = ALL_MESSAGE_TYPES[data.typeIndex]
  msg.senderId = data.senderId
  msg.receiverId = data.receiverId
  msg.createTime = data.createTime
  msg.conversationId = data.conversationId
  msg.status = MessageStatus.RECEIVED
  msg.isTemp = false
  return msg
})

/**
 * 普通对象消息生成器（对照组）
 * 模拟 parseApiMessages 输出的消息格式（type 为字符串）
 */
const plainMessageArb = fc.record({
  id: fc.uuid(),
  content: fc.string({ minLength: 1, maxLength: 200 }),
  type: fc.constantFrom('text', 'image', 'voice', 'video', 'share', 'gift'),
  senderId: fc.uuid(),
  receiverId: fc.uuid(),
  createTime: fc.date().map(d => d.toISOString()),
}).map(data => createPlainMessageObject(
  data.id, data.senderId, data.receiverId,
  data.type, data.content, data.createTime
))


// ==================== 属性基测试 ====================

describe('Property 1: Fault Condition - WebSocket 实时消息 MessageType 枚举序列化失败', () => {

  /**
   * 测试用例 1: ChatMessage 实例的 type 字段经 JSON.stringify 后应为字符串
   *
   * 在未修复代码上，ChatMessage.type 是 MessageTypeEnum 实例，
   * JSON.stringify 会将其序列化为对象 {"name":"TEXT","value":"text"}，
   * 而非期望的字符串 "text"。
   */
  it('ChatMessage 实例经 JSON.stringify 后 type 字段应为字符串 (如 "text")', () => {
    fc.assert(
      fc.property(
        chatMessageArb,
        (msg: ChatMessage) => {
          const serialized = JSON.stringify(msg)
          const parsed = JSON.parse(serialized)

          const expectedStr = MESSAGE_TYPE_EXPECTED_STRINGS[msg.type.name]

          // 期望行为：序列化后 type 字段应为字符串值（如 "text"）
          expect(typeof parsed.type).toBe('string')
          expect(parsed.type).toBe(expectedStr)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * 测试用例 2: getAnyString(chatMessage, 'type') 应返回 "text" 等字符串
   *
   * 模拟 detail.uvue 中 getAnyString(msg, 'type') 的调用。
   * 在未修复代码上，由于枚举序列化问题，返回值不是 "text"。
   */
  it('getAnyString(chatMessage, "type") 应返回期望的类型字符串', () => {
    fc.assert(
      fc.property(
        chatMessageArb,
        (msg: ChatMessage) => {
          const typeStr = getAnyString(msg, 'type')
          const expectedStr = MESSAGE_TYPE_EXPECTED_STRINGS[msg.type.name]

          // 期望行为：getAnyString 应返回 "text"、"image" 等字符串
          expect(typeStr).toBe(expectedStr)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * 测试用例 3: getMessageProp 的 JSON.stringify → JSON.parse 逻辑应正确处理类型判断
   *
   * 模拟 MessageBubble.getMessageProp 的序列化逻辑。
   * 在未修复代码上，isTextMessage 对 ChatMessage 实例返回 false。
   */
  it('MessageBubble 的类型判断方法对 ChatMessage 实例应返回正确结果', () => {
    fc.assert(
      fc.property(
        chatMessageArb,
        (msg: ChatMessage) => {
          const expectedTypeStr = MESSAGE_TYPE_EXPECTED_STRINGS[msg.type.name]

          // 通过 getMessageProp 获取 type 并转为字符串
          const typeProp = getMessageProp(msg, 'type')
          const typeStr = typeProp.toString()

          // 期望行为：类型字符串应匹配
          expect(typeStr).toBe(expectedTypeStr)

          // 对于 TEXT 类型消息，isTextMessage 应返回 true
          if (expectedTypeStr === 'text') {
            expect(isTextMessage(msg)).toBe(true)
          }
          // 对于 IMAGE 类型消息，isImageMessage 应返回 true
          if (expectedTypeStr === 'image') {
            expect(isImageMessage(msg)).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })


  /**
   * 测试用例 4（对照组）: parseApiMessages 输出的普通对象应正确通过所有检查
   *
   * 普通对象的 type 字段是字符串（如 "text"），
   * JSON.stringify → JSON.parse 后仍为字符串，类型判断正确。
   * 此测试在未修复代码上也应通过。
   */
  it('对照组: parseApiMessages 输出的普通对象类型判断应正确', () => {
    fc.assert(
      fc.property(
        plainMessageArb,
        (msg: Record<string, any>) => {
          const typeStr = getAnyString(msg, 'type')

          // 普通对象的 type 字段应为有效字符串
          expect(typeof msg.type).toBe('string')
          expect(typeStr).toBe(msg.type)

          // getMessageProp 也应正确返回
          const typeProp = getMessageProp(msg, 'type')
          expect(typeProp.toString()).toBe(msg.type)

          // 类型判断应正确
          if (msg.type === 'text') {
            expect(isTextMessage(msg)).toBe(true)
          }
          if (msg.type === 'image') {
            expect(isImageMessage(msg)).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
