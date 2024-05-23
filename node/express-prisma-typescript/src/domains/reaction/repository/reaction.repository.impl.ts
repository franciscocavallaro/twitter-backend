import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { PrismaClient, ReactionType } from '@prisma/client'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async reactPost (postId: string, reactorId: string, reactionType: ReactionType): Promise<boolean> {
    if (await this.doesReactionExist(postId, reactorId, reactionType)) {
      return false
    } else {
      await this.db.reaction.create({
        data: {
          postId,
          reactorId,
          type: reactionType
        }
      })
      return true
    }
  }

  async deleteReaction (postId: string, reactorId: string, reactionType: ReactionType): Promise<boolean> {
    if (await this.doesReactionExist(postId, reactorId, reactionType)) {
      await this.db.reaction.deleteMany({
        where: {
          postId,
          reactorId,
          type: reactionType
        }
      })
      return true
    } else {
      return false
    }
  }

  async getLikesByUserId (userId: string): Promise<Array<[ReactionType, string]>> {
    const likes = await this.db.reaction.findMany({
      where: {
        reactorId: userId,
        type: ReactionType.LIKE
      }
    })
    return likes.map(like => [like.type, 'PostId: ' + like.postId])
  }

  async getRetweetsByUserId (userId: string): Promise<Array<[ReactionType, string]>> {
    const retweets = await this.db.reaction.findMany({
      where: {
        reactorId: userId,
        type: ReactionType.RETWEET
      }
    })
    return retweets.map(retweet => [retweet.type, 'PostId: ' + retweet.postId])
  }

  async doesReactionExist (postId: string, reactorId: string, reactionType: ReactionType): Promise<boolean> {
    const reaction = await this.db.reaction.findFirst({
      where: {
        postId,
        reactorId,
        type: reactionType
      }
    })
    return !!reaction
  }
}
