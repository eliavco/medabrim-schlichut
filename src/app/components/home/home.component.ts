import { Component, OnInit } from '@angular/core';
import { AlertService } from './../../services/alert/alert.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'ec-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	nav = false;

	constructor(private alert: AlertService, private router: Router) { }

	ngOnInit(): void {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.nav = false;
				this.toggleLockscroll();
			}
		});
		this.toggleLockscroll();
	}

	toggleNav() {
		this.nav = !this.nav;
		this.toggleLockscroll();
	}

	toggleLockscroll() {
		scrollTo(0, 0);
		if (this.nav) { document.body.style.overflow = 'hidden'; }
		else { document.body.style.overflow = 'initial'; }
	}

}
