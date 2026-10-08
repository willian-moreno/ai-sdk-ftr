import { octokit } from '@/app/lib/octokit'
import { tool } from 'ai'
import { setTimeout } from 'timers/promises'
import z from 'zod'

export const githubProfile = tool({
  description: `
    Busca os dados públicos do perfil de um usuário do GitHub informado por parâmetro e retorna as informações do perfil no formato JSON, incluindo identificação, URLs, dados pessoais públicos, estatísticas e datas de criação/atualização.
  `,
  inputSchema: z.object({
    username: z.string().describe('O nome de usuário do GitHub.'),
  }),
  execute: async ({ username }) => {
    await setTimeout(2000)

    const response = await octokit.users.getByUsername({ username })

    return response.data
  },
})
