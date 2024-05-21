export interface FollowerService {
  followUser: (userId: string, followedId: string) => Promise<boolean>
  unfollowUser: (currentUserId: string, userId: string) => Promise<boolean>
}
