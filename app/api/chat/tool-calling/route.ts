import { openrouter } from '@/app/ai/open-router'
import { tools } from '@/app/ai/tools'
import { generateText, isStepCount } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest) {
  const result = await generateText({
    model: openrouter.chat('openai/gpt-4o'),
    tools,
    prompt: "Quantos repositórios públicos o usuário 'willian-moreno' possui no GitHub?",
    stopWhen: isStepCount(2),
    onStepEnd: async (step) => {
      console.log('Step completed:', step)
    },
  })

  return NextResponse.json({ message: result.text })
}
