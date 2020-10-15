import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { openDB, deleteDB } from 'idb';

@Injectable({
	providedIn: 'root'
})
export class DownloadManagerService {
	storeName = 'episodes';

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
		
		const episode = await this.saveEpisode(track, blob);
		if (!episode) { throw new Error('We could not download the episode'); } 
	}

	async isDownloaded(track: string) {
		const tx = await this.getDB();
		const store = await tx.objectStore(this.storeName);
		if (store) {
			const episode = await store.get(track);
			if (episode) { await tx.done; return true; }
		}
		await tx.done;
		return false;
	}

	async saveEpisode(track: string, blob: Blob) {
		const tx = await this.getDB();
		const store = await tx.objectStore(this.storeName);
		if (tx) {
			const episode = await store.put(blob, track);
			await tx.done;
			return episode;
		}
	}

	async deleteEpisode(track: string) {
		const tx = await this.getDB();
		const store = await tx.objectStore(this.storeName);
		if (tx) {
			const episode = await store.delete(track);
			await tx.done;
			return episode;
		}
	}

	async getDB() {
		if (!('indexedDB' in window)) {
			console.warn('IndexedDB not supported');
			return;
		}
		const dbName = 'MedabrimShlichut';
		const version = 1; //versions start at 1
		const storeName = this.storeName;

		const db = await openDB(dbName, version, {
			upgrade(db, oldVersion, newVersion, transaction) {
				const store = db.createObjectStore(storeName);
			}
		})

		const tx = db.transaction(storeName, 'readwrite');

		return tx;
	}

}
