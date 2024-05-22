import { ReactionType } from '@prisma/client'

export interface ReactionService {

  reactPost: (postId: string, reactorId: string, reaction: ReactionType) => Promise<boolean>
  deleteReaction: (postId: string, reactorId: string, reaction: ReactionType) => Promise<boolean>
}
