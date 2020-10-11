import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioPlayerService {
	track = new EventEmitter<{ track: string; title: string; progress: number }>();
	change = new EventEmitter<string>();

	constructor() { }

	getTrack() {
		return this.track;
	}

	getChange() {
		return this.change;
	}

	startTrack(track: string, title: string, progress?: number) {
		this.track.emit({ track, title, progress: progress ? progress : 0 });
	}

	reportChange() {
		this.change.emit('changed');
	}

}
