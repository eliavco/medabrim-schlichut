import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	pages: { title: { [key: string]: string }; icon: string; link: string; }[] = [
		{ title: { en: 'Home', he: 'בית' }, icon: 'home', link: '/' },
		{ title: { en: 'About', he: 'אודות' }, icon: 'assignment', link: '/about' },
		{ title: { en: 'Listen', he: 'האזן' }, icon: 'radio', link: '/listen' },
		{ title: { en: 'Contact', he: 'צור קשר' }, icon: 'contact_support', link: '/contact' },
	];
	locale = (window as any).loc.substring(0, 2);
	rtl = (window as any).rtl;
	current = location.pathname;
	otherLanguage;

	constructor(private router: Router) { }

	ngOnInit(): void {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.current = location.pathname;
			}
		});
		Object.keys(environment.languages).forEach(key => {
			if (!(window as any).loc.startsWith(key)) { this.otherLanguage = environment.languages[key]; }
		});
	}

	formatLink() {
		return location.pathname;
	}

}
