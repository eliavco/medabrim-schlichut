import { TestBed } from '@angular/core/testing';

import { PodcastManagerService } from './podcast-manager.service';

describe('PodcastManagerService', () => {
	let service: PodcastManagerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PodcastManagerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
