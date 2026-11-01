// The viewport Nuxt writes when the app sets none
const DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1';

// What the helper reads from the browser
interface BrowserInfo {
	userAgent: string;
	platform: string;
	maxTouchPoints: number;
}

// iPhone, iPod and iPad (iPadOS says it's a Mac, but a Mac has no touch screen)
export const isIos = ({ userAgent, platform, maxTouchPoints }: BrowserInfo) => /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);

// The viewport that stops Safari zooming in on a tapped field with text under 16px: the page's own, with maximum-scale=1 (Safari ignores it for pinch zoom, so people can still zoom). Null when nothing needs to change: not iOS (other browsers never zoom on fields), or a maximum scale is already set
export const buildIosFieldViewport = ({ browser, viewport }: { browser: BrowserInfo; viewport?: string | null }) => {
	if (!isIos(browser)) return null;
	const current = viewport || DEFAULT_VIEWPORT;
	return /maximum-scale/.test(current) ? null : `${current}, maximum-scale=1`;
};