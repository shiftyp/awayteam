import React from 'react'
import ReactDOM from 'react-dom'
import { ChatProvider } from '../contexts/chat'
import { randomUserId, trace } from '../tracing/utils'
import { traceComponent, traceMetadata } from '../tracing'
import { UserInput } from '../components/user_input'
import { FeaturesProvider } from '../contexts/features'
import styled from 'styled-components'
import { ChatInput } from './chat_input'
import { ChatLog } from './chat_log'

const Container = styled.main`
  max-height: 100vh;
  padding-bottom: 50px;
`

const ChatPage = traceComponent(() => {
  const [{ user, id }, setUser] = React.useReducer(
    ({ id }, user) => ({
      user,
      id,
    }),
    {
      user: '',
      id: randomUserId(),
    }
  )

  traceMetadata({
    sessionId: id,
  })

  return (
    <Container>
      <h1 className="page-title">AwayTeam</h1>
      <FeaturesProvider id={id}>
        {user === '' ? (
          <UserInput setUser={setUser} />
        ) : (
          <ChatProvider id={id} user={user}>
            <ChatInput />
            <ChatLog />
          </ChatProvider>
        )}
      </FeaturesProvider>
    </Container>
  )
})

ChatPage.displayName = 'chat_page'

trace('initial_render', () => {
  ReactDOM.render(<ChatPage />, document.getElementById('root'))
})
