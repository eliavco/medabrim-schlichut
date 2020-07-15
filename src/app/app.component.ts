import { Component } from '@angular/core';
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

	constructor(private router: Router) {
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
	}

}
