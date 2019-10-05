import * as React from 'react'
import { Paper, List } from '@material-ui/core'
import styled from 'styled-components'

import { traceComponent } from '../tracing'
import { useFeatures } from '../contexts/features'
import { ChatMessage } from './chat_message'
import { ChatResponse } from '../types'

const ChatLogPaper = styled(Paper)`
  padding-bottom: 36px;
  min-height: 100vh;
`

type ChatLogProps = {
  messages: ChatResponse[]
}

export const ChatLog: React.FunctionComponent<ChatLogProps> = traceComponent(
  ({ messages }) => {
    const features = useFeatures()

    if (features && features.slowDownLog) {
      for (let i = 0; i < 3e6; i++) {}
    }
    if (features && features.useMaterialUI) {
      return (
        <ChatLogPaper>
          <List>
            {messages
              .map(message => <ChatMessage message={message} />)
              .reverse()}
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
  }
)

ChatLog.displayName = 'chat_log'
