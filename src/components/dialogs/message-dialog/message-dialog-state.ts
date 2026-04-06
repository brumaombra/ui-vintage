import { markRaw, reactive } from "vue"
import type { Component } from "vue"

export type DialogMessageType = "Error" | "Success" | "Info"

export interface ShowMessageDialogOptions {
  type?: DialogMessageType
  title?: string
  message: string
  closeText?: string
  icon?: Component | null
}

interface MessageDialogRequest {
  id: number
  options: Required<Omit<ShowMessageDialogOptions, "icon">> & {
    icon: Component | null
  }
  resolve: () => void
}

interface MessageDialogState {
  current: MessageDialogRequest | null
  busy: boolean
}

const messageDialogQueue: MessageDialogRequest[] = []
let nextMessageDialogId = 0

export const messageDialogState: MessageDialogState = reactive({
  current: null,
  busy: false,
})

const markIcon = (icon: Component | null | undefined) => icon ? markRaw(icon) : null

const openNextMessageDialog = () => {
  messageDialogState.current = messageDialogQueue.shift() ?? null
}

const enqueueMessageDialog = (request: MessageDialogRequest) => {
  messageDialogQueue.push(request)

  if (!messageDialogState.current) {
    openNextMessageDialog()
  }
}

const clearCurrentMessageDialog = () => {
  messageDialogState.busy = false
  messageDialogState.current = null
  openNextMessageDialog()
}

export const closeMessageDialog = () => {
  const current = messageDialogState.current

  if (!current) {
    return
  }

  current.resolve()
  clearCurrentMessageDialog()
}

export const resolveActiveMessageDialog = () => {
  const current = messageDialogState.current

  if (!current || messageDialogState.busy) {
    return
  }

  current.resolve()
  clearCurrentMessageDialog()
}

export const showMessageDialog = (options: ShowMessageDialogOptions) => {
  return new Promise<void>((resolve) => {
    enqueueMessageDialog({
      id: nextMessageDialogId += 1,
      options: {
        type: options.type ?? "Info",
        title: options.title ?? "",
        message: options.message,
        closeText: options.closeText ?? "Close",
        icon: markIcon(options.icon),
      },
      resolve,
    })
  })
}