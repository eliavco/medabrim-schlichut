import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AlertService } from './../../services/alert/alert.service';

@Component({
	selector: 'ec-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	nav = false;

	constructor(private alert: AlertService) { }

	ngOnInit(): void {
	}

	toggleNav() {
		this.nav = !this.nav;
	}

}
