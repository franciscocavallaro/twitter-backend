import { describe, expect } from '@jest/globals'
import { PostServiceImpl } from '@domains/post/service'
import { prismaMock } from './config'
import { PostRepositoryImpl } from '@domains/post/repository'
import { CreatePostInputDTO } from '@domains/post/dto'
import { ReactionType } from '@prisma/client'
import { ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { comment, likeReaction, post, post2, postDTO, postsDTOS, retweetReaction, user } from './models'
import { createTestScheduler } from 'jest'

describe('Post', () => {
  const postService = new PostServiceImpl(new PostRepositoryImpl(prismaMock))
  const reactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(prismaMock))

  test('should create a post successfully', async () => {
    prismaMock.post.create.mockResolvedValue(post)

    const result = await postService.createPost('1', new CreatePostInputDTO())
    expect(result).toEqual(postDTO)
  })

  test('should get posts by author', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const posts = [post, post2]
    prismaMock.post.findMany.mockResolvedValue(posts)

    const result = await postService.getPostsByAuthor(user.id, '1')
    expect(result).toEqual(postsDTOS)
  })

  test('should not get non-existent post ', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)

    await expect(postService.getPost('1', '1')).rejects.toThrow('Not found. Couldn\'t find post')
  })

  test('like reaction to a post', async () => {
    prismaMock.post.findUnique.mockResolvedValue(post)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.create.mockResolvedValue(likeReaction)
    const reactionResponse = await reactionService.reactPost('1', '2', ReactionType.LIKE)
    expect(reactionResponse).toEqual(true)
  })

  test('retweet reaction to a post', async () => {
    prismaMock.post.findUnique.mockResolvedValue(post)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.create.mockResolvedValue(retweetReaction)
    const reactionResponse = await reactionService.reactPost('1', '2', ReactionType.RETWEET)
    expect(reactionResponse).toEqual(true)
  })

  test('should not react to a post twice', async () => {
    prismaMock.reaction.findFirst.mockResolvedValue(likeReaction)
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)

    const reaction = await reactionService.reactPost('1', '2', ReactionType.LIKE)
    expect(reaction).toEqual(false)
  })

  test('should not react to an non-existent post', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)
    await expect(reactionService.reactPost('1', '2', ReactionType.LIKE)).rejects.toThrow('Not found. Couldn\'t find post')
  })

  test('should comment on a post', async () => {
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.post.create.mockResolvedValue(comment)
    const commentResponse = await postService.commentPost('1', '1', 'content')

    const commentDTO = {
      id: comment.id,
      authorId: comment.authorId,
      content: comment.content,
      images: comment.images,
      createdAt: comment.createdAt,
      relatedTo: comment.isRelatedTo
    }
    expect(commentDTO).toEqual(commentResponse)
  })

  test('should not comment on a non-existent post', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)
    await expect(postService.commentPost('1', '1', 'content')).rejects.toThrow('Not found. Couldn\'t find post')
  })
})
