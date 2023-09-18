import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'node:child_process'
import { join } from 'path'

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL enviroment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}
const schemaId = randomUUID()
beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  if(!process.env.APPDATA) {
    throw new Error('Please provide a APPDATA enviroment variable')
  }
  const npxPath = join(process.env.APPDATA, 'npm', 'node_modules', 'npm', 'bin', 'npx.cmd');
  execSync(`${npxPath} prisma migrate deploy`)
})
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
