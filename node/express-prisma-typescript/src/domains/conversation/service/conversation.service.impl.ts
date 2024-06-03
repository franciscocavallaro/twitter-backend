import { ConversationService } from '@domains/conversation/service/conversation.service'
import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { Conversation } from '@prisma/client'
import { FollowerRepository, FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { db } from '@utils'

export class ConversationServiceImpl implements ConversationService {
  constructor (private readonly conversationRepository: ConversationRepository) {}

  followerRepository: FollowerRepository = new FollowerRepositoryImpl(db)
  followerService: FollowerService = new FollowerServiceImpl(this.followerRepository)

  async createConversation (user1Id: string, user2Id: string): Promise<Conversation | null> {
    const canParticipate = await this.canParticipateInConversation(user1Id, user2Id)
    if (!canParticipate) {
      return null
    }
    return await this.conversationRepository.createConversation(user1Id, user2Id)
  }

  private async canParticipateInConversation (me: string, user2Id: string): Promise<boolean> {
    return await this.followerService.areFollowingEachOther(me, user2Id)
  }
}
