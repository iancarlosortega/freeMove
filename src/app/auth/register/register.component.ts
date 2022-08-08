import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, UserService, ValidatorService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user!: User;

  miFormulario = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(6)]],
      lastName: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [this.validator.camposIguales('password', 'password2')],
    }
  );

  constructor(
    private fb: FormBuilder,
    private validator: ValidatorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  registerUser() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    const { email, password } = this.miFormulario.value;

    this.user = {
      idUser: '',
      firstName: this.miFormulario.get('firstName')?.value!,
      lastName: this.miFormulario.get('lastName')?.value!,
      email: email!,
      password: password!,
      role: 'CLIENT-ROLE',
    };

    this.authService.register(this.user);
  }
}
