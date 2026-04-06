import { h, markRaw, reactive, render } from "vue"
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
    isOpen: boolean
}

const confirmDialogQueue: ConfirmDialogRequest[] = []
let nextConfirmDialogId = 0
const DIALOG_CLOSE_DURATION_MS = 300
let closeTimer: ReturnType<typeof setTimeout> | null = null
let confirmDialogMountPromise: Promise<void> | null = null

const CONFIRM_DIALOG_ROOT_ID = "theme-vintage-confirm-dialog-root"

export const confirmDialogState: ConfirmDialogState = reactive({
    current: null,
    busy: false,
    isOpen: false,
})

const markIcon = (icon: Component | null | undefined) => icon ? markRaw(icon) : null

const ensureConfirmDialogMounted = () => {
    if (typeof document === "undefined") {
        return Promise.resolve()
    }

    const existingRoot = document.getElementById(CONFIRM_DIALOG_ROOT_ID)

    if (existingRoot) {
        return Promise.resolve()
    }

    if (confirmDialogMountPromise) {
        return confirmDialogMountPromise
    }

    confirmDialogMountPromise = (async () => {
        const { default: ConfirmDialog } = await import("./ConfirmDialog.vue")

        if (document.getElementById(CONFIRM_DIALOG_ROOT_ID)) {
            return
        }

        const container = document.createElement("div")
        container.id = CONFIRM_DIALOG_ROOT_ID
        document.body.appendChild(container)
        render(h(ConfirmDialog), container)
    })().finally(() => {
        confirmDialogMountPromise = null
    })

    return confirmDialogMountPromise
}

const openNextConfirmDialog = () => {
    const nextDialog = confirmDialogQueue.shift() ?? null

    confirmDialogState.current = nextDialog
    confirmDialogState.isOpen = Boolean(nextDialog)
}

const enqueueConfirmDialog = (request: ConfirmDialogRequest) => {
    confirmDialogQueue.push(request)

    if (!confirmDialogState.current) {
        openNextConfirmDialog()
    }
}

const clearCurrentConfirmDialog = () => {
    confirmDialogState.busy = false
    confirmDialogState.isOpen = false
    confirmDialogState.current = null
    openNextConfirmDialog()
}

const scheduleCloseCurrentConfirmDialog = () => {
    if (!confirmDialogState.current || !confirmDialogState.isOpen) {
        return
    }

    confirmDialogState.isOpen = false

    if (closeTimer) {
        clearTimeout(closeTimer)
    }

    closeTimer = setTimeout(() => {
        closeTimer = null
        clearCurrentConfirmDialog()
    }, DIALOG_CLOSE_DURATION_MS)
}

export const closeConfirmDialog = () => {
    const current = confirmDialogState.current

    if (!current || !confirmDialogState.isOpen) {
        return
    }

    current.resolve(false)
    scheduleCloseCurrentConfirmDialog()
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
        scheduleCloseCurrentConfirmDialog()
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
        scheduleCloseCurrentConfirmDialog()
    }
}

export const showConfirmDialog = (options: ShowConfirmDialogOptions) => {
    void ensureConfirmDialogMounted()

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