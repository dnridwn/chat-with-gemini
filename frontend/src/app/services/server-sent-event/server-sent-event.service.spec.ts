import { TestBed } from '@angular/core/testing';

import { ServerSentEventService } from './server-sent-event.service';

describe('ServerSentEventService', () => {
  let service: ServerSentEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSentEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
