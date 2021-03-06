import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'ec-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Output() toggleNav = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	toggleNavSend() {
		this.toggleNav.emit();
	}

}
