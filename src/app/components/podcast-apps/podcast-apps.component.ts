import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-podcast-apps',
	templateUrl: './podcast-apps.component.html',
	styleUrls: ['./podcast-apps.component.scss']
})
export class PodcastAppsComponent implements OnInit {
	apps: { link: string; img: string; name: string; }[] = [
		{ name: 'Apple Podcasts', link: environment.sources.apple, img: 'assets/podcast-apps/apple_podcasts.png' },
		{ name: 'Breaker', link: environment.sources.breaker, img: 'assets/podcast-apps/breaker.png' },
		{ name: 'Google Podcasts', link: environment.sources.google, img: 'assets/podcast-apps/google_podcasts.png' },
		{ name: 'Pocket Casts', link: environment.sources.pocketCasts, img: 'assets/podcast-apps/pocket_casts.png' },
		{ name: 'Radiopublic', link: environment.sources.radiopublic, img: 'assets/podcast-apps/radiopublic.png' },
		{ name: 'Spotify', link: environment.sources.spotify, img: 'assets/podcast-apps/spotify.png' },
		{ name: 'RSS', link: environment.sources.rss, img: 'assets/podcast-apps/rss.png' },
	];

	constructor() { }

	ngOnInit(): void {
	}

}
