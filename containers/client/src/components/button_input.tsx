import * as React from 'react'
import { trace, traceComponent, traceMetadata } from '../tracing'
import { useFeatures } from '../contexts/features'
import { Toolbar, TextField, Button } from '@material-ui/core'

export type ButtonInputProps = {
  name: string
  onChange?: (value: string) => void
  onClick?: (value: string) => void
}

export const ButtonInput: React.FunctionComponent<
  ButtonInputProps
> = traceComponent(
  ({ name, onClick = () => {}, onChange = () => {}, children }) => {
    const [value, updateValue] = React.useState<string>('')
    const features = useFeatures()

    traceMetadata({
      features,
    })

    const inputName = `set-${name}`
    const buttonName = `submit-${name}`

    const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      trace(
        'event:button_input:onchange',
        () => {
          const newValue = e.target.value

          updateValue(newValue)
          onChange(newValue)
        },
        { features }
      )
    }

    const _onClick = () => {
      trace(
        'event:button_input:onclick',
        () => {
          onClick(value)
          updateValue('')
        },
        { features }
      )
    }

    if (features && features.useMaterialUI) {
      return (
        <Toolbar>
          <TextField name={inputName} value={value} onChange={_onChange} />
          <Button name={buttonName} type="button" onClick={_onClick}>
            {children}
          </Button>
        </Toolbar>
      )
    } else if (features && !features.useMaterialUI) {
      return (
        <form>
          <input name={inputName} value={value} onChange={_onChange} />
          <button name={buttonName} type="button" onClick={_onClick}>
            {children}
          </button>
        </form>
      )
    } else {
      return null
    }
  }
)

ButtonInput.displayName = 'button_input'
