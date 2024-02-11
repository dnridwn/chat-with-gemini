import { TestBed } from '@angular/core/testing';

import { CodeFormatterService } from './code-formatter.service';

describe('CodeFormatterService', () => {
  let service: CodeFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
