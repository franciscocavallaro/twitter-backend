import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CommentDTO, CreatePostInputDTO, PostDTO } from '../dto'
import { NotFoundException } from '@utils'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const followRelations = await this.db.follow.findMany({
      where: {
        followerId: userId
      },
      select: {
        followedId: true
      }
    })
    const followedUsers = followRelations.map((follow: { followedId: string }) => follow.followedId)

    // Then, fetch the posts
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      where: {
        isRelatedTo: null,
        OR: [
          { author: { privacy: 'PUBLIC' } },
          {
            AND: [
              { author: { privacy: 'PRIVATE' } },
              {
                authorId: {
                  in: followedUsers
                }
              }
            ]
          }
        ]
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | CommentDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    if (!post) {
      return null
    }
    if (post.isRelatedTo === null) {
      return new PostDTO(post)
    }
    return new CommentDTO({
      ...post,
      relatedTo: post.isRelatedTo
    })
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    const author = await this.db.user.findUnique({
      where: {
        id: authorId
      }
    })
    if (!author) {
      throw new NotFoundException('user')
    }
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async getAuthorByPost (postId: string): Promise<string> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    })
    if (!post) {
      throw new NotFoundException('post')
    }
    return post.authorId
  }

  async comment (userId: string, postId: string, content: string, images: string[], createdAt: Date, updatedAt: Date): Promise<CommentDTO> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    if (!post) {
      throw new Error('Post not found')
    }
    const comment = await this.db.post.create({
      data: {
        authorId: userId,
        isRelatedTo: postId,
        content,
        images,
        createdAt,
        updatedAt
      }
    })
    return new CommentDTO({
      ...comment,
      relatedTo: postId
    })
  }

  async getCommentsByUserId (userId: string): Promise<CommentDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        isRelatedTo: {
          not: null
        },
        authorId: userId
      }
    })
    if (comments.length === 0) {
      return []
    }
    return comments.map(comment => new CommentDTO({ ...comment, relatedTo: comment.isRelatedTo ?? '' }))
  }

  async getCommentsByPost (postId: string, options: CursorPagination): Promise<CommentDTO[]> {
    const comments = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        isRelatedTo: postId
      }
    })
    if (comments.length === 0) {
      return []
    }

    const reactions = await Promise.all(comments.map(async comment =>
      await this.db.reaction.findMany({
        where: {
          postId: comment.id
        }
      })
    ))

    const commentsWithReactions = comments.map((comment, index) => ({
      comment,
      reactionsCount: reactions[index].length
    }))

    commentsWithReactions.sort((a, b) => b.reactionsCount - a.reactionsCount)

    const sortedComments = commentsWithReactions.map(item => new CommentDTO({ ...item.comment, relatedTo: postId }))

    return sortedComments
  }

  async getLikesPerPost (postId: string): Promise<number> {
    const likes = await this.db.reaction.findMany({
      where: {
        postId,
        type: 'LIKE'
      }
    })
    return likes.length
  }

  async getRetweetsPerPost (postId: string): Promise<number> {
    const retweets = await this.db.reaction.findMany({
      where: {
        postId,
        type: 'RETWEET'
      }
    })
    return retweets.length
  }
}
