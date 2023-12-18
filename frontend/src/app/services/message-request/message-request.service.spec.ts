import { TestBed } from '@angular/core/testing';

import { MessageRequestService } from './message-request.service';

describe('MessageRequestService', () => {
  let service: MessageRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
