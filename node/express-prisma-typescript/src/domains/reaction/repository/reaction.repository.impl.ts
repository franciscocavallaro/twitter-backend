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
