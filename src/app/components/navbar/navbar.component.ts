import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'ec-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	@Output() toggleNav = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	toggleNavSend() {
		this.toggleNav.emit();
	}

}
