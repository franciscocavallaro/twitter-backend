import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient, Privacy } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'
import { NotFoundException } from '@utils'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user
      ? new UserViewDTO({
        id: user.id,
        name: user.username,
        username: user.username,
        profilePicture: user.profilePic
      })
      : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async uploadProfilePic (userId: string, url: string): Promise<string> {
    const updatedUser = await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePic: url
      }
    })
    return updatedUser.profilePic
  }

  async getPrivacy (userId: string): Promise<Privacy> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) throw new NotFoundException('user')
    return user?.privacy
  }

  async getByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    const user = await this.db.user.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        username: {
          contains: username
        }
      }
    })
    return user.map(user => new UserViewDTO({
      id: user.id,
      name: user.username,
      username: user.username,
      profilePicture: user.profilePic
    }))
  }
}
