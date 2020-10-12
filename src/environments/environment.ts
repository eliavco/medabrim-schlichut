// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	baseTitle: {
		en: 'Medabrim Shlichut',
		he: 'מדברים שליחות'
	},
	images: {
		logoTrans: 'assets/logo.png',
		homeBack: 'assets/hero/radio.jpg',
		aboutBack: 'assets/about/radio.jpg',
		listenBack: 'assets/about/radio.jpg',
		avatar: 'assets/logo.png'
	},
	sources: {
		apple: 'https://podcasts.apple.com/us/podcast/%D7%9E%D7%93%D7%91%D7%A8%D7%99%D7%9D-%D7%A9%D7%9C%D7%99%D7%97%D7%95%D7%AA/id1494510589?ign-mpt=uo%3D4',
		google: 'https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9kOGRiMjk0L3BvZGNhc3QvcnNz',
		radiopublic: 'https://radiopublic.com/-69rK4Q',
		spotify: 'https://open.spotify.com/show/1qd3pcCBlhuOrq3bNy9aY1',
		pocketCasts: 'https://pca.st/8ny5zl4j',
		breaker: 'https://www.breaker.audio/mdbrym-shlykhvt',
		rss: 'https://anchor.fm/s/d8db294/podcast/rss',
	},
	languages: {
		he: {
			flag: 'assets/flag/israel.jpg',
			dir: 'rtl',
			name: 'עברית',
			link: 'https://localhost:4200'
		},
		en: {
			flag: 'assets/flag/uk.jpg',
			dir: 'ltr',
			name: 'English',
			link: 'https://localhost:4201'
		}
	},
	mailService: 'https://email-cohen.herokuapp.com/send',
	destinationMailService: 'medabrimshlichut@gmail.com',
	production: false,
	artwork: [
		{ src: '/assets/artworks/logo-square96.png', sizes: '96x96', type: 'image/png' },
		{ src: '/assets/artworks/logo-square128.png', sizes: '128x128', type: 'image/png' },
		{ src: '/assets/artworks/logo-square192.png', sizes: '192x192', type: 'image/png' },
		{ src: '/assets/artworks/logo-square256.png', sizes: '256x256', type: 'image/png' },
		{ src: '/assets/artworks/logo-square384.png', sizes: '384x384', type: 'image/png' },
		{ src: '/assets/artworks/logo-square512.png', sizes: '512x512', type: 'image/png' },
	]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
