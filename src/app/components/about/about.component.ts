import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertService } from './../../services/alert/alert.service';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	images = environment.images;

	constructor(
		private alert: AlertService,
		private clipboard: Clipboard,
	) { }

	ngOnInit(): void {
	}

	copyShare() {
		this.clipboard.copy(location.origin);
		this.alert.open('Link copied! Please share it!');
	}

}
