import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormGroupDirective,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService, UserService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css'],
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
export class ChangeEmailComponent implements OnInit {
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  user!: User;
  isLoading: boolean = true;
  isErrorPassword: boolean = false;
  isErrorEmail: boolean = false;
  isDisabled: boolean = false;
  userObs!: Subscription;

  newEmailForm: FormGroup = this.fb.group({
    oldEmail: ['', [Validators.required, Validators.email]],
    newEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get information about user logged in

    this.userObs = this.userService.user$.subscribe((user) => {
      this.newEmailForm.patchValue({
        oldEmail: user.email,
      });
      this.user = user;
      if (user.provider !== 'email-password') {
        this.newEmailForm.disable();
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
      this.newEmailForm.get(campo)?.invalid &&
      this.newEmailForm.get(campo)?.touched
    );
  }

  updateEmail() {
    if (this.newEmailForm.invalid) {
      this.newEmailForm.markAllAsTouched();
      return;
    }

    const { oldEmail, newEmail, password } = this.newEmailForm.value;

    this.authService
      .loginEmailPassword(oldEmail, password)
      .then((userCredential) => {
        userCredential.user
          ?.updateEmail(newEmail)
          .then(() => {
            this.user.email = newEmail;
            this.userService.updateUser(this.user);
            this.userService.setUser(this.user);
            this.toastr.success('Correo actualizado correctamente');
            this.newEmailForm.reset();
            this.form.resetForm();
          })
          .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
              this.isErrorEmail = true;
              setTimeout(() => {
                this.isErrorEmail = false;
              }, 3500);
            }
          });
      })
      .catch((error) => {
        this.newEmailForm.patchValue({
          password: '',
        });
        this.isErrorPassword = true;
        setTimeout(() => {
          this.isErrorPassword = false;
        }, 3500);
      });
  }
}
