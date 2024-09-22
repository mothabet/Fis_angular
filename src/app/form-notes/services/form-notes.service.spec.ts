import { TestBed } from '@angular/core/testing';

import { FormNotesService } from './form-notes.service';

describe('FormNotesService', () => {
  let service: FormNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
