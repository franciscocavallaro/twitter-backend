import { Conversation } from '@prisma/client'
import { ConversationPreviewDTO } from '@domains/conversation/dto'

export interface ConversationRepository {

  createConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>
  getConversationFromUser: (userId: string) => Promise<ConversationPreviewDTO[]>
}
