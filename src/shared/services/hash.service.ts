import { HashServiceInterface } from '@/domain/services/hash-service.interface'
import bcrypt from 'bcrypt'

export default class HashService implements HashServiceInterface {
  async generateHash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
