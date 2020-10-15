import { Component, Input, OnInit } from '@angular/core';
import { DownloadManagerService } from './../../services/download-manager/download-manager.service';

@Component({
	selector: 'ec-download-button',
	templateUrl: './download-button.component.html',
	styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent implements OnInit {
	@Input() track;
	downloaded = ( Math.floor(Math.random() * 1000) % 2 ) === 0;

	constructor(
		private downloadManagerService: DownloadManagerService
	) { }

	ngOnInit(): void {
	}

}
