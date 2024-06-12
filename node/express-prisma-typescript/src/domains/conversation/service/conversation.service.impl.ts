import { ConversationService } from '@domains/conversation/service/conversation.service'
import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { Conversation } from '@prisma/client'
import { FollowerRepository, FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { db, NotFoundException } from '@utils'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { ConversationPreviewDTO } from '@domains/conversation/dto'

export class ConversationServiceImpl implements ConversationService {
  constructor (private readonly conversationRepository: ConversationRepository) {}

  followerRepository: FollowerRepository = new FollowerRepositoryImpl(db)
  followerService: FollowerService = new FollowerServiceImpl(this.followerRepository)
  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

  async createConversation (user1Id: string, user2Id: string): Promise<Conversation | null> {
    const canParticipate = await this.canParticipateInConversation(user1Id, user2Id)
    if (!canParticipate) {
      return null
    }
    return await this.conversationRepository.createConversation(user1Id, user2Id)
  }

  async getConversationsByUserId (userId: string): Promise<ConversationPreviewDTO[] | null> {
    const user = await this.userService.getUser(userId)
    if (!user) {
      throw new NotFoundException('user')
    }
    return await this.conversationRepository.getConversationFromUser(userId)
  }

  private async canParticipateInConversation (me: string, user2Id: string): Promise<boolean> {
    return await this.followerService.areFollowingEachOther(me, user2Id)
  }
}
