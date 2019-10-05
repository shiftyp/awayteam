import * as React from 'react'
import { traceComponent, traceInteractions } from '../tracing'

import { useFeatures } from '../contexts/features'
import { ButtonInput } from './button_input'

export type UserInputProps = {
  setUser: (user: string) => void
}

export const UserInput = traceComponent(({ setUser }: UserInputProps) => {
  const interaction = traceInteractions()

  return (
    <ButtonInput
      name="user"
      onClick={interaction('event:user_input:onclick', value => {
        setUser(value)
      })}
    >
      Hail Ship
    </ButtonInput>
  )
})

UserInput.displayName = 'user_input'
