import * as React from 'react'
import axios from 'axios'
import { trace, wrap } from '../tracing'

export const getFeatures = (id: string) => {
  const [features, updateFeatures] = React.useState(null)

  React.useEffect(() => {
    trace('fetch:features', () => {
      axios.get(`/session/${id}`).then(
        wrap(({ data }) => {
          console.log('Using features', JSON.stringify(data, null, '  '))
          updateFeatures(data)
        })
      )
    })
  }, [id])

  return features
}
