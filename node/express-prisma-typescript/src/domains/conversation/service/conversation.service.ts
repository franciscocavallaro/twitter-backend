import { Conversation } from '@prisma/client'
import { ConversationPreviewDTO } from '@domains/conversation/dto'

export interface ConversationService {

  createConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>
  getConversationsByUserId: (userId: string) => Promise<ConversationPreviewDTO[] | null>
}
