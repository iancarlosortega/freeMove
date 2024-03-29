import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import firebase from '@firebase/app-compat';
import { AuthService, UserService, ValidatorService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'],
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
export class RegisterComponent implements OnInit {
  isError: boolean = false;
  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [this.validator.sameFields('password', 'password2')],
    }
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validator: ValidatorService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  invalidInput(field: string) {
    return (
      this.registerForm.get(field)?.invalid &&
      this.registerForm.get(field)?.touched
    );
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;

    this.authService
      .register(email!, password!)
      .then((userCredential: any) => {
        //TODO: Update profile in auth firebase
        const user: User = {
          idUser: userCredential.user.uid,
          email: this.registerForm.value.email!,
          name: this.registerForm.value.name!,
          role: 'CLIENT-ROLE',
          provider: 'email-password',
          followers: [],
          following: [],
          createdAt: firebase.firestore.Timestamp.now(),
          photoUrl: null!,
          bannerUrl: null!,
        };

        this.userService
          .createUser(user)
          .then(() => {
            this.router.navigateByUrl('/auth/new-user');
          })
          .catch((error) => {
            console.log('Error al agregar el usuario:', error);
          });
      })
      .catch((error) => {
        console.log('Error al registrar el usuario:', error);
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 3500);
      });
  }
}
