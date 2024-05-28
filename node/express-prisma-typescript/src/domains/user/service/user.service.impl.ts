import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { signedURL } from '@s3-bucket'
import { Privacy } from '@prisma/client'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async uploadProfilePic (userId: string): Promise<string> {
    const url = await signedURL(userId + ' profile-pic')
    await this.repository.uploadProfilePic(userId, userId + ' profile-pic')
    return url
  }

  async getPrivacy (userId: string): Promise<Privacy> {
    return await this.repository.getPrivacy(userId)
  }

  async getUserByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    return await this.repository.getByUsername(username, options)
  }
}
