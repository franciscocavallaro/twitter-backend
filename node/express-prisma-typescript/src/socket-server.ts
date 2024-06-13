import { Server } from 'socket.io'
import { db, ForbiddenException, Logger, socketAuth, ValidationException } from '@utils'
import { MessageRepositoryImpl } from '@domains/message/repository/message.repository.impl'
import { ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository'

export const socketServer = new Server()
const messageRepository = new MessageRepositoryImpl(db)
const conversationService = new ConversationServiceImpl(new ConversationRepositoryImpl(db))

// Create a Map to store socket ids and the conversation ids they are connected to
const socketRooms = new Map()

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
    const userId = socket.data.userId

    const userConversations = await conversationService.getConversationsByUserId(userId)
    if (!userConversations) return new ValidationException([{ message: 'User does not have any conversations' }])
    const isUserPartOfConversation = userConversations.some(conversation => conversation.id === id)

    if (!isUserPartOfConversation) {
      socket.emit('error', 'You are not part of this conversation')
      return
    }

    await socket.join(id)
    socketRooms.set(socket.id, id) // Store the socket id and the conversation id it is connected to
  })

  socket.on('message', async (data) => {
    try {
      if (socketRooms.get(socket.id) !== data.conversationId) {
        socket.emit('error', 'You are not connected to this conversation')
        return
      }
      await messageRepository.createMessage(data.senderId, data.receiverId, data.conversationId, data.content, data.createdAt)
      socket.to(data.conversationId).emit('message', data)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })

  socket.on('disconnect', () => {
    Logger.info(`Socket disconnected: ${socket.id}`)
    socketRooms.delete(socket.id)
  })
})
