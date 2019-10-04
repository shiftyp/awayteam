import * as React from 'react'

import {
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core'

import styled from 'styled-components'

import { traceComponent, traceMetadata } from '../tracing'
import { ChatResponse } from '../types'
import { useFeatures } from '../contexts/features'

import logo from '../logo.png'

export type ChatMessageProps = {
  message: ChatResponse
}

const ChatLogPaper = styled(Paper)`
  padding-bottom: 36px;
  min-height: 100vh;
`

export const ChatMessage = traceComponent(({ message }: ChatMessageProps) => {
  const features = useFeatures()

  traceMetadata({
    features,
    messageLength: message.body.text.length,
  })

  if (features && features.useMaterialUI) {
    return (
      <ListItem>
        {features.showAvatar ? (
          <ListItemAvatar>
            <Avatar src={logo} />
          </ListItemAvatar>
        ) : null}
        <ListItemText primary={message.user} secondary={message.body.text} />
      </ListItem>
    )
  } else if (features && !features.useMaterialUI) {
    return (
      <li>
        {message.user} - {message.body.text}
      </li>
    )
  } else {
    return null
  }
})

ChatMessage.displayName = 'chat_message'
