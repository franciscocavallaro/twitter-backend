import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import { db } from '@utils'
import { FollowerService } from '@domains/follower/service/follower.service'
import { FollowerServiceImpl } from '@domains/follower/service/follower.service.impl'
import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'

const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

export const followerRouter = Router()

followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const followedId = req.params.user_id

  const wasSuccessful = await service.followUser(userId, followedId)

  if (wasSuccessful) {
    return res.status(HttpStatus.OK).json({ message: 'Followed successfully' })
  } else {
    return res.status(HttpStatus.CONFLICT).json({ message: 'You already follow this user' })
  }
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const followedId = req.params.user_id

  const wasSuccessful = await service.unfollowUser(userId, followedId)

  if (wasSuccessful) {
    return res.status(HttpStatus.OK).json({ message: 'Unfollowed successfully' })
  } else {
    return res.status(HttpStatus.CONFLICT).json({ message: 'You are not following, you were not following this user' })
  }
})
