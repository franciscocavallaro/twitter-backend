import { Privacy, ReactionType } from '@prisma/client'

export const user = {
  id: '1',
  email: 'francisco@gmail.com',
  name: 'francisco',
  password: '123456',
  username: 'francisco',
  privacy: Privacy.PUBLIC,
  profilePic: 'url_to_profile_pic',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const user2 = {
  id: '2',
  email: 'cavallaro@gmail.com',
  name: 'Cavallaro',
  password: '123456',
  username: 'cavallaro',
  privacy: Privacy.PUBLIC,
  profilePic: 'url_to_profile_pic',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const post = {
  id: '1',
  authorId: '1',
  title: 'Test post',
  content: 'This is a test post',
  images: [],
  isRelatedTo: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const post2 = {
  id: '2',
  authorId: user.id,
  title: 'Test post 2',
  content: 'This is a test post 2',
  images: [],
  isRelatedTo: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const postDTO = {
  id: '1',
  authorId: '1',
  content: 'This is a test post',
  images: [],
  createdAt: new Date()
}

export const postsDTOS = [{
  id: '1',
  authorId: user.id,
  content: 'This is a test post',
  images: [],
  createdAt: new Date()
}, {
  id: '2',
  authorId: user.id,
  content: 'This is a test post 2',
  images: [],
  createdAt: new Date()
}]

export const follow = {
  id: '1',
  followerId: user.id,
  followedId: user2.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const follow2 = {
  id: '2',
  followerId: '2',
  followedId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const conversation = {
  id: '1',
  user1: user.id,
  user2: user2.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const messageData = {
  id: '1',
  senderId: user.id,
  receiverId: user2.id,
  conversationId: conversation.id,
  content: 'content',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const likeReaction = {
  id: '1',
  userId: '1',
  postId: '1',
  type: ReactionType.LIKE,
  reactorId: '2',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const retweetReaction = {
  id: '2',
  userId: '1',
  postId: '1',
  type: ReactionType.RETWEET,
  reactorId: '2',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const comment = {
  id: '2',
  authorId: '1',
  title: 'Test comment',
  content: 'This is a test comment',
  images: [],
  isRelatedTo: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}
