import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

import { schemaMetadata } from '@mcp-text-to-sql/sql'

import { buildQueryResponse } from './query.js'

const server = new Server(
  {
    name: 'mcp-text-to-sql',
    version: '0.1.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_schema',
      description: 'Return the current database schema metadata for query planning.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false
      }
    },
    {
      name: 'query_database',
      description: 'Generate read-only SQL from a natural language question and execute it.',
      inputSchema: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: 'Natural language question about the database.'
          }
        },
        required: ['question'],
        additionalProperties: false
      }
    }
  ]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'list_schema') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(schemaMetadata, null, 2)
        }
      ]
    }
  }

  if (request.params.name !== 'query_database') {
    throw new Error(`Unknown tool: ${request.params.name}`)
  }

  const question = String((request.params.arguments as Record<string, unknown> | undefined)?.question ?? '').trim()

  if (!question) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'question is required' }, null, 2)
        }
      ],
      isError: true
    }
  }

  const response = await buildQueryResponse(question)

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response, null, 2)
      }
    ]
  }
})

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

void main()
