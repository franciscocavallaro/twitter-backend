import { CursorPagination, OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'
import { Privacy } from '@prisma/client'

export interface UserService {
  deleteUser: (userId: any) => Promise<UserDTO>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  uploadProfilePic: (fileUrl: string) => Promise<string>
  getPrivacy: (userId: string) => Promise<Privacy>
  getUserByUsername: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
}
