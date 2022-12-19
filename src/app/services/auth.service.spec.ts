import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

class ToastrServiceStub {
  warning() {}
}

class UserServiceStub {
  getUserById() {}
}

class AngularFireAuthStub {
  authState = {};
  idTokenResult = {};
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: AngularFireAuth, useClass: AngularFireAuthStub },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('creates an account', async () => {
    const { email, password } = generateEmailAndPassword();
    const result = await service.createAccount(email, password);
    expect(result).toEqual(false);
  });

  it('logs users in', async () => {
    const { email, password } = generateEmailAndPassword();
    const result = await service.createAccount(email, password);
    expect(result).toEqual(false);
    const loginResult = await service.login(email, password);
    expect(loginResult).toEqual(false);
  });
});

const generateEmailAndPassword = () => {
  const randomString = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const email = `${randomString()}@${randomString()}.test`;
  const password = randomString();
  return { email, password };
};
