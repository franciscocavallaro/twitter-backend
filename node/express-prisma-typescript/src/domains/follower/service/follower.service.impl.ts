import { FollowerService } from '@domains/follower/service/follower.service'
import { FollowerRepository } from '@domains/follower/repository/follower.repository'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { db, NotFoundException, ValidationException } from '@utils'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

  async followUser (userId: string, followedId: string): Promise<boolean> {
    if (userId === followedId) {
      throw new ValidationException([{ message: 'You cannot follow yourself' }])
    }
    const followedUser = await this.userService.getUser(followedId)
    if (!followedUser) {
      throw new NotFoundException('user')
    }
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
