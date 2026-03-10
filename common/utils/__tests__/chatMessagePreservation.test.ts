/** Property 2: Preservation. Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { VALID_MESSAGE_TYPE_STRINGS, getAnyString, getMessageProp, createPlainMessageObject, createLocalMessage, mergeMessagesWithoutDuplicates, getMessageKey, isMessageSelf, isTextMessage, isImageMessage, isVoiceMessage, isVideoMessage, isShareMessage, isGiftMessage, getMessageTypeNumber } from './chatMessageSerializationUtils'
const messageTypeStrArb = fc.constantFrom(...VALID_MESSAGE_TYPE_STRINGS)
const idArb = fc.uuid()
const contentArb = fc.string({ minLength: 1, maxLength: 200 })
const createTimeArb = fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString())
const plainMessageArb = fc.record({ id: idArb, senderId: idArb, receiverId: idArb, type: messageTypeStrArb, content: contentArb, createTime: createTimeArb }).map(d => createPlainMessageObject(d.id, d.senderId, d.receiverId, d.type, d.content, d.createTime))
const localMessageArb = fc.record({ tempId: fc.uuid().map(u => 'temp_' + u), senderId: idArb, type: messageTypeStrArb, content: contentArb, status: fc.constantFrom('pending', 'sending', 'sent', 'failed') }).map(d => createLocalMessage(d.tempId, d.senderId, d.type, d.content, d.status))
const uniquePlainListArb = (min: number, max: number) => fc.array(plainMessageArb, { minLength: min, maxLength: max }).map(msgs => { const seen = new Set<string>(); return msgs.filter(m => { const id = m.id as string; if (seen.has(id)) return false; seen.add(id); return true }) })
const typeCheckerMap: Record<string, (msg: any) => boolean> = { text: isTextMessage, image: isImageMessage, voice: isVoiceMessage, video: isVideoMessage, share: isShareMessage, gift: isGiftMessage }
