import { CursorPagination } from '@types'
import { CommentDTO, CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | CommentDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  getAuthorByPost: (postId: string) => Promise<string>
  comment: (
    userId: string,
    postId: string,
    content: string,
    images: string[],
    createdAt: Date,
    updatedAt: Date
  ) => Promise<CommentDTO>
  getCommentsByUserId: (userId: string) => Promise<CommentDTO[]>
  getCommentsByPost: (postId: string, options: CursorPagination) => Promise<CommentDTO[]>
  getLikesPerPost: (postId: string) => Promise<number>
  getRetweetsPerPost: (userId: string) => Promise<number>
}
