export interface HttpServiceInterface {
  get: <T>(url: string) => Promise<T>
}
