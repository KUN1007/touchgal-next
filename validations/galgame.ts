import { z } from 'zod'

export const galgameSchema = z.object({
  selectedType: z.string().max(107),
  selectedLanguage: z.string().max(107),
  selectedPlatform: z.string().max(107),
  sortField: z.union([
    z.literal('created'),
    z.literal('view'),
    z.literal('download'),
    z.literal('favorite')
  ]),
  sortOrder: z.union([z.literal('asc'), z.literal('desc')]),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(24)
})
