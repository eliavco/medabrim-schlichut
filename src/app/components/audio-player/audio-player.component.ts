import { Component, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { AudioPlayerService } from './../../services/audio-player/audio-player.service';
import { Router, NavigationEnd } from '@angular/router';
import hotkeys from 'hotkeys-js';

@Component({
	selector: 'ec-audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
	_display: boolean = false;
	playing = false;
	sound;
	_displayFullTitle = false;
	mute = 0;
	volumeIcon = 'volume_up';
	locationUpdate;
	seek = 0;
	duration = 0;
	rateList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	rate = 1;
	title = '';
	current = location.pathname;
	origin = '/listen';
	isRTL = (window as any).rtl;
	volume = 100;
	collapse;

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

	constructor(private audioPlayerService: AudioPlayerService, private router: Router) { }

	ngOnInit(): void {
		const tracks = this.audioPlayerService.getTrack();
		tracks.subscribe(data => {
			this.launchTrack(data.title, data.track);
		});
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.current = location.pathname;
			}
		});
	}

	launchTrack(title: string, track: string) {
		this.title = title;
		this.display = true;
		if (this.sound) { this.sound.stop(); }
		this.startMusic({
			src: [track],
			loop: true,
		});
	}

	startMusic(config) {
		if (this.sound) { this.sound.stop(); }
		this.sound = new Howl(config);
		this.sound.on('load', () => {
			this.duration = this.sound.duration();
			this.playMusic();
		});
	}

	closePlayer() {
		this.display = false;
		this.sound.stop();
		clearInterval(this.locationUpdate);
	}

	playMusic() {
		this.playing = true;
		this.sound.play();
		this.locationUpdate = setInterval(() => {
			const seek = this.sound.seek();
			this.seek = typeof seek === 'number' ? seek : this.seek;
		}, 100);
	}

	pauseMusic() {
		this.playing = false;
		this.sound.pause();
		clearInterval(this.locationUpdate);
	}

	setVolume(event) {
		this.sound.volume(event.value / 100);
		if (event.value < 50) { this.volumeIcon = 'volume_down'; }
		if (event.value > 50) { this.volumeIcon = 'volume_up'; }
	}

	muteMusic() {
		if (this.mute === 0) {
			this.mute = this.sound.volume();
			this.setVolume({ value: 0 });
		}
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
			this.isRTL ? this.back10Sec() : this.skip10Sec();
		}).bind(this));
		hotkeys('left', (function (event, handler) {
			event.preventDefault();
			this.isRTL ? this.skip10Sec() : this.back10Sec();
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

}
