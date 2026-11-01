import { describe, expect, it } from 'vitest';
import { buildIosFieldViewport } from '../../../src/lib/ios-viewport';

// Browsers: an iPhone, an iPad (it says it's a Mac, with a touch screen), an Android phone and a Mac
const BROWSERS = {
	iphone: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1', platform: 'iPhone', maxTouchPoints: 5 },
	ipad: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', platform: 'MacIntel', maxTouchPoints: 5 },
	android: { userAgent: 'Mozilla/5.0 (Linux; Android 14; ONEPLUS) Chrome/130.0 Mobile Safari/537.36', platform: 'Linux armv8l', maxTouchPoints: 5 },
	mac: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', platform: 'MacIntel', maxTouchPoints: 0 }
};
const DEFAULT = 'width=device-width, initial-scale=1';

// Safari zooms the page in on a tapped field with small text: on iOS only, the viewport gets a maximum scale instead of bigger fields
describe('buildIosFieldViewport', () => {
	// iPhone and iPad: the viewport of the page, with the maximum scale
	it.each(['iphone', 'ipad'])('adds the maximum scale on %s', browser => {
		expect(buildIosFieldViewport({ browser: BROWSERS[browser], viewport: DEFAULT })).toBe(`${DEFAULT}, maximum-scale=1`);
	});

	// Other browsers never zoom on fields: their viewport stays as it is
	it.each(['android', 'mac'])('leaves the viewport alone on %s', browser => {
		expect(buildIosFieldViewport({ browser: BROWSERS[browser], viewport: DEFAULT })).toBeNull();
	});

	// A viewport that already has a maximum scale (an installed app without zoom, for example) is kept
	it('keeps a viewport that already has a maximum scale', () => {
		expect(buildIosFieldViewport({ browser: BROWSERS.iphone, viewport: `${DEFAULT}, maximum-scale=1, user-scalable=no` })).toBeNull();
	});

	// A page without a viewport starts from the one Nuxt writes by default
	it('starts from the default viewport when the page has none', () => {
		expect(buildIosFieldViewport({ browser: BROWSERS.iphone, viewport: null })).toBe(`${DEFAULT}, maximum-scale=1`);
	});
});