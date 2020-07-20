import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
	images = environment.images;

	constructor() { }

	ngOnInit(): void {
	}

}
