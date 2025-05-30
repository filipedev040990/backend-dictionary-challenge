export interface TokenServiceInterface {
  generate: (value: object) => Promise<string>
  verify: <T>(token: string) => Promise<T | null>
}
