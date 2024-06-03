export interface FollowerRepository {
  followUser: (userId: string, followedId: string) => Promise<boolean>
  unfollowUser: (userId: string, followerId: string) => Promise<boolean>
  doesRelationExist: (userId: string, followedId: string) => Promise<string | null>
  areFollowingEachOther: (userId: string, followedId: string) => Promise<boolean>
}
