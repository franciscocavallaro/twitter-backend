import { MessageRepository } from '@domains/message/repository/message.repository'
import { MessageDTO } from '@domains/message/dto'
import { Conversation, PrismaClient } from '@prisma/client'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}

  async createMessage (senderId: string, receiverId: string, conversationId: string, content: string, createdAt: Date): Promise<MessageDTO | null> {
    // check if the sender and the receiver are part of the conversation
    const conversation = await this.isUserPartOfConversation(senderId, conversationId)
    if (!conversation) {
      return null
    }
    const newMessage = await this.db.message.create({
      data: {
        senderId,
        receiverId,
        content,
        createdAt,
        conversation: {
          connect: {
            id: conversationId
          }
        }
      }
    })
    return newMessage
  }

  async getMessagesFromConversation (conversationId: string): Promise<MessageDTO[]> {
    const messages = await this.db.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return messages.map(message => new MessageDTO(message))
  }

  async isUserPartOfConversation (userId: string, conversationId: string): Promise<boolean> {
    const conversation = await this.db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            user1: userId
          },
          {
            user2: userId
          }
        ]
      }
    })
    return !!conversation
  }

  async getConversation (conversationId: string): Promise<Conversation | null> {
    const conversation = await this.db.conversation.findUnique({
      where: {
        id: conversationId
      }
    })
    return conversation
  }
}
