export { default as MessageDialog } from "./MessageDialog.vue";
export {
    closeMessageDialog,
    messageDialogState,
    resolveActiveMessageDialog,
    showMessageDialog,
} from "./message-dialog-state";
export type {
    DialogMessageType,
    ShowMessageDialogOptions,
} from "./message-dialog-state";