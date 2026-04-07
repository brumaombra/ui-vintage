import { h, markRaw, reactive, render } from "vue"
import type { Component } from "vue"

export type DialogMessageType = "Error" | "Success" | "Info"

export interface ShowMessageDialogOptions {
  type?: DialogMessageType
  title?: string
  message: string
  closeText?: string
  icon?: Component | null
  closeButtonIcon?: Component | null
}

interface MessageDialogRequest {
  id: number
  options: Required<Omit<ShowMessageDialogOptions, "icon" | "closeButtonIcon">> & {
    icon: Component | null
    closeButtonIcon: Component | null
  }
  resolve: () => void
}

interface MessageDialogState {
  current: MessageDialogRequest | null
  busy: boolean
  isOpen: boolean
}

const messageDialogQueue: MessageDialogRequest[] = []
let nextMessageDialogId = 0
const DIALOG_CLOSE_DURATION_MS = 300
let closeTimer: ReturnType<typeof setTimeout> | null = null
let messageDialogMountPromise: Promise<void> | null = null

const MESSAGE_DIALOG_ROOT_ID = "theme-vintage-message-dialog-root"

export const messageDialogState: MessageDialogState = reactive({
  current: null,
  busy: false,
  isOpen: false,
})

const markIcon = (icon: Component | null | undefined) => icon ? markRaw(icon) : null

const ensureMessageDialogMounted = () => {
  if (typeof document === "undefined") {
    return Promise.resolve()
  }

  const existingRoot = document.getElementById(MESSAGE_DIALOG_ROOT_ID)

  if (existingRoot) {
    return Promise.resolve()
  }

  if (messageDialogMountPromise) {
    return messageDialogMountPromise
  }

  messageDialogMountPromise = (async () => {
    const { default: MessageDialog } = await import("./MessageDialog.vue")

    if (document.getElementById(MESSAGE_DIALOG_ROOT_ID)) {
      return
    }

    const container = document.createElement("div")
    container.id = MESSAGE_DIALOG_ROOT_ID
    document.body.appendChild(container)
    render(h(MessageDialog), container)
  })().finally(() => {
    messageDialogMountPromise = null
  })

  return messageDialogMountPromise
}

const openNextMessageDialog = () => {
  const nextDialog = messageDialogQueue.shift() ?? null

  messageDialogState.current = nextDialog
  messageDialogState.isOpen = Boolean(nextDialog)
}

const enqueueMessageDialog = (request: MessageDialogRequest) => {
  messageDialogQueue.push(request)

  if (!messageDialogState.current) {
    openNextMessageDialog()
  }
}

const clearCurrentMessageDialog = () => {
  messageDialogState.busy = false
  messageDialogState.isOpen = false
  messageDialogState.current = null
  openNextMessageDialog()
}

const scheduleCloseCurrentMessageDialog = () => {
  if (!messageDialogState.current || !messageDialogState.isOpen) {
    return
  }

  messageDialogState.isOpen = false

  if (closeTimer) {
    clearTimeout(closeTimer)
  }

  closeTimer = setTimeout(() => {
    closeTimer = null
    clearCurrentMessageDialog()
  }, DIALOG_CLOSE_DURATION_MS)
}

export const closeMessageDialog = () => {
  const current = messageDialogState.current

  if (!current || !messageDialogState.isOpen) {
    return
  }

  current.resolve()
  scheduleCloseCurrentMessageDialog()
}

export const resolveActiveMessageDialog = () => {
  const current = messageDialogState.current

  if (!current || messageDialogState.busy) {
    return
  }

  current.resolve()
  scheduleCloseCurrentMessageDialog()
}

export const showMessageDialog = (options: ShowMessageDialogOptions) => {
  void ensureMessageDialogMounted()

  return new Promise<void>((resolve) => {
    enqueueMessageDialog({
      id: nextMessageDialogId += 1,
      options: {
        type: options.type ?? "Info",
        title: options.title ?? "",
        message: options.message,
        closeText: options.closeText ?? "Close",
        icon: markIcon(options.icon),
        closeButtonIcon: markIcon(options.closeButtonIcon),
      },
      resolve,
    })
  })
}