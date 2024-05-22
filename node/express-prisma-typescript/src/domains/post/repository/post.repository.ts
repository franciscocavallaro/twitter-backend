import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserDTO } from '@domains/user/dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  getAuthorByPost: (postId: string) => Promise<string>
}
