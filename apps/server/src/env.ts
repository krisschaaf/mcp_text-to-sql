import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

function findEnvFilePath(startDirectory: string): string | null {
  let currentDirectory = startDirectory

  while (true) {
    const candidate = join(currentDirectory, '.env')

    try {
      readFileSync(candidate, 'utf8')
      return candidate
    } catch {
      const parentDirectory = dirname(currentDirectory)

      if (parentDirectory === currentDirectory) {
        return null
      }

      currentDirectory = parentDirectory
    }
  }
}

function readEnvFile(): Record<string, string> {
  const envFilePath = findEnvFilePath(process.cwd())

  if (!envFilePath) {
    return {}
  }

  try {
    const file = readFileSync(envFilePath, 'utf8')
    const entries: Record<string, string> = {}

    for (const line of file.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
      entries[key] = value
    }

    return entries
  } catch {
    return {}
  }
}

const envFile = readEnvFile()

function readString(name: string): string | null {
  const value = envFile[name]?.trim()
  return value ? value : null
}

function readNumber(name: string, fallback: number): number {
  const value = readString(name)
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env = {
  port: readNumber('PORT', 8787),
  databaseUrl: readString('DATABASE_URL'),
  pgSslMode: readString('PGSSLMODE')
}
