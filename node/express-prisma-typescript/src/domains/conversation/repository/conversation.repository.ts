import { Conversation } from '@prisma/client'

export interface ConversationRepository {

  createConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>
}
