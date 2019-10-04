import {
  unstable_trace,
  unstable_wrap,
  unstable_getCurrent,
  SchedulerInteractions,
} from 'scheduler/tracing'

const SPAN_ID_BYTES = 8
const TRACE_ID_BYTES = 16
const USER_ID_BYTES = 4
const COMPONENT_ID_BYTES = 2

const traceMetadataBuffer: {
  [key: string]: any
} = {}

export const isSSR = typeof window === 'undefined'

export const makeRandomId = (bytes: number) => (): string => {
  if (isSSR) return '1'

  const crypto = window.crypto

  let spanId = ''
  const randomBytes = new Uint8Array(bytes)
  crypto.getRandomValues(randomBytes)
  for (let i = 0; i < bytes; i++) {
    const hexStr = randomBytes[i].toString(16)

    // Zero pad bytes whose hex values are single digit.
    if (hexStr.length === 1) spanId += '0'

    spanId += hexStr
  }
  return spanId
}

export const randomSpanId = makeRandomId(SPAN_ID_BYTES)
export const randomTraceId = makeRandomId(TRACE_ID_BYTES)
export const randomUserId = makeRandomId(USER_ID_BYTES)
export const randomComponentId = makeRandomId(COMPONENT_ID_BYTES)

export const convertPerfTime = (perfTime: number) =>
  Math.trunc((Date.now() - performance.now() + perfTime) * 1e3)

export const trace = <T = any>(
  name: string,
  cb: () => T,
  metadata: any = {},
  timestamp: number = performance.now()
) =>
  unstable_trace(name, timestamp, () => {
    const interactions: Set<SchedulerInteractions> = unstable_getCurrent()
    let values = interactions.values()
    let id = null
    let value = null
    do {
      value = values.next()
      if (!value.done) {
        id = value.value.id
      }
    } while (!value.done)

    if (id === null) {
      throw new Error('Error storing tracing interaction metadata ')
    }
    traceMetadataBuffer[id] = metadata
    return cb()
  })

export const popTraceMetadata = (id: string) => {
  const ret = traceMetadataBuffer[id]
  if (ret !== undefined) {
    delete traceMetadataBuffer[id]
  }
  return ret
}

export const wrap = unstable_wrap
