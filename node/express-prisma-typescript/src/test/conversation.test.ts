import * as assert from 'node:assert'
import { ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository'
import { prismaMock } from './config'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerServiceImpl } from '@domains/follower/service'
import { describe } from '@jest/globals'
import { conversation, follow, follow2, user, user2 } from './models'

describe('Conversation', () => {
  const followerRepo = new FollowerRepositoryImpl(prismaMock)
  const followerService = new FollowerServiceImpl(followerRepo)
  const conversationRepo = new ConversationRepositoryImpl(prismaMock)
  const conversationService = new ConversationServiceImpl(conversationRepo)

  test('create conversation', async () => {
    prismaMock.follow.create.mockResolvedValue(follow)
    await followerService.followUser('1', '2')
    prismaMock.follow.findFirst.mockResolvedValue(follow)
    let exists = await followerRepo.doesRelationExist('1', '2')
    assert.deepStrictEqual(exists, follow.id)

    prismaMock.follow.create.mockResolvedValue(follow2)
    await followerService.followUser('2', '1')
    prismaMock.follow.findFirst.mockResolvedValue(follow2)
    exists = await followerRepo.doesRelationExist('2', '1')
    assert.deepStrictEqual(exists, follow2.id)

    prismaMock.conversation.create.mockResolvedValue(conversation)

    const result = await conversationService.createConversation(user.id, user2.id)

    assert.deepStrictEqual(result, conversation)
  })

  test('create conversation with no follow', async () => {
    prismaMock.follow.findFirst.mockResolvedValue(null)
    const result = await conversationService.createConversation(user.id, user2.id)
    assert.deepStrictEqual(result, null)
  })

  test('should not create a new conversation with the same users', async () => {
    prismaMock.conversation.findFirst.mockResolvedValue(conversation)
    const result = await conversationService.createConversation(user.id, user2.id)
    assert.deepStrictEqual(result, null)
  })
})
