import * as React from 'react'
import { useChatMessages } from '../hooks/chat'
import { traceMetadata, traceComponent } from '../tracing'
import { ChatMessage, ChatResponse } from '../types'
import { useFeatures } from './features'

export type ChatContext = {
  id: string
  user: string
  messages: ChatResponse[]
  online: {
    id: string
    user: string
    onlineAt: number
  }[]
  sendMessage: (message: ChatMessage) => void
}

export type ChatProviderProps = {
  id: string
  user: string
  children: (context: ChatContext) => JSX.Element
}

export const ChatRenderer: React.FunctionComponent<
  ChatProviderProps
> = traceComponent(({ children, id, user }) => {
  const features = useFeatures()
  const {
    messages,
    online,
    messageStats,
    onlineStats,
    sendMessage,
  } = useChatMessages(id, user, features)

  traceMetadata({
    messageStats,
    onlineStats,
  })

  return children({ id, user, messages, online, sendMessage })
})

ChatRenderer.displayName = 'chat_provider'
