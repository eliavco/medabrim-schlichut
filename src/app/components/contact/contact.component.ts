import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactService } from './../../services/contact/contact.service';
import { Title } from '@angular/platform-browser';
import { environment } from './../../../environments/environment';

@Component({
	selector: 'ec-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
	form = new FormGroup({
		email: new FormControl(''),
		name: new FormControl(''),
		subject: new FormControl(''),
		message: new FormControl(''),
	});
	lang = (window as any).loc.substring(0, 2);
	titles = {
		en: 'Contact',
		he: 'צור קשר'
	};

	constructor(
		private contact: ContactService,
		private router: Router,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${environment.baseTitle[this.lang]} - ${this.titles[this.lang]}`);
	}

	onSubmit() {
		const { name, email, subject, message } = this.form.value;
		if (this.form.status === 'VALID') {
			this.contact.send(name, email, message, subject);
			this.form.reset();
			this.router.navigate(['/']);
		}
	}

}
