import { openrouter } from '@/app/ai/open-router'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest) {
  const result = await generateText({
    model: openrouter.chat('openai/gpt-4o'),
    prompt: `
      Você é um especialista em idiomas. Escreva uma palavra em um idioma diferente do português e forneça qual a linguagem escolhida e a tradução para o português.
    `,
    system: 'Sempre retorne da maneira mais sucinta possível.',
  })

  return NextResponse.json({ message: result.text })
}
