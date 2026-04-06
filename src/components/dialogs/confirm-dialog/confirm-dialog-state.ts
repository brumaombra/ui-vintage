import { markRaw, reactive } from "vue"
import type { Component } from "vue"

export type DialogButtonVariant = "default" | "outline" | "ghost"

export interface ShowConfirmDialogOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonType?: DialogButtonVariant
  cancelButtonType?: DialogButtonVariant
  icon?: Component | null
  onConfirm?: (() => void | Promise<void>) | null
  onCancel?: (() => void | Promise<void>) | null
}

interface ConfirmDialogRequest {
  id: number
  options: Required<Omit<ShowConfirmDialogOptions, "icon" | "onConfirm" | "onCancel">> & {
    icon: Component | null
    onConfirm: (() => void | Promise<void>) | null
    onCancel: (() => void | Promise<void>) | null
  }
  resolve: (value: boolean) => void
}

interface ConfirmDialogState {
  current: ConfirmDialogRequest | null
  busy: boolean
}

const confirmDialogQueue: ConfirmDialogRequest[] = []
let nextConfirmDialogId = 0

export const confirmDialogState: ConfirmDialogState = reactive({
  current: null,
  busy: false,
})

const markIcon = (icon: Component | null | undefined) => icon ? markRaw(icon) : null

const openNextConfirmDialog = () => {
  confirmDialogState.current = confirmDialogQueue.shift() ?? null
}

const enqueueConfirmDialog = (request: ConfirmDialogRequest) => {
  confirmDialogQueue.push(request)

  if (!confirmDialogState.current) {
    openNextConfirmDialog()
  }
}

const clearCurrentConfirmDialog = () => {
  confirmDialogState.busy = false
  confirmDialogState.current = null
  openNextConfirmDialog()
}

export const closeConfirmDialog = () => {
  const current = confirmDialogState.current

  if (!current) {
    return
  }

  current.resolve(false)
  clearCurrentConfirmDialog()
}

export const cancelActiveConfirmDialog = async () => {
  const current = confirmDialogState.current

  if (!current || confirmDialogState.busy) {
    return
  }

  confirmDialogState.busy = true

  try {
    await current.options.onCancel?.()
    current.resolve(false)
  } finally {
    clearCurrentConfirmDialog()
  }
}

export const confirmActiveDialog = async () => {
  const current = confirmDialogState.current

  if (!current || confirmDialogState.busy) {
    return
  }

  confirmDialogState.busy = true

  try {
    await current.options.onConfirm?.()
    current.resolve(true)
  } finally {
    clearCurrentConfirmDialog()
  }
}

export const showConfirmDialog = (options: ShowConfirmDialogOptions) => {
  return new Promise<boolean>((resolve) => {
    enqueueConfirmDialog({
      id: nextConfirmDialogId += 1,
      options: {
        title: options.title ?? "Confirm",
        message: options.message,
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        confirmButtonType: options.confirmButtonType ?? "default",
        cancelButtonType: options.cancelButtonType ?? "outline",
        icon: markIcon(options.icon),
        onConfirm: options.onConfirm ?? null,
        onCancel: options.onCancel ?? null,
      },
      resolve,
    })
  })
}