import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { MessageRepositoryImpl } from '@domains/message/repository'
import { ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository'
import { MessageServiceImpl } from '@domains/message/service'
import { ForbiddenException } from '@utils'
import { conversation, messageData, user, user2 } from './models'

describe('Message', () => {
  const messageRepository = new MessageRepositoryImpl(prismaMock)
  const messageService = new MessageServiceImpl(messageRepository)
  const conversationService = new ConversationServiceImpl(new ConversationRepositoryImpl(prismaMock))

  test('send message', async () => {
    prismaMock.conversation.create.mockResolvedValue(conversation)
    await conversationService.createConversation(user.id, user2.id)

    prismaMock.conversation.findFirst.mockResolvedValue(conversation)
    await messageRepository.isUserPartOfConversation('1', '1')

    prismaMock.message.create.mockResolvedValue(messageData)
    const message = await messageRepository.createMessage('1', '2', '1', 'content', new Date())
    expect(message).toEqual(messageData)
  })

  test('send message to a not existing conversation', async () => {
    prismaMock.conversation.findFirst.mockResolvedValue(null)
    const message = await messageRepository.createMessage('1', '2', '1', 'content', new Date())
    expect(message).toBeNull()
  })

  test('prevent user from sending a message in a conversation they are not part of', async () => {
    prismaMock.conversation.findFirst.mockResolvedValue(conversation)
    prismaMock.message.create.mockResolvedValue(messageData)

    prismaMock.conversation.findFirst.mockResolvedValue(null)

    const message = await messageRepository.createMessage('1', '2', '1', 'content', new Date())
    expect(message).toBeNull()
  })

  test('prevent user from getting messages from a conversation they are not part of', async () => {
    messageRepository.getConversation = jest.fn().mockResolvedValue(conversation)

    prismaMock.conversation.findFirst.mockResolvedValue(conversation)
    prismaMock.message.findMany.mockResolvedValue([])
    messageRepository.isUserPartOfConversation = jest.fn().mockResolvedValue(false)

    await expect(messageService.getMessages(user.id, conversation.id)).rejects.toThrow(ForbiddenException)
  })

  test('unable to send a message with an empty content', async () => {
    prismaMock.conversation.findFirst.mockResolvedValue(conversation)
    const message = await messageRepository.createMessage('1', '2', '1', '', new Date())
    expect(message).toBeNull()
  })
})
