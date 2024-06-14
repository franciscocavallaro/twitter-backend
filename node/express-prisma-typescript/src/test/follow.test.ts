import { describe, test } from '@jest/globals'
import { prismaMock } from './config'
import * as assert from 'node:assert'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerServiceImpl } from '@domains/follower/service'
import { follow, user, user2 } from './models'

describe('Follow', () => {
  const followerService = new FollowerServiceImpl(new FollowerRepositoryImpl(prismaMock))

  test('follow', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findUnique.mockResolvedValue(user2)
    prismaMock.follow.create.mockResolvedValue(follow)

    const followerService = new FollowerServiceImpl(new FollowerRepositoryImpl(prismaMock))

    const result = await followerService.followUser(user.id, user2.id)
    assert.deepStrictEqual(result, true)
  })

  test('unfollow', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findUnique.mockResolvedValue(user2)

    prismaMock.follow.findFirst.mockResolvedValue(follow)
    prismaMock.follow.delete.mockResolvedValue(follow)

    const result = await followerService.unfollowUser(user.id, user2.id)
    assert.deepStrictEqual(result, true)
  })

  test('follow twice', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findUnique.mockResolvedValue(user2)
    prismaMock.follow.create.mockResolvedValue(follow)
    prismaMock.follow.findFirst.mockResolvedValue(null)

    await followerService.followUser(user.id, user2.id)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findUnique.mockResolvedValue(user2)
    prismaMock.follow.create.mockResolvedValue(follow)
    prismaMock.follow.findFirst.mockResolvedValue(follow)

    const result = await followerService.followUser(user.id, user2.id)
    assert.deepStrictEqual(result, false)
  })

  test('unfollow when follow does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findUnique.mockResolvedValue(user2)
    prismaMock.follow.findFirst.mockResolvedValue(null)
    const result = await followerService.unfollowUser(user.id, user2.id)
    assert.deepStrictEqual(result, false)
  })
})
