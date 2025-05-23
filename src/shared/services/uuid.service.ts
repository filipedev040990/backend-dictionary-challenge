import { UUIDServiceInterface } from '@/domain/services/uuid.service.interface'
import { randomUUID } from 'crypto'

export default class UUIDService implements UUIDServiceInterface {
  generate(): string {
    return randomUUID()
  }
}
