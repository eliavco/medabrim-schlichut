import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineNoticeComponent } from './offline-notice.component';

describe('OfflineNoticeComponent', () => {
	let component: OfflineNoticeComponent;
	let fixture: ComponentFixture<OfflineNoticeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OfflineNoticeComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OfflineNoticeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
