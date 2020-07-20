import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertService } from './../../services/alert/alert.service';
import { environment } from './../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'ec-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	images = environment.images;
	lang = (window as any).loc.substring(0, 2);
	titles = {
		en: 'About',
		he: 'אודות'
	};

	constructor(
		private alert: AlertService,
		private clipboard: Clipboard,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${environment.baseTitle[this.lang]} - ${this.titles[this.lang]}`);
	}

	copyShare() {
		this.clipboard.copy(location.origin);
		const message = {
			he: 'הקישור הועתק! אנא שתפו אותו!',
			en: 'Link copied! Please share it!'
		};
		this.alert.open(message[this.lang]);
	}

}
