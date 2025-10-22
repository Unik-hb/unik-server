import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { fileURLToPath } from 'node:url'
import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createPropertyListing(
  data: Prisma.PropertyCreateManyInput
) {
  await prisma.property.create({
    data,
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
