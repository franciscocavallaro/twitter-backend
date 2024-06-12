import { Server } from 'socket.io'
import { db, ForbiddenException, Logger, socketAuth } from '@utils'
import { MessageRepositoryImpl } from '@domains/message/repository/message.repository.impl'
import { ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository'

export const socketServer = new Server()
const messageRepository = new MessageRepositoryImpl(db)
const conversationService = new ConversationServiceImpl(new ConversationRepositoryImpl(db))

socketServer.use((socket, next) => {
  try {
    socketAuth(socket)
    next()
  } catch (error) {
    next(new ForbiddenException())
  }
})

socketServer.on('connection', async (socket) => {
  Logger.info(`Socket connected: ${socket.id}`)

  const userId = socket.data.userId

  const conversationsPreview = await conversationService.getConversationsByUserId(userId)
  socket.emit('conversations', conversationsPreview)

  socket.on('joinRoom', async (data) => {
    const id = data.conversationId
    await socket.join(id)
  })

  socket.on('message', async (data) => {
    try {
      await messageRepository.createMessage(data.senderId, data.receiverId, data.conversationId, data.content, data.createdAt)
      socket.to(data.conversationId).emit('message', data)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })

  socket.on('disconnect', () => {
    Logger.info(`Socket disconnected: ${socket.id}`)
  })
})
