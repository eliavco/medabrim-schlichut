import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastAppsComponent } from './podcast-apps.component';

describe('PodcastAppsComponent', () => {
	let component: PodcastAppsComponent;
	let fixture: ComponentFixture<PodcastAppsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PodcastAppsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PodcastAppsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
