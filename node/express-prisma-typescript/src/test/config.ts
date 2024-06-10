import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { db } from '@utils'

jest.mock('../utils/database', () => {
  const originalModule = jest.requireActual('../utils/database')
  return {
    __esModule: true,
    ...originalModule,
    db: mockDeep<PrismaClient>()
  }
})

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>
