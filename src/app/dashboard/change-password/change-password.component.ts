import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService, UserService, ValidatorService } from 'src/app/services';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
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
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  email: string = '';
  isLoading: boolean = true;
  isError: boolean = false;
  isDisabled: boolean = false;
  userObs!: Subscription;

  newPasswordForm: FormGroup = this.fb.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [this.validator.camposIguales('password', 'password2')],
    }
  );

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private validator: ValidatorService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get information about user logged in
    this.userObs = this.userService.user$.subscribe((user) => {
      this.email = user.email;
      if (user.provider !== 'email-password') {
        this.newPasswordForm.disable();
        this.isDisabled = true;
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  invalidInput(campo: string) {
    return (
      this.newPasswordForm.get(campo)?.invalid &&
      this.newPasswordForm.get(campo)?.touched
    );
  }

  updatePassword() {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }
    // Update password in authFirebase
    this.authService
      .loginEmailPassword(
        this.email,
        this.newPasswordForm.controls['oldPassword'].value
      )
      .then((userCredential) => {
        console.log(userCredential);
        userCredential.user
          ?.updatePassword(this.newPasswordForm.controls['password2'].value)
          .then(() => {
            this.toastr.success('Contraseña actualizada correctamente');
            this.newPasswordForm.reset();
            this.form.resetForm();
          })
          .catch((error) => {
            this.toastr.error(error.message);
          });
      })
      .catch((error) => {
        this.newPasswordForm.reset();
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 3500);
      });
  }
}
