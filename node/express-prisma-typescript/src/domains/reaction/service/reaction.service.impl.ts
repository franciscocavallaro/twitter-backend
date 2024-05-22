import { ReactionService } from '@domains/reaction/service/reaction.service'
import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '@domains/reaction/repository'
import { db } from '@utils'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { PostRepositoryImpl } from '@domains/post/repository'
import { PostService, PostServiceImpl } from '@domains/post/service'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  followService: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))
  postService: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

  async reactPost (postId: string, reactorId: string, reaction: ReactionType): Promise<boolean> {
    if (!Object.values(ReactionType).includes(reaction)) {
      throw new Error('Invalid reaction type')
    }
    const authorId = await this.postService.getAuthorByPost(postId)
    if (await this.followService.doesRelationExist(reactorId, authorId) === null) {
      throw new Error('User is not allowed to delete reaction')
    }
    return await this.repository.reactPost(postId, reactorId, reaction)
  }

  async deleteReaction (postId: string, reactorId: string, reaction: ReactionType): Promise<boolean> {
    if (!Object.values(ReactionType).includes(reaction)) {
      throw new Error('Invalid reaction type')
    }
    const authorId = await this.postService.getAuthorByPost(postId)
    if (await this.followService.doesRelationExist(reactorId, authorId) === null) {
      throw new Error('User is not allowed to delete reaction')
    }
    return await this.repository.deleteReaction(postId, reactorId, reaction)
  }
}
