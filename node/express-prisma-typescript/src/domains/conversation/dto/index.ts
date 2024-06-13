import { UserViewDTO } from '@domains/user/dto'

export class ConversationPreviewDTO {
  constructor (conversationPreview: ConversationPreviewDTO) {
    this.id = conversationPreview.id
    this.user1Id = conversationPreview.user1Id
    this.user2Id = conversationPreview.user2Id
    this.lastMessage = conversationPreview.lastMessage
    this.lastMessageUserViewDTO = conversationPreview.lastMessageUserViewDTO
  }

  id: string
  user1Id: string
  user2Id: string
  lastMessage: string | null
  lastMessageUserViewDTO: UserViewDTO | null
}
