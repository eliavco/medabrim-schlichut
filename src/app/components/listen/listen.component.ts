import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from './../../services/audio-player/audio-player.service';
import { PodcastManagerService } from './../../services/podcast-manager/podcast-manager.service';
import { environment } from './../../../environments/environment';

import * as moment from 'moment';

const { parseString } = require('xml2js');

interface Episode {
	track: string;
	title: string;
	duration: number;
	description: string;
	date: Date;
}

@Component({
	selector: 'ec-listen',
	templateUrl: './listen.component.html',
	styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {
	episodes: Episode[];
	time = moment;
	locale = (window as any).loc;
	images = environment.images;

	constructor(
		private audioPlayerService: AudioPlayerService,
		private podcastManagerService: PodcastManagerService
	) { }

	ngOnInit(): void {
		this.podcastManagerService.getPodcast().subscribe(podcast => {
			this.parseEpisodes(podcast);
		});
	}

	formatSeconds(time: number) {
		const minutes = Math.floor(Math.floor(time) / 60);
		const seconds = Math.floor(Math.floor(time) % 60);
		const minutesFormat = minutes > 9 ? minutes : `0${minutes}`;
		const secondsFormat = seconds > 9 ? seconds : `0${seconds}`;
		return `${minutesFormat}:${secondsFormat}`;
	}

	playEpisode(episode: Episode) {
		this.audioPlayerService.startTrack(episode.track, episode.title);
	}

	parseEpisode(ep) {
		return {
			track: ep.enclosure[0].$.url, title: ep.title[0], date: new Date(ep.pubDate[0]),
			duration: ep['itunes:duration'] * 1, description: ep.description[0]
		};
	}

	parseEpisodes(podcast: string) {
		parseString(podcast, (err, result) => {
			this.episodes = result.rss.channel[0].item.map(this.parseEpisode);
		});
	}

	formatTimeAgo(date: Date) {
		return this.time(date).locale(this.locale).fromNow();
	}

	formatTime(date: Date) {
		return this.time(date).locale(this.locale).format('l');
	}

}
