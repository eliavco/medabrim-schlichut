import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	constructor(private snackBar: MatSnackBar) { }

	open(message: string, action?: string, actionCb?: () => any, dismiss?: () => any, duration: number = 2000) {
		const newAlert = this.snackBar.open(message, action ? action : undefined, {
			duration,
		});
		if (actionCb) { newAlert.onAction().subscribe(actionCb); }
		if (dismiss) { newAlert.afterDismissed().subscribe(dismiss); }
	}

}
