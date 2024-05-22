import { ReactionType } from '@prisma/client'

export interface ReactionRepository {

  reactPost: (postId: string, reactorId: string, reaction: ReactionType) => Promise<boolean>
  deleteReaction: (postId: string, reactorId: string, reaction: ReactionType) => Promise<boolean>
}
