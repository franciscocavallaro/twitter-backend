import { Router } from 'express'
import { db } from '@utils'
import { MessageRepository, MessageRepositoryImpl } from '@domains/message/repository'
import { MessageServiceImpl } from '@domains/message/service/message.service.impl'
import { MessageService } from '@domains/message/service/message.service'

export const messageRouter = Router()

const messageRepository: MessageRepository = new MessageRepositoryImpl(db)
const messageService: MessageService = new MessageServiceImpl(messageRepository)

messageRouter.get('/get/:conversation_id', async (req, res) => {
  const { userId } = res.locals.context
  const conversationId = req.params.conversation_id
  const messages = await messageService.getMessages(userId, conversationId)
  return res.status(200).json({ messages })
})
