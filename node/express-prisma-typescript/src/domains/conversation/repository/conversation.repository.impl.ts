import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { Conversation, PrismaClient } from '@prisma/client'

export class ConversationRepositoryImpl implements ConversationRepository {
  constructor (private readonly db: PrismaClient) {}

  async createConversation (user1Id: string, user2Id: string): Promise<Conversation | null> {
    const doesConversationExist = await this.db.conversation.findFirst({
      where: {
        OR: [
          {
            user1: user1Id,
            user2: user2Id
          },
          {
            user1: user2Id,
            user2: user1Id
          }
        ]
      }
    })
    if (doesConversationExist) {
      throw new Error('Conversation already exists')
    }
    const newConversation = await this.db.conversation.create({
      data: {
        user1: user1Id,
        user2: user2Id
      }
    })
    return newConversation
  }
}
