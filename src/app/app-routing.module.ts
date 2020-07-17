import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AboutComponent } from './components/about/about.component';
import { ListenComponent } from './components/listen/listen.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
	{ path: 'about', component: AboutComponent },
	{ path: 'listen', component: ListenComponent },
	{ path: 'contact', component: ContactComponent },
	{ path: '', component: WelcomeComponent },
	{ path: '**', redirectTo: '/' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
