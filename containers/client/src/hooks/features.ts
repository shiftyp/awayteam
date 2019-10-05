import * as React from 'react'
import axios from 'axios'
import { traceInteractions, wrap } from '../tracing'

export const getFeatures = (id: string) => {
  const [features, updateFeatures] = React.useState(null)
  const interaction = traceInteractions()

  React.useEffect(
    interaction('fetch:features', () => {
      axios.get(`/session/${id}`).then(
        wrap(({ data }) => {
          console.log('Using features', JSON.stringify(data, null, '  '))
          updateFeatures(data)
        })
      )
    }),
    [id]
  )

  return features
}
