import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { db, ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository'
import { FollowerRepository, FollowerRepositoryImpl } from '@domains/follower/repository'
import { Privacy } from '@prisma/client'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  userRepository: UserRepository = new UserRepositoryImpl(db)
  followRepository: FollowerRepository = new FollowerRepositoryImpl(db)

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

    if (await this.checkIfPrivateAccount(post.authorId) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followRepository.doesRelationExist(userId, post.authorId)
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

    if (await this.checkIfPrivateAccount(authorId) === Privacy.PRIVATE) {
      const doesFollowExist = await this.followRepository.doesRelationExist(userId, authorId)
      if (!doesFollowExist) throw new ForbiddenException()
    }

    return posts
  }

  async checkIfPrivateAccount (userId: string): Promise<Privacy | null> {
    const userDTO = await this.userRepository.getById(userId)
    if (userDTO) {
      return userDTO?.privacy
    }
    return null
  }

  async getAuthorByPost (postId: string): Promise<string> {
    const authorId = await this.repository.getAuthorByPost(postId)
    if (!authorId) throw new NotFoundException('post')
    return authorId
  }
}
