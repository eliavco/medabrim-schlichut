import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { AudioPlayerService } from 'src/app/services/audio-player/audio-player.service';
import { DownloadManagerService } from 'src/app/services/download-manager/download-manager.service';
import { PodcastManagerService } from 'src/app/services/podcast-manager/podcast-manager.service';

const { parseString } = require('xml2js');

@Injectable({
	providedIn: 'root'
})
export class EpisodeService {
	private readonly initialState = localStorage.episodes ? JSON.parse(localStorage.episodes) || [] : [];
	private readonly _episodes = new BehaviorSubject<Episode[]>(this.initialState);
	readonly episodes = this._episodes.asObservable();
	get currentEpisodes(): Episode[] {
		return this._episodes.getValue();
	}
	get online(): boolean { return navigator.onLine; }

	constructor(
		private audioPlayerService: AudioPlayerService,
		private downloadManagerService: DownloadManagerService,
		private podcastManagerService: PodcastManagerService,
	) {
		this.closeEpisodes();
		this.isDownloadedForOffline();
		addEventListener('online', () => { this.refreshPodcast(); });
		if (this.online) { this.refreshPodcast(); }
	}

	private closeEpisodes(): void {
		const episodes = this.currentEpisodes.map(episode => {
			episode.open = false;
			return episode;
		});
		this.setEpisodes(episodes);
	}

	getEpisodes(): Episode[] {
		return this._episodes.getValue();
	}

	refreshPodcast() {
		this.podcastManagerService.getPodcast().subscribe(podcast => {
			this.parseEpisodes(podcast);
		});
	}

	updateLocation(track: string, progress: number): void {
		const episodes = this.currentEpisodes.map(episode => {
			if (episode.track === track) {
				episode.progress = progress;
			}
			return episode;
		});
		this.setEpisodes(episodes);
	}

	private updateEpisodes(episodeList) {
		const epList = episodeList.map(newEpisode => {
			const fepisode = this.currentEpisodes[this.findEpisodeIndex(newEpisode.track)];
			if (fepisode) {
				newEpisode.progress = fepisode.progress;
			}
			return newEpisode;
		});
		return epList;
	}

	private parseEpisode(ep) {
		return {
			track: ep.enclosure[0].$.url, title: ep.title[0], date: new Date(ep.pubDate[0]),
			duration: ep['itunes:duration'] * 1, description: ep.description[0], open: false
		};
	}

	private parseEpisodes(podcast: string) {
		parseString(podcast, (err, result) => {
			const newPodcastList = result.rss.channel[0].item.map(this.parseEpisode);
			const episodes = this.updateEpisodes(newPodcastList);
			this.setEpisodes(episodes);
			this.isDownloadedForOffline();
		});
	}

	private setEpisodes(episodes: Episode[]): void {
		this._episodes.next(episodes);
		localStorage.setItem('episodes', JSON.stringify(episodes));
	}

	private async isDownloadedForOffline() {
		const episodes = await Promise.all(this.currentEpisodes.map(async p => {
			p.downloaded = await this.downloadManagerService.isDownloaded(p.track);
			return p;
		}));
		this.setEpisodes(episodes);
	}

	private adjacentEpisode(track, next: boolean) {
		let episodeIndex = this.findEpisodeIndex(track);
		if (episodeIndex > -1) {
			let newEpisode;
			let proceed = false;
			while (!proceed) {
				let newEpisodeIndex;

				if (next) {
					if (episodeIndex > 0) {
						newEpisodeIndex = episodeIndex - 1;
					} else {
						newEpisodeIndex = this.currentEpisodes.length - 1;
					}
				} else {
					if (episodeIndex < this.currentEpisodes.length - 1) {
						newEpisodeIndex = episodeIndex + 1;
					} else {
						newEpisodeIndex = 0;
					}
				}

				newEpisode = this.currentEpisodes[newEpisodeIndex];
				if (newEpisode.track === track) {
					proceed = true; newEpisode = undefined;
				}
				if (Math.floor(newEpisode.progress) !== newEpisode.duration) {
					proceed = true;
				}
				if (!this.online && !newEpisode.downloaded) {
					proceed = false;
				}
				episodeIndex = newEpisodeIndex;
			}
			if (newEpisode) {
				return newEpisode;
			}
		}
	}

	nextEpisode(track: string) {
		const newEpisode = this.adjacentEpisode(track, true);
		if (newEpisode) {
			this.playEpisode(newEpisode);
		}
	}

	previousEpisode(track: string) {
		const newEpisode = this.adjacentEpisode(track, false);
		if (newEpisode) {
			this.playEpisode(newEpisode);
		}
	}

	private findEpisodeIndex(track: string) {
		if (this.currentEpisodes) {
			let ind = -1;
			this.currentEpisodes.forEach((episode, index) => {
				if (episode.track === track) {
					ind = index;
				}
			});
			return ind;
		}
		return -1;
	}

	playEpisode(episode: Episode) {
		if (episode.progress) {
			this.audioPlayerService.startTrack(episode.track, episode.title, episode.progress);
		} else {
			this.audioPlayerService.startTrack(episode.track, episode.title);
		}
	}

	toggleEpisodeOpen(episode: Episode): void {
		const episodes = this.currentEpisodes.map(p => {
			if (episode.track === p.track) { p.open = !p.open; }
			return p;
		});
		this.setEpisodes(episodes);
	}
}
