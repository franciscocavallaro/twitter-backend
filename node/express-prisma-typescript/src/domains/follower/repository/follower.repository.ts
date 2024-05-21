export interface FollowerRepository {
  followUser: (userId: string, followedId: string) => Promise<boolean>
  unfollowUser: (userId: string, followerId: string) => Promise<boolean>
}
