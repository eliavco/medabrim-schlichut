import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'ec-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	pages: { title: string; icon: string; link: string; }[] = [
		{ title: 'About', icon: 'assignment', link: '/about' },
		{ title: 'Listen', icon: 'radio', link: '/listen' },
		{ title: 'Contact', icon: 'contact_support', link: '/contact' },
	];

	constructor() { }

	ngOnInit(): void {
	}

}
