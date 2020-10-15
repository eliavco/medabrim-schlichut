import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { openDB, deleteDB } from 'idb';

@Injectable({
	providedIn: 'root'
})
export class DownloadManagerService {

	constructor() { }

	downloadEpisode(track: string): Observable<{ downloaded: number; whole: number; }> {
		return new Observable<{ downloaded: number; whole: number; }>((subscriber => {
			this.downloadEpisodeSync(subscriber, track).then(() => {
				subscriber.complete();
			});
		}).bind(this));
	}

	private async downloadEpisodeSync(subscriber, track) {
		const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
		// Step 1: start the fetch and obtain a reader
		let response = await fetch(`${proxyUrl}${track}`);

		const reader = response.body.getReader();

		// Step 2: get total length
		const contentLength = +response.headers.get('Content-Length');

		// Step 3: read the data
		let receivedLength = 0; // received that many bytes at the moment
		let chunks = []; // array of received binary chunks (comprises the body)
		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			chunks.push(value);
			receivedLength += value.length;

			subscriber.next({ downloaded: receivedLength, whole: contentLength });
		}

		const blob = new Blob(chunks);
		(window as any).blobi = blob;
	}

}
