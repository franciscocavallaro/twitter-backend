import { Router } from 'express'
import { ConversationService } from '@domains/conversation/service/conversation.service'
import { ConversationServiceImpl } from '@domains/conversation/service/conversation.service.impl'
import { db } from '@utils'
import { ConversationRepositoryImpl } from '@domains/conversation/repository/conversation.repository.impl'
import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'

export const conversationRouter = Router()

const conversationRepository: ConversationRepository = new ConversationRepositoryImpl(db)
const conversationService: ConversationService = new ConversationServiceImpl(conversationRepository)

conversationRouter.post('/create/:user_id', async (req, res) => {
  const { userId } = res.locals.context
  const user2Id = req.params.user_id
  const conversation = await conversationService.createConversation(userId, user2Id)

  if (conversation) {
    return res.status(200).json({ message: 'Conversation created successfully', conversation })
  } else {
    return res.status(500).json({ message: 'Conversation could not be created, you must follow the other user' })
  }
})
