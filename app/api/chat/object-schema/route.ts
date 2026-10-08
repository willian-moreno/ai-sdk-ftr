import { openrouter } from '@/app/ai/open-router'
import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'

export async function GET(_: NextRequest) {
  const result = await generateObject({
    model: openrouter.chat('openai/gpt-4o'),
    schema: z.object({
      language: z.string().min(1, 'O idioma é obrigatório'),
      word: z.string().min(1, 'A palavra em outro idioma é obrigatória'),
      translation: z.string().min(1, 'A tradução para o português é obrigatória'),
      examples: z.array(
        z.object({
          sentence: z.string().min(1, 'A frase de exemplo é obrigatória'),
          translation: z.string().min(1, 'A tradução da frase de exemplo é obrigatória'),
        }),
      ),
    }),
    prompt: `
      Você é um especialista em idiomas. Escreva uma palavra em um idioma diferente do português e forneça qual a linguagem escolhida e a tradução para o português. Também escreva três exemplos de uso da palavra em frases, com a tradução para o português.
    `,
    system: 'Sempre retorne da maneira mais sucinta possível.',
  })

  return NextResponse.json({ message: result.object })
}
