import { defineNuxtPlugin } from 'nuxt/app';
import { setBackButtonRouter } from '../lib/back-button';

// Give the router of the app to the back button of dialogs (it hands the history over while a dialog is open)
export default defineNuxtPlugin(nuxtApp => {
	setBackButtonRouter(nuxtApp.$router as { listening: boolean });
});