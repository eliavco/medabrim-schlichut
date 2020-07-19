import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// tslint:disable-next-line: ban-types
declare let gtag: Function;
declare let mgaids: Array<string>;

@Component({
	selector: 'ec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Medabrim Schlichut';
	isRTL = false;

	constructor(
		private router: Router,
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
		(window as any).loc = this.locale;
		(window as any).rtl = this.isRTL;
	}

}
