export interface SaveDictionaryUsecaseInterface {
  execute: (words: string[]) => Promise<void>
}
