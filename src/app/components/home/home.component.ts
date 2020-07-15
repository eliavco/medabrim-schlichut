import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor(private titleService: Title) { }

	ngOnInit(): void {
		// this.titleService.setTitle(`${environment.baseTitle} - blabla`);
	}

}
