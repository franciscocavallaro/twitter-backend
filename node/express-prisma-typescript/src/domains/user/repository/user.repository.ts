import { SignupInputDTO } from '@domains/auth/dto'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { Privacy } from '@prisma/client'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  uploadProfilePic: (userId: string, url: string) => Promise<string>
  getPrivacy: (userId: string) => Promise<Privacy>
  getByUsername: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
}
