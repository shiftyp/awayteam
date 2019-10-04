export type ChatMessage = {
  text: string
}

export type ChatResponse = {
  body: ChatMessage
  user: string
  timestamp: number
}

export type ChatFeatures = Partial<{
  useMaterialUI: boolean
  showAvatar: boolean
  slowDownLog: boolean
}>
