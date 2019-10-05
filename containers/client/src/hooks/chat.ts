import * as React from 'react'
import { Socket, Presence, Channel } from 'phoenix'
import { ChatMessage, ChatFeatures } from '../types'
import { traceInteractions } from '../tracing'

const createMessageStats = messages => ({
  count: messages.length,
  avgLength:
    messages.reduce((total, message) => total + message.body.text.length, 0) /
    messages.length,
})

const createOnlineStats = online => ({
  count: online.length,
})

export const useChatMessages = (
  id: string,
  user: string = '',
  features: ChatFeatures
) => {
  if (id == '') {
    throw new Error('ID must be defined and non-empty')
  }
  const [{ messages, messageStats }, addMessage] = React.useReducer(
    ({ messages }, newMessage) => {
      const nextMessages = [...messages, newMessage]
      return {
        messages: nextMessages,
        messageStats: createMessageStats(nextMessages),
      }
    },
    {
      messages: [],
      messageStats: {
        count: 0,
        avgLength: 0,
      },
    }
  )
  const [{ online, onlineStats }, updatePresences] = React.useReducer(
    ({ presences }, { type, payload }) => {
      let nextPresences = presences

      switch (type) {
        case 'presence_state':
          nextPresences = Presence.syncState(presences, payload)
          break
        case 'presence_diff':
          nextPresences = Presence.syncDiff(presences, payload)
          break
      }
      const online = Presence.list(nextPresences, listBy)

      return {
        presences: nextPresences,
        online,
        onlineStats: createOnlineStats(online),
      }
    },
    {
      online: [],
      presences: {},
      onlineStats: { count: 0 },
    }
  )

  const socketRef = React.useRef<{
    socket: Socket
    channel: Channel
  }>()

  const interaction = traceInteractions()

  React.useEffect(() => {
    const socket = new Socket('/socket', { params: { user: user, id: id } })

    socket.connect()

    const channel = socket.channel('awayteam:default')

    channel.on(
      'presence_state',
      interaction('websocket:presence_state', state => {
        updatePresences({
          type: 'presence_state',
          payload: state,
        })
      })
    )

    channel.on(
      'presence_diff',
      interaction('websocket:presence_diff', diff => {
        updatePresences({
          type: 'presence_diff',
          payload: diff,
        })
      })
    )

    channel.on(
      'message:new',
      interaction('websocket:message:new', message => {
        addMessage(message)
      })
    )

    channel
      .join()
      .receive('error', ({ reason }) => console.log('failed join', reason))
      .receive('timeout', () =>
        console.log('Networking issue. Still waiting...')
      )

    socketRef.current = { socket, channel }
  }, [user])

  const sendMessage = (message: ChatMessage) => {
    socketRef.current.channel.push('message:new', message)
  }

  const listBy = (id, { metas: metas }) => {
    return {
      id: id as string,
      user: metas[0].user as string,
      onlineAt: metas[0].online_at as number,
    }
  }

  return {
    messages,
    messageStats,
    online,
    onlineStats,
    sendMessage,
  }
}
