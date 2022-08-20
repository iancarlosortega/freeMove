import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  isError: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.loginForm.patchValue({
        email: localStorage.getItem('email'),
        remember: true,
      });
    }
  }

  invalidInput(campo: string) {
    return (
      this.loginForm.get(campo)?.invalid && this.loginForm.get(campo)?.touched
    );
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.loginForm.value;

    this.authService
      .loginEmailPassword(email!, password!)
      .then((res) => {
        if (remember) {
          localStorage.setItem('email', email!);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 3500);
      });
  }

  loginGoogle() {
    this.authService.loginGoogle();
  }

  loginFacebook() {
    this.authService.loginFacebook();
  }
}
