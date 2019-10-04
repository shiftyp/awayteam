import * as React from 'react'
import { traceComponent, traceMetadata, trace } from '../tracing'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import { useFeatures } from '../contexts/features'
import { ButtonInput } from './button_input'

export type UserInputProps = {
  setUser: (user: string) => void
}

export const UserInput = traceComponent(({ setUser }: UserInputProps) => {
  const features = useFeatures()

  traceMetadata({
    features,
  })

  return (
    <ButtonInput
      name="user"
      onClick={value =>
        trace(
          'event:user_input:onclick',
          () => {
            setUser(value)
          },
          { features }
        )
      }
    >
      Hail Ship
    </ButtonInput>
  )
})

UserInput.displayName = 'user_input'
