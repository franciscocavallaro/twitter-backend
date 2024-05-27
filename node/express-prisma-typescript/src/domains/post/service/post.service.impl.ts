import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { db, ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository'
import { FollowerRepository, FollowerRepositoryImpl } from '@domains/follower/repository'
import { Privacy } from '@prisma/client'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  userRepository: UserRepository = new UserRepositoryImpl(db)
  followerRepository: FollowerRepository = new FollowerRepositoryImpl(db)
  followerService: FollowerService = new FollowerServiceImpl(this.followerRepository)

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')

    if ((await this.checkIfPrivateAccount(post.authorId)) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followerService.doesRelationExist(userId, post.authorId)
      if (!doesFollowExist) throw new ForbiddenException()
    }

    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    const posts = await this.repository.getByAuthorId(authorId)
    if (posts.length === 0) throw new NotFoundException('post')

    if ((await this.checkIfPrivateAccount(authorId)) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followerService.doesRelationExist(userId, authorId)
      if (!doesFollowExist) throw new ForbiddenException()
    }

    return posts
  }

  async checkIfPrivateAccount (userId: string): Promise<Privacy | null> {
    const privacy = await this.userRepository.getPrivacy(userId)
    if (privacy) {
      return privacy
    }
    return null
  }

  async getAuthorByPost (postId: string): Promise<string> {
    const authorId = await this.repository.getAuthorByPost(postId)
    if (!authorId) throw new NotFoundException('post')
    return authorId
  }

  async commentPost (userId: string, postId: string, data: any): Promise<CommentDTO> {
    const authorId = await this.getAuthorByPost(postId)
    if ((await this.checkIfPrivateAccount(authorId)) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followerService.doesRelationExist(userId, authorId)
      if (!doesFollowExist) throw new ForbiddenException()
    }
    const { content, images, createdAt, updatedAt } = data
    return await this.repository.comment(userId, postId, content, images, createdAt, updatedAt)
  }

  async getCommentsByUserId (userId: string): Promise<CommentDTO[]> {
    const author = await this.userRepository.getById(userId)
    if (!author) {
      throw new NotFoundException('user')
    }
    return await this.repository.getCommentsByUserId(userId)
  }

  async getCommentsByPostId (userId: string, postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const comments = await this.repository.getCommentsByPost(postId, options)
    if (comments.length === 0) {
      throw new NotFoundException('comment')
    }
    const authorId = await this.getAuthorByPost(postId)
    if ((await this.checkIfPrivateAccount(authorId)) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followerService.doesRelationExist(userId, authorId)
      if (!doesFollowExist) throw new ForbiddenException()
    }
    return await Promise.all(
      comments.map(async (comment) => {
        const author = await this.userRepository.getById(comment.authorId)
        if (!author) {
          throw new NotFoundException('user')
        }
        const qtyLikes = await this.getLikesPerPost(comment.id)
        const qtyRetweets = await this.getRetweetsPerPost(comment.id)
        const qtyComments = await this.repository.getCommentsByPost(comment.id, { limit: 0 })
        return new ExtendedPostDTO({
          ...comment,
          author,
          qtyLikes,
          qtyRetweets,
          qtyComments: qtyComments.length
        })
      })
    )
  }

  async getLikesPerPost (postId: string): Promise<number> {
    return await this.repository.getLikesPerPost(postId)
  }

  async getRetweetsPerPost (postId: string): Promise<number> {
    return await this.repository.getRetweetsPerPost(postId)
  }
}
