import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<PostDTO[]>
  getAuthorByPost: (postId: string) => Promise<string>
  commentPost: (userId: string, postId: string, data: any) => Promise<CommentDTO>
  getCommentsByUserId: (userId: string) => Promise<CommentDTO[]>
  getCommentsByPostId: (userId: string, postId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getLikesPerPost: (postId: string) => Promise<number>
  getRetweetsPerPost: (userId: string) => Promise<number>
}
