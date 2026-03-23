export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface SqlRequest {
  question: string
  schemaContext: string
}

export function normalizeQuestion(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}
