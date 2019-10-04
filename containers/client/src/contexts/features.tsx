import * as React from 'react'
import { ChatFeatures } from '../types'
import { getFeatures } from '../hooks/features'
import { traceComponent } from '../tracing'

export type FeaturesContext = {
  features: ChatFeatures
}

const FeaturesContext = React.createContext<FeaturesContext>({
  features: null,
})

export const FeaturesProvider: React.FunctionComponent<{
  id: string
}> = traceComponent(({ id, children }) => {
  const features = getFeatures(id)

  return (
    <FeaturesContext.Provider value={{ features }}>
      {children}
    </FeaturesContext.Provider>
  )
})

FeaturesProvider.displayName = 'features_provider'

export const useFeatures = () => React.useContext(FeaturesContext).features
