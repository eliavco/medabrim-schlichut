import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioPlayerService {
	track = new EventEmitter<{ track: string; title: string; }>();

	constructor() { }

	getTrack() {
		return this.track;
	}

	startTrack(track: string, title: string) {
		this.track.emit({ track, title });
	}

}
