import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { Conversation, PrismaClient } from '@prisma/client'
import { ConversationPreviewDTO } from '@domains/conversation/dto'
import { UserViewDTO } from '@domains/user/dto'
import { NotFoundException } from '@utils'

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

  async getConversationFromUser (userId: string): Promise<ConversationPreviewDTO[]> {
    const conversations = await this.db.conversation.findMany({
      where: {
        OR: [
          { user1: userId },
          { user2: userId }
        ]
      }
    })

    const conversationPreviews = await Promise.all(conversations.map(async conversation => {
      const lastMessage = await this.db.message.findFirst({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'desc' }
      })
      if (!lastMessage) {
        return new ConversationPreviewDTO({
          id: conversation.id,
          user1Id: conversation.user1,
          user2Id: conversation.user2,
          lastMessage: null,
          lastMessageUserViewDTO: null
        })
      }
      const sender = await this.db.user.findUnique({
        where: { id: lastMessage.senderId },
        select: { id: true, name: true, email: true, profilePic: true, username: true }
      })

      if (!sender) {
        throw new NotFoundException('sender')
      }

      return new ConversationPreviewDTO({
        id: conversation.id,
        user1Id: conversation.user1,
        user2Id: conversation.user2,
        lastMessage: lastMessage?.content,
        lastMessageUserViewDTO: new UserViewDTO({ id: sender.id, name: sender.name, username: sender.username, profilePicture: sender.profilePic })
      })
    }))

    return conversationPreviews
  }
}
