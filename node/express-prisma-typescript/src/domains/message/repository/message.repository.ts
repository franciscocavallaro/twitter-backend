import { MessageDTO } from '@domains/message/dto'
import { Conversation } from '@prisma/client'

export interface MessageRepository {

  createMessage: (receiverId: string, senderId: string, conversationId: string, content: string, createdAt: Date) => Promise<MessageDTO | null>
  getMessagesFromConversation: (conversationId: string) => Promise<MessageDTO[]>
  isUserPartOfConversation: (userId: string, conversationId: string) => Promise<boolean>
  getConversation: (conversationId: string) => Promise<Conversation | null>
}
