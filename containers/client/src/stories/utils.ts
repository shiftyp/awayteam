export const makeMessage = (message: string) => ({
  user: "Ryan",
  timestamp: Date.now(),
  body: {
    text: message,
  },
})
