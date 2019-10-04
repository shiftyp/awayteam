import * as React from 'react'
import {
  randomSpanId,
  randomTraceId,
  convertPerfTime,
  popTraceMetadata,
  isSSR,
  randomComponentId,
} from './utils'
import {
  Tracer,
  BatchRecorder,
  ExplicitContext,
  Annotation,
  TraceId,
  option,
} from 'zipkin'
import { HttpLogger } from 'zipkin-transport-http'
import { SchedulerInteractions } from 'scheduler'
import { string } from 'prop-types'

const httpLogger = new HttpLogger({
  endpoint: `/api/v1/spans`,
})
const recorder = new BatchRecorder({
  logger: httpLogger,
})
const tracer = new Tracer({
  ctxImpl: new ExplicitContext(),
  recorder,
})

export type TracingContext = {
  start: (spanId: string, ...ids: string[]) => void
  traceMetadata: (spanId: string, metadata: any) => void
  record: (
    componentId: string,
    spanId: string,
    name: string,
    startTime: number,
    actualDuration: number,
    phase: string,
    interactions: Set<SchedulerInteractions>
  ) => void
}

export const TracingContext = React.createContext<TracingContext>(null)

const makeSpan = (
  tracer: Tracer,
  name: string,
  metadata: any,
  startPerfTime: number,
  endPerfTime: number,
  traceId: string,
  perfId?: string,
  parentId?: string
) => {
  if (parentId) {
    tracer.setId(
      new TraceId({
        traceId: traceId,
        parentId: new option.Some(parentId),
        spanId: perfId,
        sampled: new option.Some(true),
      })
    )
  } else {
    tracer.setId(
      new TraceId({
        traceId,
        parentId: option.None,
        spanId: perfId,
        sampled: new option.Some(true),
      })
    )
  }

  tracer.recordServiceName(
    isSSR
      ? 'ssr'
      : `${window.location.origin}${window.location.pathname}?${window.location.search}#${window.location.hash}`
  )
  tracer.recordAnnotation(
    new Annotation.LocalOperationStart(name),
    convertPerfTime(startPerfTime)
  )

  const recordAttribs = (attribs: any, prefix: string = '') => {
    Object.keys(attribs).forEach(key => {
      if (attribs[key] !== null && attribs[key] !== undefined) {
        if (typeof attribs[key] === 'object') {
          recordAttribs(attribs[key], prefix + key + '.')
        } else {
          tracer.recordBinary(prefix + key, attribs[key])
        }
      }
    })
  }

  if (metadata !== null) {
    recordAttribs(metadata)
  }

  tracer.recordBinary('honeycomb.dataset', 'awayteam')

  tracer.recordAnnotation(
    new Annotation.LocalOperationStop(),
    convertPerfTime(endPerfTime)
  )

  return tracer
}

const interactionBuffer: {
  [key: string]: {
    traceId: string
    spanId: string
  }
} = {}

