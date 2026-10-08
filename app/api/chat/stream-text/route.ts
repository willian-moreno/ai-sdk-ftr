import { openrouter } from '@/app/ai/open-router'
import { tools } from '@/app/ai/tools'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: openrouter.chat('openai/gpt-4o'),
    tools,
    messages: modelMessages,
    system: `
      Sempre responda em markdown, sem aspas no início ou fim da mensagem.
    `,
    stopWhen: stepCountIs(Object.keys(tools).length),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
