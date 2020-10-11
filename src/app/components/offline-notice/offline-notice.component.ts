import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'ec-offline-notice',
	templateUrl: './offline-notice.component.html',
	styleUrls: ['./offline-notice.component.scss']
})
export class OfflineNoticeComponent implements OnInit {
	online: boolean = navigator.onLine;

	constructor() { }

	ngOnInit(): void {
		addEventListener('online', (() => {	this.online = true; }).bind(this));
		addEventListener('offline', (() => { this.online = false; }).bind(this));
	}

}
