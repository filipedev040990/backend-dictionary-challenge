import { z } from 'zod'

export const exampleSchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  contractType: z.string(),
  admissionDate: z.string(),
  baseSalary: z.number().min(0),
})
