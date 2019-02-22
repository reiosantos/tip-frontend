import { TestBed, inject } from '@angular/core/testing';

import { RegisteredUsersService } from './registered-users.service';

describe('RegisteredUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisteredUsersService]
    });
  });

  it('should be created', inject([RegisteredUsersService], (service: RegisteredUsersService) => {
    expect(service).toBeTruthy();
  }));
});
