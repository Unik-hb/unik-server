import { randomUUID } from 'node:crypto'
import { env } from '../../src/env/env'
import type { Environment } from 'vitest/environments'
import { execSync } from 'node:child_process'

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schemaId = randomUUID()

    const databaseURL = generateUniqueDatabaseURL(schemaId)

    env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy', { stdio: 'inherit' })

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
        )

        await prisma.$disconnect()
      },
    }
  },
}
