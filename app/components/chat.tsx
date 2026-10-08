'use client'

import { tools } from '@/app/ai/tools'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, InferUITools, UIDataTypes, UIMessage } from 'ai'
import { Bot, User2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChatScrollToBottomButton } from './chat-scroll-to-bottom-button'
import { GithubProfile } from './github-profile'
import { Markdown } from './markdown'
import { MessageInput } from './message-input'
import { ToolLoading } from './tool-loading'

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export function Chat() {
  const { messages, status, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/stream-text',
    }),
  })

  const [textInput, setTextInput] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'instant',
      })
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0 && status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, status])

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault()
    setTextInput(event.target.value)
  }

  function handleSubmit() {
    if (!textInput.trim()) return

    sendMessage({ text: textInput })
    setTextInput('')
  }

  return (
    <>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="space-y-6 absolute inset-0 overflow-y-scroll scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-zinc-900 scrollbar-track-transparent"
        >
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className="flex items-start gap-3"
              >
                {message.role === 'user' && (
                  <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
                    <User2 className="size-4 text-zinc-100" />
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="size-7 rounded-md bg-zinc-900 flex items-center justify-center">
                    <Bot className="size-4 text-zinc-400" />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex-1 prose prose-invert prose-zinc prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
                    {message.parts.map((part, partIndex) => {
                      const partKey = `${message.id}-part-${partIndex}`

                      if (part.type === 'text') {
                        return <Markdown key={partKey}>{part.text}</Markdown>
                      }

                      if (part.type === 'tool-githubProfile' && part.state === 'input-available') {
                        return (
                          <ToolLoading
                            key={part.toolCallId}
                            text="Carregando informações do GitHub..."
                          />
                        )
                      }

                      if (part.type === 'tool-httpFetch' && part.state === 'input-available') {
                        return (
                          <ToolLoading
                            key={part.toolCallId}
                            text="Realizando requisição HTTP..."
                          />
                        )
                      }

                      if (part.type === 'tool-githubProfile' && part.state === 'output-available') {
                        return (
                          <GithubProfile
                            key={part.toolCallId}
                            user={part.output}
                          />
                        )
                      }

                      if (part.type === 'tool-httpFetch' && part.state === 'output-available') {
                        return (
                          <Markdown key={part.toolCallId}>{JSON.stringify(part.output)}</Markdown>
                        )
                      }

                      return null
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        <ChatScrollToBottomButton
          containerRef={containerRef}
          scrollRef={bottomRef}
        />
      </div>

      <MessageInput
        disabled={['submitted', 'streaming'].includes(status)}
        value={textInput}
        onValueChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  )
}
