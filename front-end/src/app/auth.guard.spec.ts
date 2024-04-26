import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard; // Declare a variable to hold the guard instance

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard] // Include AuthGuard in the testing module
    });

    authGuard = TestBed.inject(AuthGuard); // Inject the created instance
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy(); // Now check the injected instance
  });
});
