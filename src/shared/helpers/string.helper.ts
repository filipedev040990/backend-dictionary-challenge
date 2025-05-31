export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^\d{2}\d{4,5}\d{4}$/
  return regex.test(phoneNumber)
}

export const obfuscateValue = (object: any): object => {
  const valuesToBeObfuscated = ['password']
  valuesToBeObfuscated.forEach((word) => {
    if (word in object) {
      object[word] = '[OBFUSCATED]'
    }
  })
  return object
}

export const isBcryptHash = (value: string): boolean => {
  const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/
  return bcryptRegex.test(value)
}

export const isValidString = (value: string): boolean => {
  return value !== '' && value !== undefined && value !== null
}

export const deepClone = <T>(obj: T): T => {
  return structuredClone(obj)
}
