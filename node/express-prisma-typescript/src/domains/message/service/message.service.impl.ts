import { MessageService } from '@domains/message/service/message.service'
import { MessageRepository } from '@domains/message/repository'
import { ForbiddenException } from '@utils'
import { MessageDTO } from '@domains/message/dto'

export class MessageServiceImpl implements MessageService {
  constructor (private readonly repository: MessageRepository) {}

  async getMessages (userId: string, conversationId: string): Promise<MessageDTO[]> {
    const isPartOfConversation = await this.repository.isUserPartOfConversation(userId, conversationId)
    if (!isPartOfConversation) {
      throw new ForbiddenException()
    }
    const messages = await this.repository.getMessagesFromConversation(conversationId)
    return messages
  }
}
