import { FollowerRepository } from '@domains/follower/repository/follower.repository'
import { PrismaClient } from '@prisma/client'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async followUser (userId: string, followedId: string): Promise<boolean> {
    const exists = await this.doesRelationExist(userId, followedId)

    if (!exists) {
      await this.db.follow.create({
        data: {
          followerId: userId,
          followedId
        }
      })
      return true
    }
    return false
  }

  async unfollowUser (userId: string, followedId: string): Promise<boolean> {
    const exists = await this.doesRelationExist(userId, followedId)

    if (!exists) {
      return false
    }
    await this.db.follow.delete({
      where: {
        id: exists
      }
    })
    return true
  }

  async doesRelationExist (userId: string, followedId: string): Promise<string | null> {
    const exists = await this.db.follow.findFirst({
      where: {
        followerId: userId,
        followedId
      }
    })
    if (exists) {
      return exists.id
    }
    return null
  }

  async areFollowingEachOther (userId: string, followedId: string): Promise<boolean> {
    const userFollows = await this.doesRelationExist(userId, followedId)
    const followedFollows = await this.doesRelationExist(followedId, userId)
    return !!userFollows && !!followedFollows
  }
}
