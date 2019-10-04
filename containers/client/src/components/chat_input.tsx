import * as React from 'react'

import { traceComponent, traceMetadata, trace } from '../tracing'
import { useFeatures } from '../contexts/features'
import { useChat } from '../contexts/chat'
import { ButtonInput } from './button_input'

export const ChatInput = traceComponent(() => {
  const { sendMessage } = useChat()
  const features = useFeatures()

  traceMetadata({
    features,
  })

  return (
    <ButtonInput
      name="message"
      onClick={text => {
        trace(
          'event:chat_input:onclick',
          () => {
            sendMessage({ text })
          },
          { features }
        )
      }}
    >
      Send Message
    </ButtonInput>
  )
})

ChatInput.displayName = 'chat_input'
