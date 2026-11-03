import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { setMessageToastPosition } from '../components/message-toast/message-toast-state';
import type { MessageToastPosition } from '../components/message-toast/message-toast-state';

// Show the toasts where the app chose (the module option toast.position)
export default defineNuxtPlugin(() => {
	const position = (useRuntimeConfig().public.uiVintageToast as { position?: MessageToastPosition } | undefined)?.position;
	if (position) setMessageToastPosition(position);
});