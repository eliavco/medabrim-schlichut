import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'ec-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
	images = environment.images;
	lang = (window as any).loc.substring(0, 2);
	titles = {
		en: 'Home',
		he: 'בית'
	};

	constructor(private titleService: Title) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${environment.baseTitle[this.lang]} - ${this.titles[this.lang]}`);
	}

}
