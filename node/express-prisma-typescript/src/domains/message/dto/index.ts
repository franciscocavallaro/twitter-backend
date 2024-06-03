export class MessageDTO {
  constructor (message: MessageDTO) {
    this.id = message.id
    this.senderId = message.senderId
    this.receiverId = message.receiverId
    this.content = message.content
    this.createdAt = message.createdAt
  }

  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: Date
}
