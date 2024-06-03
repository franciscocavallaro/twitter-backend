import { FollowerService } from '@domains/follower/service/follower.service'
import { FollowerRepository } from '@domains/follower/repository/follower.repository'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async followUser (userId: string, followedId: string): Promise<boolean> {
    return await this.repository.followUser(userId, followedId)
  }

  async unfollowUser (currentUserId: string, userId: string): Promise<boolean> {
    return await this.repository.unfollowUser(currentUserId, userId)
  }

  async doesRelationExist (userId: string, followedId: string): Promise<string | null> {
    const exists = await this.repository.doesRelationExist(userId, followedId)
    if (!exists) {
      return null
    }
    return exists
  }

  async areFollowingEachOther (userId: string, followedId: string): Promise<boolean> {
    return await this.repository.areFollowingEachOther(userId, followedId)
  }
}
