# AGENTS.md

Repository guidance for agentic coding assistants working in `mcp_text-to-sql`.

## Project Snapshot

- This repository now has a minimal workspace scaffold with `apps/web`, `apps/server`, `packages/shared`, and `packages/sql`.
- Present files include a root `package.json`, workspace tsconfigs, starter source files, and `db/migrations` plus `db/seeds`.
- The README still defines the product direction: React ChatUI, TypeScript MCP service, SQL/LLM integration, Postgres, and local Kubernetes.
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files are present in this snapshot.
- If those rule files appear later, follow them first and keep this file aligned.

## Working Approach

- Prefer small, focused changes.
- Preserve the current intent of the project: MVP-first, then incremental improvements.
- Do not invent architecture that is not already in the repository without calling it out clearly.
- If code is added later, keep the implementation simple and easy to remove or replace.
- When uncertain, read the existing files before editing.

## Build / Test / Lint

- Root scripts live in `package.json`.
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
- Test one file: `npm run test:unit -- packages/shared/src/index.test.ts`
- Workspace package scripts currently use `tsc`, `vite`, `tsx`, and Vitest.
- MCP dev server: `npm run dev:mcp --workspace @mcp-text-to-sql/server`
- Database setup: `npm run db:migrate` and `npm run db:seed` load variables from `.env` via `dotenv-cli`.

## Single-Test / Targeted Execution 

- Prefer `npm run test:unit -- path/to/file.test.ts` for a single Vitest file.
- If a future package uses another runner, prefer the narrowest supported command for that runner.

## File and Directory Conventions

- Keep top-level files minimal and intentional.
- Use descriptive names for future directories such as `src/`, `tests/`, `scripts/`, and `docs/`.
- Prefer colocating test files near the code they verify unless the repository adopts a different pattern.
- Do not add generated artifacts unless they are required and documented.

## TypeScript / JavaScript Style

- Prefer TypeScript for application code.
- Use explicit types at module boundaries, public APIs, and function returns when helpful.
- Avoid `any`; use `unknown` and narrow it when input is untrusted.
- Keep functions small and purpose-driven.
- Prefer `const` over `let`; avoid `var`.
- Use named exports by default unless a file clearly benefits from a default export.

## Imports

- Group imports in this order: built-ins, external packages, internal modules, relative imports.
- Prefer the shortest correct relative path.
- Remove unused imports; do not keep them for readability.
- If the project later adopts path aliases, use them consistently.

## Formatting

- Match the existing formatter if one is introduced.
- Prefer Prettier-compatible formatting for new JS/TS files.
- Keep line length reasonable; break long expressions for readability.
- Use semicolons only if the surrounding codebase does.
- Use double quotes or single quotes consistently with the established project style.

## Naming Conventions

- Use `camelCase` for variables, functions, and parameters.
- Use `PascalCase` for React components, classes, and type/interface names.
- Use `UPPER_SNAKE_CASE` for constants that are truly constant.
- Name files after the primary export or responsibility.
- Prefer clear domain names over abbreviations.

## React / UI Guidance

- Favor functional components and hooks.
- Keep component props explicit and small.
- Avoid over-abstracting shared UI before repetition exists.
- Preserve accessibility basics: semantic elements, keyboard support, labels, and focus states.
- Keep UI state predictable and local when possible.

## Backend / MCP / SQL Guidance

- Treat SQL generation carefully; avoid unsafe string concatenation.
- Prefer parameterized queries and explicit validation.
- Be cautious with prompt construction and LLM outputs; validate before execution.
- Separate orchestration from data access when the codebase grows.
- Log useful context without leaking secrets, credentials, or raw user data.

## Error Handling

- Fail fast on invalid input.
- Throw or return errors with enough context to debug the problem.
- Do not swallow exceptions silently.
- Preserve original errors when wrapping them.
- Handle async failures explicitly; do not rely on unhandled promise rejections.

## Testing Guidance

- Add tests for behavior, not implementation details.
- Cover edge cases for parsing, validation, SQL assembly, and external integrations.
- Mock network/LLM/database boundaries in unit tests.
- Prefer deterministic tests over snapshot-heavy tests unless the UI benefits from snapshots.
- Keep test names descriptive and scenario-based.

## Git / Safety Rules

- Do not overwrite user changes.
- Do not delete files unless the task explicitly requires it.
- Avoid destructive commands like `git reset --hard` unless explicitly requested.
- Do not add secrets, credentials, or environment files to version control.

## Agent Workflow

- Inspect the repo before editing.
- Update this file if you add scripts, structure, or style rules that future agents should know.
- If you introduce a toolchain, record the exact commands here.
- Keep the guidance practical, not aspirational.
- When in doubt, choose the simplest change that satisfies the request.

## Open Items

- Add the actual MCP server implementation and wire it to the shared contracts.
- Add a true MCP transport layer when the service contract is finalized.
- Expand the web UI from scaffold to chat/result interaction.
- Add repository-specific cursor/copilot rules if those files appear later.

## Current Constraints

- Treat the README as the only source of product intent until application code appears.
- Do not assume a framework, package manager, or runtime that is not in the tree.
- Prefer answers that reflect the repository's current emptiness rather than generic best practices.
- If you add infrastructure, keep it minimal and explain any new assumptions.

## Future Tooling Notes

- If Node tooling is introduced, record the exact install and verification commands here.
- If Python tooling is introduced, record the version and the canonical virtualenv workflow.
- If container or Kubernetes manifests are added, document the local cluster command sequence.
- If database migrations are added, document the safest migration and rollback path.
- If environment variables are added, keep `.env` values local and update the loader module.

## Documentation Rules

- Keep this file updated whenever repo structure or scripts change.
- Prefer concrete commands over prose when documenting workflows.
- Mirror any future rule files here so agents have one canonical reference.
- Revisit this file after the first meaningful code addition to remove stale scaffolding notes.
