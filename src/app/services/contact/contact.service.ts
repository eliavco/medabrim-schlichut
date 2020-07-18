import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AlertService } from './../../services/alert/alert.service';

@Injectable({
	providedIn: 'root'
})
export class ContactService {

	constructor(private http: HttpClient, private alert: AlertService) { }

	send(name, from, message, subject) {
		const data = new FormData();
		data.append('from', from);
		data.append('name', name);
		data.append('html', message);
		data.append('subject', subject);
		data.append('to', environment.destinationMailService);
		this.http.post(environment.mailService, data).subscribe(res => {
			this.alert.open('Email sent successfully!');
		}, err => {
			this.alert.open('Email could not be sent...');
		});
	}
}
