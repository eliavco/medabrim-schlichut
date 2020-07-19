import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	@Output() toggleNav = new EventEmitter();
	otherLanguage;

	constructor() { }

	ngOnInit(): void {
		Object.keys(environment.languages).forEach(key => {
			if (!(window as any).loc.startsWith(key)) { this.otherLanguage = environment.languages[key]; }
		});
		console.log(this.otherLanguage);
	}

	toggleNavSend() {
		this.toggleNav.emit();
	}

}
