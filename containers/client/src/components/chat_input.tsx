import * as React from 'react'

import { traceComponent, traceInteractions } from '../tracing'
import { ButtonInput } from './button_input'
import { ChatMessage } from '../types'

export type ChatInputProps = {
  sendMessage: (message: ChatMessage) => void
}

export const ChatInput: React.FunctionComponent<
  ChatInputProps
> = traceComponent(({ sendMessage }) => {
  const interaction = traceInteractions()

  return (
    <ButtonInput
      name="message"
      onClick={interaction('event:chat_input:onclick', (text: string) => {
        sendMessage({ text })
      })}
    >
      Send Message
    </ButtonInput>
  )
})

ChatInput.displayName = 'chat_input'
