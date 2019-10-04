import * as React from 'react'
import { useChatMessages } from '../hooks/chat'
import { traceMetadata, traceComponent } from '../tracing'
import { ChatMessage, ChatFeatures, ChatResponse } from '../types'
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
}

const ChatContext = React.createContext<ChatContext>(null)

export const ChatProvider: React.FunctionComponent<
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

  return (
    <ChatContext.Provider value={{ id, user, messages, online, sendMessage }}>
      {children}
    </ChatContext.Provider>
  )
})

export const useChat = () => React.useContext(ChatContext)

ChatProvider.displayName = 'chat_provider'
