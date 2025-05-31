import { TokenRepositoryData, TokenRepositoryInterface } from '@/domain/repositories/token-repository.interface'
import { prismaClient } from '../prisma-client'

export default class TokenRepository implements TokenRepositoryInterface {
  async save(data: TokenRepositoryData): Promise<void> {
    await prismaClient.token.create({ data })
  }

  async get(token: string): Promise<TokenRepositoryData | null> {
    const tokenEixsting = await prismaClient.token.findFirst({ where: { token } })
    return tokenEixsting ?? null
  }

  async delete(id: string): Promise<void> {
    await prismaClient.token.delete({ where: { id } })
  }
}
