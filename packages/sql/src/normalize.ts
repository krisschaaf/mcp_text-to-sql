export function normalizeQuestion(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}
