import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from './../../services/audio-player/audio-player.service';
import { PodcastManagerService } from './../../services/podcast-manager/podcast-manager.service';
import { environment } from './../../../environments/environment';
import { Title } from '@angular/platform-browser';
import Fuse from 'fuse.js';

import * as moment from 'moment';

const { parseString } = require('xml2js');

interface Episode {
	track: string;
	title: string;
	duration: number;
	description: string;
	date: Date;
	open: boolean;
	progress?: number;
}

@Component({
	selector: 'ec-listen',
	templateUrl: './listen.component.html',
	styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {
	episodes: Episode[];
	bepisodes: Episode[];
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
		private audioPlayerService: AudioPlayerService,
		private podcastManagerService: PodcastManagerService,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.fetchEpidoes(false);
		this.titleService.setTitle(`${environment.baseTitle[this.lang]} - ${this.titles[this.lang]}`);
		addEventListener('online', () => { this.online = true; this.fetchEpidoes(false); });
		addEventListener('offline', () => { this.online = false; });
		this.audioPlayerService.getChange().subscribe((data => {
			if (data.code === 1) {
				this.fetchEpidoes(true);
			} else if (data.code === 2) {
				this.nextEpisode(data.track);
			} else if (data.code === 3) {
				this.previousEpisode(data.track);
			}
		}).bind(this));
	}

	nextEpisode(track) {
		let episodeIndex = this.findEpisodeIndex(track);
		if (episodeIndex > -1) {
			let newEpisode;
			let proceed = false;
			while (!proceed) {
				let newEpisodeIndex;
				if (episodeIndex > 0) {
					newEpisodeIndex = episodeIndex - 1;
				} else {
					newEpisodeIndex = this.episodes.length - 1;
				}
				newEpisode = this.episodes[newEpisodeIndex];
				if (newEpisode.track === track) {
					proceed = true; newEpisode = undefined;
				}
				if (Math.floor(newEpisode.progress) !== newEpisode.duration) {
					proceed = true;
				}
				episodeIndex = newEpisodeIndex;
			}
			if (newEpisode) {
				this.playEpisode(newEpisode);
			}
		}
	}

	previousEpisode(track) {
		let episodeIndex = this.findEpisodeIndex(track);
		if (episodeIndex > -1) {
			let newEpisode;
			let proceed = false;
			while (!proceed) {
				let newEpisodeIndex;
				if (episodeIndex < this.episodes.length - 1) {
					newEpisodeIndex = episodeIndex + 1;
				} else {
					newEpisodeIndex = 0;
				}
				newEpisode = this.episodes[newEpisodeIndex];
				if (newEpisode.track === track) {
					proceed = true; newEpisode = undefined;
				}
				if (Math.floor(newEpisode.progress) !== newEpisode.duration) {
					proceed = true;
				}
				episodeIndex = newEpisodeIndex;
			}
			if (newEpisode) {
				this.playEpisode(newEpisode);
			}
		}
	}

	findEpisodeIndex(track) {
		if (this.episodes) {
			let ind = -1;
			this.episodes.forEach((episode, index) => {
				if (episode.track === track) {
					ind = index;
				}
			});
			return ind;
		}
		return -1;
	}

	fetchEpidoes(offline: boolean): void {
		if (localStorage.episodes) {
			this.episodes = JSON.parse(localStorage.episodes);
			this.fuse = new Fuse(this.episodes, { includeScore: true, keys: ['title', 'description'] });
		}
		const fetchNewEpisodes = () => {
			this.podcastManagerService.getPodcast().subscribe(podcast => {
				this.parseEpisodes(podcast);
				this.fuse = new Fuse(this.episodes, { includeScore: true, keys: ['title', 'description'] });
				this.search();
			});
		};
		if (!offline) {
			if (navigator.onLine) {
				fetchNewEpisodes();
			} else {
				addEventListener('online', () => {
					fetchNewEpisodes();
				});
			}
		}
	}

	search() {
		this.episodes = this.fuse.search(this.searchString).map(result => result.item);
		if (!this.searchString) { this.episodes = this.bepisodes; }
	}

	clearSearch() {
		this.searchString = '';
		this.search();
	}

	formatSeconds(time: number) {
		const minutes = Math.floor(Math.floor(time) / 60);
		const seconds = Math.floor(Math.floor(time) % 60);
		const minutesFormat = minutes > 9 ? minutes : `0${minutes}`;
		const secondsFormat = seconds > 9 ? seconds : `0${seconds}`;
		return `${minutesFormat}:${secondsFormat}`;
	}

	playEpisode(episode: Episode) {
		if (episode.progress) {
			this.audioPlayerService.startTrack(episode.track, episode.title, episode.progress);
		} else {
			this.audioPlayerService.startTrack(episode.track, episode.title);
		}
	}

	parseEpisode(ep) {
		return {
			track: ep.enclosure[0].$.url, title: ep.title[0], date: new Date(ep.pubDate[0]),
			duration: ep['itunes:duration'] * 1, description: ep.description[0], open: false
		};
	}

	compareEpisodes(a, b): boolean {
		return a.track === b.track;
	}

	findEpisode(nepisode, episodes): Episode {
		let fepisode;
		episodes.forEach(episode => {
			if (this.compareEpisodes(nepisode, episode)) {
				fepisode = episode;
			}
		});
		return fepisode;
	}

	updateEpisodes(episodeList): void {
		const oldEpisodeList = localStorage.episodes ? JSON.parse(localStorage.episodes) : [];
		let fepisode;
		episodeList.forEach(newEpisode => {
			fepisode = this.findEpisode(newEpisode, oldEpisodeList);
			if (fepisode) {
				newEpisode.progress = fepisode.progress;
				newEpisode.download = fepisode.download;
			}
		});
		localStorage.episodes = JSON.stringify(episodeList);
		return episodeList;
	}

	parseEpisodes(podcast: string) {
		parseString(podcast, (err, result) => {
			let newPodcastList = result.rss.channel[0].item.map(this.parseEpisode);
			newPodcastList = this.updateEpisodes(newPodcastList);
			this.episodes = newPodcastList;
			localStorage.episodes = JSON.stringify(this.episodes);
			this.bepisodes = this.episodes;
		});
	}

	formatTimeAgo(date: Date) {
		return this.time(date).locale(this.locale).fromNow();
	}

	formatTime(date: Date) {
		return this.time(date).locale(this.locale).format('l');
	}

	toggleEpisodeOpen(episode) {
		episode.open = !episode.open;
	}

}
