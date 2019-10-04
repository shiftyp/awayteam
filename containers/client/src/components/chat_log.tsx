import * as React from 'react'

import { Paper, List } from '@material-ui/core'

import styled from 'styled-components'

import { traceComponent, traceMetadata } from '../tracing'
import { useFeatures } from '../contexts/features'

import { ChatMessage } from './chat_message'
import { useChat } from '../contexts/chat'

const ChatLogPaper = styled(Paper)`
  padding-bottom: 36px;
  min-height: 100vh;
`

export const ChatLog = traceComponent(() => {
  const features = useFeatures()
  const { messages } = useChat()

  traceMetadata({
    features,
  })

  if (features && features.slowDownLog) {
    for (let i = 0; i < 3e6; i++) {}
  }
  if (features && features.useMaterialUI) {
    return (
      <ChatLogPaper>
        <List>
          {messages.map(message => <ChatMessage message={message} />).reverse()}
        </List>
      </ChatLogPaper>
    )
  } else if (features && !features.useMaterialUI) {
    return (
      <ul>
        {messages.map(message => <ChatMessage message={message} />).reverse()}
      </ul>
    )
  } else {
    return null
  }
})

ChatLog.displayName = 'chat_log'
