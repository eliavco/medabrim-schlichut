import { Component, Input, OnInit } from '@angular/core';
import { DownloadManagerService } from './../../services/download-manager/download-manager.service';

@Component({
	selector: 'ec-download-button',
	templateUrl: './download-button.component.html',
	styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent implements OnInit {
	@Input() track;
	downloaded = false;
	error;
	progress;

	constructor(
		private downloadManagerService: DownloadManagerService
	) { }

	ngOnInit(): void {
		this.isDownloaded();
	}
	
	isDownloaded() {
		this.downloadManagerService.isDownloaded(this.track).then(downloaded => {
			this.downloaded = downloaded;
		});
	}

	setError(err) {
		this.error = err;
	}

	setProgress(pr) {
		this.progress = pr;
	}

	download() {
		const isDownloaded = this.isDownloaded.bind(this);
		const setError = this.setError.bind(this);
		const setProgress = this.setProgress.bind(this);
		this.downloadManagerService.downloadEpisode(this.track).subscribe({
			next(x) { setProgress(x); },
			error(err) { setError(err); console.error(err); },
			complete() { isDownloaded(); setProgress(undefined); }
		});
	}
	
	deleteEpisode() {
		this.downloadManagerService.deleteEpisode(this.track).then((() => {
			this.isDownloaded();
		}).bind(this));
	}

}
