import { Conversation } from '@prisma/client'

export interface ConversationService {

  createConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>
}
