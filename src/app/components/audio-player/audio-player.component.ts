import { Component, OnInit } from '@angular/core';
import { Howl, Howler } from 'howler';
import { Router, NavigationEnd } from '@angular/router';
import hotkeys from 'hotkeys-js';

import { AudioPlayerService } from './../../services/audio-player/audio-player.service';
import { EpisodeService } from 'src/app/data/episode/episode.service';
import { DownloadManagerService } from './../../services/download-manager/download-manager.service';
import { environment } from './../../../environments/environment';

import { soundManager } from 'soundmanager2';

@Component({
	selector: 'ec-audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
	_display: boolean = false;
	_playing = false;
	sound;
	_displayFullTitle = false;
	mute = 0;
	volumeIcon = 'volume_up';
	buffering = true;
	locationUpdate;
	locationUpdateBig;
	seek = 0;
	duration = 0;
	rateList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	rate = 1;
	title = '';
	current = location.pathname;
	origin = '/listen';
	isRTL = (window as any).rtl;
	volume;
	collapse;
	track = '';
	lang = (window as any).loc.substring(0, 2);
	modeDev = !environment.production;

	get playing(): boolean {
		return this._playing;
	}

	set playing(val: boolean) {
		(navigator as any).mediaSession.playbackState = val ? 'playing' : 'paused';
		this._playing = val;
	}

	set display(val: boolean) {
		this._display = val;
		if (this._display === true) { this.keyStart(); }
		else { this.keyStop(); }
	}

	get display(): boolean {
		return this._display;
	}

	set displayFullTitle(val: boolean) {
		this._displayFullTitle = val;
		if (this._displayFullTitle === true) {
			this.collapse = setTimeout((() => {
				this._displayFullTitle = false;
			}).bind(this), 7000);
		} else {
			if (this.collapse) { clearTimeout(this.collapse); }
		}
	}

	get displayFullTitle(): boolean {
		return this._displayFullTitle;
	}

	constructor(
		private episodeService: EpisodeService,
		private audioPlayerService: AudioPlayerService,
		private downloadManagerService: DownloadManagerService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.subscribeTracks();
		this.initializeCurrent();
	}

	initializeCurrent() {
		soundManager.setup({ useConsole: this.modeDev })
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.current = location.pathname;
			}
		});
	}

	subscribeTracks() {
		const tracks = this.audioPlayerService.getTrack();
		tracks.subscribe(data => {
			this.launchTrack(data.title, data.track, data.progress);
		});
	}

	launchTrack(title: string, track: string, progress?: number) {
		this.title = title;
		this.display = true;
		if (this.sound) { this.sound.stop(); }
		this.stopMediaSession();
		this.startMediaSession(title);
		Howler.stop();
		this.track = track;

		this.downloadManagerService.getDownloaded(track).then(newTrack => {
			this.startMusic({
				src: [newTrack],
				loop: false,
				format: ['m4a'],
				progress: progress ? progress : 0
			});
		});
	}

	startMusic(config) {
		if (this.sound) { this.sound.stop(); }
		this.sound = new Howl(config);
		const hello = soundManager.createSound({
			url: config.src[0],
			autoLoad: true,
			onload: function () {
				console.log(hello);
			}
		});
		this.sound.on('load', (() => {
			this.duration = this.sound.duration();
			if (config.progress + 5 < this.duration) { this.setSeek({ value: config.progress }); }
			// this.playMusic();
			if (localStorage.rate) {
				this.rate = +localStorage.rate;
				this.sound.rate(this.rate);
			}
			if (localStorage.volume) {
				this.volume = (+localStorage.volume) * 100;
				this.setVolume({
					value: (+localStorage.volume) * 100
				});
			} else {
				this.volume = 100;
			}
		}).bind(this));
		this.sound.on('end', (() => {
			this.updateLocation();
			this.skipEpisode();
		}).bind(this));
	}

	closePlayer() {
		this.display = false;
		this.sound.stop();
		Howler.stop();
		this.stopMediaSession();
		clearInterval(this.locationUpdate);
		clearInterval(this.locationUpdateBig);
	}

	playMusic() {
		this.playing = true;
		this.display = true;
		this.sound.play();
		this.locationUpdate = setInterval(() => {
			const seek = this.sound.seek();
			if (typeof seek !== 'number') { if (!this.buffering) { this.buffering = true; } } else { if (this.buffering) { this.buffering = false; } }
			this.seek = typeof seek === 'number' ? seek : this.seek;
			if ("setPositionState" in (navigator as any).mediaSession) {
				(navigator as any).mediaSession.setPositionState({
					duration: this.duration,
					playbackRate: this.rate,
					position: this.seek
				});
			}
		}, 100);
		this.locationUpdateBig = setInterval(() => {
			this.updateLocation();
		}, 1000);
	}
	
	updateLocation(): void {
		this.episodeService.updateLocation(this.track, this.seek);
	}

	pauseMusic() {
		this.playing = false;
		this.sound.pause();
		clearInterval(this.locationUpdate);
		clearInterval(this.locationUpdateBig);
	}

	setVolume(event) {
		this.sound.volume(event.value / 100);
		if (event.value < 50) { this.volumeIcon = 'volume_down'; }
		if (event.value > 50) { this.volumeIcon = 'volume_up'; }
		localStorage.volume = `${this.sound.volume()}`;
	}

	muteMusic() {
		if (this.mute === 0) {
			this.mute = this.sound.volume();
			this.setVolume({ value: 0 });
		}
	}

	skipEpisode() {
		this.episodeService.nextEpisode(this.track);
		this.closePlayer();
	}

	previousEpisode() {
		this.episodeService.previousEpisode(this.track);
		this.closePlayer();
	}

	unmuteMusic() {
		if (this.mute > 0) {
			this.setVolume({ value: this.mute * 100 });
			this.mute = 0;
		}
	}

	setSeek(event) {
		this.sound.seek(event.value);
		this.seek = event.value;
	}

	formatSeconds(time: number) {
		const minutes = Math.floor(Math.floor(time) / 60);
		const seconds = Math.floor(Math.floor(time) % 60);
		const minutesFormat = minutes > 9 ? minutes : `0${minutes}`;
		const secondsFormat = seconds > 9 ? seconds : `0${seconds}`;
		return `${minutesFormat}:${secondsFormat}`;
	}

	nextRate() {
		this.rate = this.rateList[this.nextInList(this.rateList, this.rateList.indexOf(this.rate))];
		this.sound.rate(this.rate);
		localStorage.rate = `${this.rate}`;
	}

	nextInList(list, ind) {
		if (list.length === ind + 1) { return 0; }
		return ind + 1;
	}

	back10Sec() {
		if (this.seek < 10) { this.setSeek({ value: 0 }); }
		else { this.setSeek({ value: this.seek - 10 }); }
	}

	skip10Sec() {
		if (this.seek + 10 > this.duration) { this.setSeek({ value: this.duration }); }
		else { this.setSeek({ value: this.seek + 10 }); }
	}

	keyStart() {
		hotkeys('space', (function (event, handler) {
			event.preventDefault();
			this.playing ? this.pauseMusic() : this.playMusic();
		}).bind(this));
		hotkeys('right', (function (event, handler) {
			event.preventDefault();
			this.skip10Sec();
			// this.isRTL ? this.back10Sec() : this.skip10Sec();
		}).bind(this));
		hotkeys('left', (function (event, handler) {
			event.preventDefault();
			this.back10Sec();
			// this.isRTL ? this.skip10Sec() : this.back10Sec();
		}).bind(this));
		hotkeys('up', (function (event, handler) {
			event.preventDefault();
			this.volume = this.volume < 90 ? this.volume + 10 : 100;
			this.setVolume({ value: this.volume });
		}).bind(this));
		hotkeys('down', (function (event, handler) {
			event.preventDefault();
			this.volume = this.volume > 10 ? this.volume - 10 : 0;
			this.setVolume({ value: this.volume });
		}).bind(this));
	}

	keyStop() {
		const keys = ['space', 'left', 'right', 'up', 'down'];
		keys.forEach(key => {
			hotkeys.unbind(key);
		});
	}

	startMediaSession(episodeName) {
		if ('mediaSession' in navigator) {
			(navigator as any).mediaSession.metadata = new (window as any).MediaMetadata({
				title: episodeName,
				artist: environment.author[this.lang],
				album: environment.baseTitle[this.lang],
				artwork: environment.artwork
			});

			(navigator as any).mediaSession.setActionHandler('play', (() => { this.playMusic(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('pause', (() => { this.pauseMusic(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('stop', (() => { this.closePlayer(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('seekbackward', (() => { this.back10Sec(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('seekforward', (() => { this.skip10Sec(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('previoustrack', (() => { this.previousEpisode(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('nexttrack', (() => { this.skipEpisode(); }).bind(this));
			(navigator as any).mediaSession.setActionHandler('seekto', ((details) => { this.setSeek(details.seekTime) }).bind(this));
		}
	}

	stopMediaSession() {
		if ('mediaSession' in navigator) {
			(navigator as any).mediaSession.metadata = null;
			(navigator as any).mediaSession.setPositionState(null);
		}
	}

}
