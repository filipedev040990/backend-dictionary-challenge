export interface HttpServiceInterface {
  get: <T>(params?: any) => Promise<T>
}
