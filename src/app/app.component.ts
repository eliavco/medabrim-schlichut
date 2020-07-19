import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from './../environments/environment';
import { Title } from '@angular/platform-browser';

// tslint:disable-next-line: ban-types
declare let gtag: Function;
declare let mgaids: Array<string>;

@Component({
	selector: 'ec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isRTL = false;
	lang = 'en';

	constructor(
		private router: Router,
		private titleService: Title,
		@Inject(LOCALE_ID) public locale: string
	) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				mgaids.forEach(mgaid => {
					gtag('config', mgaid,
						{
							page_path: event.urlAfterRedirects
						}
					);
				});
			}
		});
		if (this.locale.startsWith('he')) { this.isRTL = true; }
		this.lang = this.locale.substring(0, 2);
		(window as any).loc = this.locale;
		(window as any).rtl = this.isRTL;
	}
	
	ngOnInit() {
		this.titleService.setTitle(environment.baseTitle[this.lang]);
	}

}
