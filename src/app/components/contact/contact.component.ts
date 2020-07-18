import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactService } from './../../services/contact/contact.service';

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

	constructor(
		private contact: ContactService,
		private router: Router,
	) { }

	ngOnInit(): void {
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
