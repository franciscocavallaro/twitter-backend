import { MessageDTO } from '@domains/message/dto'

export interface MessageService {

  getMessages: (userId: string, conversationId: string) => Promise<MessageDTO[]>
}
