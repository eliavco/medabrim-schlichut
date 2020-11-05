import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Title } from '@angular/platform-browser';
import Fuse from 'fuse.js';
import { Episode } from 'src/app/models/episode.model';
import { EpisodeService } from 'src/app/data/episode/episode.service';

import * as moment from 'moment';

@Component({
	selector: 'ec-listen',
	templateUrl: './listen.component.html',
	styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {
	episodes: Episode[];
	time = moment;
	locale = (window as any).loc;
	lang = (window as any).loc.substring(0, 2);
	images = environment.images;
	titles = {
		en: 'Listen',
		he: 'האזן'
	};
	searchString = '';
	fuse;
	online: boolean = navigator.onLine;
	isRTL: boolean = (window as any).rtl;

	constructor(
		public episodeService: EpisodeService,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.episodeService.episodes.subscribe(episodes => {
			this.episodes = episodes;
			this.fuse = new Fuse(this.episodes, { includeScore: true, keys: ['title', 'description'] });
			this.search();
		});
		this.titleService.setTitle(`${environment.baseTitle[this.lang]} - ${this.titles[this.lang]}`);
		addEventListener('online', () => { this.online = true; });
		addEventListener('offline', () => { this.online = false; });
	}

	search() {
		if (!this.searchString) {
			this.episodes = this.episodeService.currentEpisodes;
		} else {
			this.episodes = this.fuse.search(this.searchString).map(result => result.item);
		}
	}

	clearSearch() {
		this.searchString = '';
		this.episodes = this.episodeService.currentEpisodes;
	}

	formatSeconds(time: number) {
		const minutes = Math.floor(Math.floor(time) / 60);
		const seconds = Math.floor(Math.floor(time) % 60);
		const minutesFormat = minutes > 9 ? minutes : `0${minutes}`;
		const secondsFormat = seconds > 9 ? seconds : `0${seconds}`;
		return `${minutesFormat}:${secondsFormat}`;
	}

	formatTimeAgo(date: Date) {
		return this.time(date).locale(this.locale).fromNow();
	}

	formatTime(date: Date) {
		return this.time(date).locale(this.locale).format('l');
	}

}
