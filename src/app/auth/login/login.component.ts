import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services';
import { trigger, transition, style, animate } from '@angular/animations';

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

  miFormulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  loginUser() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    const { email, password } = this.miFormulario.value;

    this.authService
      .loginEmailPassword(email!, password!)
      .then((res) => {
        console.log(res);
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
