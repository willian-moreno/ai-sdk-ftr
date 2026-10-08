import { StaticToolCall, StaticToolResult } from 'ai'
import { githubProfile } from './github-profile'
import { httpFetch } from './http-fetch'

export type StaticAIToolCall = StaticToolCall<typeof tools>
export type StaticAIToolResult = StaticToolResult<typeof tools>

export const tools = { githubProfile, httpFetch }
