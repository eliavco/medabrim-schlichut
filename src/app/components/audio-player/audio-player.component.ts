import { Component, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { AudioPlayerService } from './../../services/audio-player/audio-player.service';
import { copyFileSync } from 'fs';

@Component({
	selector: 'ec-audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
	display = false;
	playing = false;
	sound;
	mute = 0;
	volumeIcon = 'volume_up';
	locationUpdate;
	seek = 0;
	duration = 0;
	rateList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
	rate = 1;
	title = '';

	constructor(private audioPlayerService: AudioPlayerService) { }

	ngOnInit(): void {
		const tracks = this.audioPlayerService.getTrack();
		tracks.subscribe(data => {
			this.launchTrack(data.title, data.track);
		});
	}

	launchTrack(title: string, track: string) {
		this.title = title;
		this.display = true;
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
			this.setVolume({ value: this.mute });
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

}
