import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
})
