import { h, reactive, render } from "vue"
import type { HTMLAttributes } from "vue"

export interface SetBusyOptions {
  label?: string
  class?: HTMLAttributes["class"]
  overlayClass?: HTMLAttributes["class"]
}

interface BusyIndicatorState {
  show: boolean
  label: string
  class: HTMLAttributes["class"]
  overlayClass: HTMLAttributes["class"]
}

const BUSY_INDICATOR_ROOT_ID = "ui-vintage-busy-indicator-root"

let busyIndicatorMountPromise: Promise<void> | null = null

export const busyIndicatorState: BusyIndicatorState = reactive({
  show: false,
  label: "Loading...",
  class: undefined,
  overlayClass: undefined,
})

const ensureBusyIndicatorMounted = () => {
  if (typeof document === "undefined") {
    return Promise.resolve()
  }

  const existingRoot = document.getElementById(BUSY_INDICATOR_ROOT_ID)

  if (existingRoot) {
    return Promise.resolve()
  }

  if (busyIndicatorMountPromise) {
    return busyIndicatorMountPromise
  }

  busyIndicatorMountPromise = (async () => {
    const { default: BusyIndicator } = await import("./BusyIndicator.vue")

    if (document.getElementById(BUSY_INDICATOR_ROOT_ID)) {
      return
    }

    const container = document.createElement("div")
    container.id = BUSY_INDICATOR_ROOT_ID
    document.body.appendChild(container)
    render(h(BusyIndicator), container)
  })().finally(() => {
    busyIndicatorMountPromise = null
  })

  return busyIndicatorMountPromise
}

export const setBusy = (show: boolean, options: SetBusyOptions = {}) => {
  if (show) {
    busyIndicatorState.label = options.label ?? busyIndicatorState.label ?? "Loading..."
    busyIndicatorState.class = options.class
    busyIndicatorState.overlayClass = options.overlayClass
    void ensureBusyIndicatorMounted()
  }

  busyIndicatorState.show = show

  if (!show) {
    busyIndicatorState.class = undefined
    busyIndicatorState.overlayClass = undefined
  }
}