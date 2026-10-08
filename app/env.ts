import z from 'zod'

const schema = z.object({
  OPEN_ROUTER_API_KEY: z.string().min(1, 'OPEN_ROUTER_API_KEY is required'),
})

export const env = schema.parse(process.env)
