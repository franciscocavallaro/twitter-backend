import { Router, Response, Request } from 'express'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { db } from '@utils'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import HttpStatus from 'http-status'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const postId = req.params.post_id
  const { userId } = res.locals.context
  const reaction = req.body.reaction
  const success = await service.reactPost(postId, userId, reaction)
  if (!success) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Reaction already exists' })
  }
  return res.status(HttpStatus.OK).json({ success })
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  const postId = req.params.post_id
  const { userId } = res.locals.context
  const reaction = req.body.reaction
  const success = await service.deleteReaction(postId, userId, reaction)
  if (!success) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Reaction does not exist' })
  }
  return res.status(HttpStatus.OK).json({ success })
})
