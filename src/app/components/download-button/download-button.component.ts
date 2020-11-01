import { Component, Input, OnInit } from '@angular/core';
import { DownloadManagerService } from './../../services/download-manager/download-manager.service';

@Component({
	selector: 'ec-download-button',
	templateUrl: './download-button.component.html',
	styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent implements OnInit {
	@Input() track;
	@Input() downloaded: boolean;
	error;
	progress;
	online: boolean = navigator.onLine;
	@Input() display: boolean;

	constructor(
		private downloadManagerService: DownloadManagerService
	) { }

	ngOnInit(): void {
		addEventListener('online', (() => { this.online = true; }).bind(this));
		addEventListener('offline', (() => { this.online = false; }).bind(this));
	}

	setError(err) {
		this.error = err;
	}

	setProgress(pr) {
		this.progress = pr;
	}

	download() {
		const setError = this.setError.bind(this);
		const setProgress = this.setProgress.bind(this);
		this.downloadManagerService.downloadEpisode(this.track).subscribe({
			next(x) { setProgress(x); },
			error(err) { setError(err); console.error(err); },
			complete() { this.downloaded = true; setProgress(undefined); }
		});
	}
	
	deleteEpisode() {
		this.downloadManagerService.deleteEpisode(this.track).then((() => {
			this.downloaded = false;
		}).bind(this));
	}

}
