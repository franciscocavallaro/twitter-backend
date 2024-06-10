import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { UserRepositoryImpl } from '@domains/user/repository'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { user } from './models'

describe('User', () => {
  const authService = new AuthServiceImpl(new UserRepositoryImpl(prismaMock))
  const userService: UserService = new UserServiceImpl(new UserRepositoryImpl(prismaMock))

  test('should create a user', async () => {
    prismaMock.user.create.mockResolvedValue(user)
    await authService.signup(user)
    prismaMock.user.findUnique.mockResolvedValue(user)
    const createdUser = await prismaMock.user.findUnique({ where: { id: user.id } })
    expect(createdUser).toEqual(user)
  })

  test('should get a user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    const userViewDTO = await userService.getUser(user.id)

    const expectedUserViewDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePic
    }

    expect(userViewDTO).toEqual(expectedUserViewDTO)
  })

  test('should not get an non-existent user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(userService.getUser('2')).rejects.toThrow('Not found. Couldn\'t find user')
  })
})