const useTracing = () => {
  const context = React.useContext(TracingContext)

  if (context !== null) {
    return context
  }

  const traceBuffer: {
    [key: string]: {
      spanId: string
      name: string
      metadata: any
      parentId: string
      isRoot: boolean
      traceId: string
    }
  } = {}

  const makeInteractionSpan = (
    tracer: Tracer,
    parentId,
    parentInteractionId,
    endTimestamp,
    { name, id, timestamp: startTimestamp }: SchedulerInteractions
  ) => {
    const recorded = !!interactionBuffer[id]

    if (!recorded) {
      const metadata = popTraceMetadata(id)
      const { spanId, traceId } = (interactionBuffer[id] = {
        spanId: randomSpanId(),
        traceId: parentInteractionId
          ? interactionBuffer[parentInteractionId].traceId
          : randomTraceId(),
      })

      makeSpan(
        tracer,
        name,
        {
          isInteraction: true,
          interactionId: id,
          ...metadata,
        },
        startTimestamp,
        endTimestamp,
        traceId,
        spanId,
        parentId
      )
    }

    return interactionBuffer[id]
  }

  return {
    start: (spanId: string, ...ids: string[]) => {
      const isRoot = !ids.length || !traceBuffer[ids[0]]
      const parentId = isRoot ? '' : ids[0]
      const traceId = isRoot ? randomTraceId() : traceBuffer[parentId].traceId

      traceBuffer[spanId] = {
        spanId,
        name: '',
        metadata: {},
        parentId,
        isRoot,
        traceId,
      }
    },
    traceMetadata: (spanId: string, metadata: any) => {
      traceBuffer[spanId].metadata = metadata
    },
    record: (
      componentId: string,
      spanId: string,
      name: string,
      startTime: number,
      actualDuration: number,
      reactPhase: string,
      interactions: Set<SchedulerInteractions>
    ) => {
      if (!traceBuffer[spanId]) {
        // This is a child updating from a stale parent render
        return
      }

      const endTimestamp = performance.now()
      const { metadata, isRoot } = traceBuffer[spanId]
      let { parentId, traceId } = traceBuffer[spanId]

      delete traceBuffer[spanId]

      setTimeout(() => {
        let innerParentId = ''
        let parentInteractionId = null
        interactions.forEach(interaction => {
          const { spanId, traceId: interactionTraceId } = makeInteractionSpan(
            tracer,
            innerParentId,
            parentInteractionId,
            endTimestamp,
            interaction
          )
          innerParentId = spanId
          if (isRoot) {
            parentId = spanId
          }
          traceId = interactionTraceId
          parentInteractionId = interaction.id
        })

        makeSpan(
          tracer,
          name,
          {
            reactPhase,
            componentId,
            ...metadata,
          },
          startTime,
          startTime + actualDuration,
          traceId,
          spanId,
          parentId
        )
      })
    },
  }
}

type MetadataHook = (metadata: any) => void

const [connectMetadataHook, internalHook] = (() => {
  const errorHook = () => {
    if (!isSSR) {
      console.error('tracingMetadata can only be added in a traceComponent')
    }
  }
  let hook: (metadata: any) => void = errorHook

  return [
    (newHook: (metadata: any) => void) => {
      hook = newHook
      return () => (hook = errorHook)
    },
    (metadata: any) => hook(metadata),
  ] as [(newHook: MetadataHook) => () => void, MetadataHook]
})()

export const traceMetadata = internalHook

export const traceComponent = <P extends {}>(
  Component: React.FunctionComponent<P>
) => {
  if (isSSR) {
    return Component
  }

  const Wrapper: React.FunctionComponent<P> = (props, ...rest) => {
    const [componentId] = React.useState(randomComponentId())
    const spanId = randomSpanId()
    const { start, traceMetadata, record } = useTracing()

    start(spanId)

    const disconnect = connectMetadataHook((metadata: any) =>
      traceMetadata(spanId, metadata)
    )

    const childStart = (childId: string, ...ids: string[]) =>
      start(childId, ...ids, spanId)

    const ret = (
      <TracingContext.Provider
        value={{ start: childStart, traceMetadata, record }}
      >
        <React.Profiler
          id={Wrapper.displayName}
          onRender={(
            name,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interactions
          ) => {
            record(
              componentId,
              spanId,
              name,
              startTime,
              actualDuration,
              phase,
              interactions
            )
          }}
        >
          {Component(props, ...rest)}
        </React.Profiler>
      </TracingContext.Provider>
    )

    disconnect()

    return ret
  }

  Object.keys(Component).forEach(key => {
    Wrapper[key] = Component[key]
  })

  return Wrapper
}

export const createElement = (Component: any, props: any, ...children: any) => {
  if (Component instanceof Function) {
    if (!(Component.prototype instanceof React.Component)) {
      return React.createElement(traceComponent(Component), props, children)
    }
  }

  return React.createElement(Component, props, ...children)
}
