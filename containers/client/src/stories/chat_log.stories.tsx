import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import { ChatLog } from "../components/chat_log"

import { makeMessage } from "./utils"
const { add } = storiesOf("ChatLog", module)

add("ChatLog with no messages", () => <ChatLog messages={[]}></ChatLog>)
add("ChatLog with some messages", () => (
  <ChatLog
    messages={[makeMessage("Hello"), makeMessage("How are you")]}
  ></ChatLog>
))
add("ChatLog with some messages and semantic-ui", () => (
  <ChatLog
    messages={[makeMessage("Hello"), makeMessage("How are you")]}
  ></ChatLog>
))

add("ChatLog with lots of messages", () => (
  <ChatLog
    messages={[
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
      makeMessage("Hello"),
      makeMessage("How are you"),
    ]}
  ></ChatLog>
))
