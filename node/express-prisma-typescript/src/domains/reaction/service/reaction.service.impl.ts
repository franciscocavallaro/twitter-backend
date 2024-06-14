import { ReactionService } from '@domains/reaction/service/reaction.service'
import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '@domains/reaction/repository'
import { db, NotFoundException } from '@utils'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { PostRepositoryImpl } from '@domains/post/repository'
import { PostService, PostServiceImpl } from '@domains/post/service'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  followService: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))
  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))
  postService: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

  async reactPost (postId: string, reactorId: string, reaction: ReactionType): Promise<boolean> {
    if (!Object.values(ReactionType).includes(reaction)) {
      throw new Error('Invalid reaction type')
    }
    const authorId = await this.postService.getAuthorByPost(postId)
    const authorPrivacy = await this.userService.getPrivacy(authorId)
    if (reactorId === authorId) {
      return await this.repository.reactPost(postId, reactorId, reaction)
    }
    if (authorPrivacy !== 'PUBLIC' && await this.followService.doesRelationExist(reactorId, authorId) === null) {
      throw new Error('User is not allowed to do that reaction')
    }
    return await this.repository.reactPost(postId, reactorId, reaction)
  }

  async deleteReaction (postId: string, reactorId: string, reaction: ReactionType): Promise<boolean> {
    if (!Object.values(ReactionType).includes(reaction)) {
      throw new Error('Invalid reaction type')
    }
    const authorId = await this.postService.getAuthorByPost(postId)
    if (reactorId === authorId) {
      return await this.repository.deleteReaction(postId, reactorId, reaction)
    }
    const authorPrivacy = await this.userService.getPrivacy(authorId)
    if (authorPrivacy !== 'PUBLIC' && await this.followService.doesRelationExist(reactorId, authorId) === null) {
      throw new Error('User is not allowed to delete reaction')
    }
    return await this.repository.deleteReaction(postId, reactorId, reaction)
  }

  async getLikesByUserId (userId: string): Promise<Array<[ReactionType, string]>> {
    const author = await this.userService.getUser(userId)
    if (!author.id) {
      throw new NotFoundException('user')
    }
    const likes = await this.repository.getLikesByUserId(userId)
    if (likes.length === 0) {
      return []
    }
    return likes
  }

  async getRetweetsByUserId (userId: string): Promise<Array<[ReactionType, string]>> {
    const author = await this.userService.getUser(userId)
    if (!author.id) {
      throw new NotFoundException('user')
    }
    const retweets = await this.repository.getRetweetsByUserId(userId)
    if (retweets.length === 0) {
      return []
    }
    return retweets
  }
}
