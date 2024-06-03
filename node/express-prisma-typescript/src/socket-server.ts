import { Server } from 'socket.io'
import { db, ForbiddenException, Logger, socketAuth } from '@utils'
import { MessageRepositoryImpl } from '@domains/message/repository/message.repository.impl'

export const socketServer = new Server()
const messageRepository = new MessageRepositoryImpl(db)

socketServer.use((socket, next) => {
  try {
    socketAuth(socket)
    next()
  } catch (error) {
    next(new ForbiddenException())
  }
})

socketServer.on('connection', (socket) => {
  Logger.info(`Socket connected: ${socket.id}`)

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
