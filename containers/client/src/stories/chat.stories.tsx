import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { makeMessage } from "./utils"

import { Chat } from "../components/chat"

import { ChatContext } from "../contexts/chat"
import { randomUserId } from "../tracing/utils"

const { add } = storiesOf("Chat", module)

const baseChatContext: ChatContext = {
  id: randomUserId(),
  user: "Ryan",
  online: [],
  sendMessage: action("sendMessage"),
  messages: ["This is a message", "This is another message"].map(makeMessage),
}
add("Basic Chat", () => (
  <ChatContext.Provider value={baseChatContext}>
    <Chat />
  </ChatContext.Provider>
))
