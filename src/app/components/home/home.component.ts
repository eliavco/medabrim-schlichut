import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from './../../../environments/environment';
import { AlertService } from './../../services/alert/alert.service';

@Component({
	selector: 'ec-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	nav = false;

	constructor(private titleService: Title, private alert: AlertService) { }

	ngOnInit(): void {
		// this.titleService.setTitle(`${environment.baseTitle} - blabla`);
	}

	toggleNav() {
		this.nav = !this.nav;
	}

}
