import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioPlayerService {
	track = new EventEmitter<{ track: string; title: string; progress: number }>();

	constructor() { }

	getTrack() {
		return this.track;
	}

	startTrack(track: string, title: string, progress?: number) {
		this.track.emit({ track, title, progress: progress ? progress : 0 });
	}

}
