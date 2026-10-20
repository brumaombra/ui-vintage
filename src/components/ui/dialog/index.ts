export { default as Dialog } from './Dialog.vue';
export { default as DialogClose } from './DialogClose.vue';
export { default as DialogContent } from './DialogContent.vue';
export { default as DialogDescription } from './DialogDescription.vue';
export { default as DialogFooter } from './DialogFooter.vue';
export { default as DialogHeader } from './DialogHeader.vue';
export { default as DialogOverlay } from './DialogOverlay.vue';
export { default as DialogScrollContent } from './DialogScrollContent.vue';
export { default as DialogTitle } from './DialogTitle.vue';
export { default as DialogTrigger } from './DialogTrigger.vue';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

// Max width per dialog size (sm is the compact default)
export const dialogSizeClasses: Record<DialogSize, string> = {
	sm: 'sm:max-w-106.25',
	md: 'sm:max-w-md',
	lg: 'sm:max-w-xl',
	xl: 'sm:max-w-2xl'
};