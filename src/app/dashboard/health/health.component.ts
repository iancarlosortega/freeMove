import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { UserService } from 'src/app/services';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css'],
})
export class HealthComponent implements OnInit {
  user: User = {
    idUser: '',
    name: '',
    email: '',
    role: 'ADMIN-ROLE',
    provider: 'email-password',
    createdAt: undefined,
    weight: 0,
  };
  isLoading: boolean = true;
  userObs!: Subscription;
  idealWeight: number = 0;
  firstRange: number = 0;
  secondRange: number = 0;
  thirdRange: number = 0;
  fourthRange: number = 0;
  healthForm: FormGroup = this.fb.group({
    gender: ['', [Validators.required]],
    isMan: [false, [Validators.required]],
    isWoman: [false, [Validators.required]],
    height: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.healthForm.patchValue({
        ...(this.user as any),
      });
      if (this.user.gender === 'Masculino') {
        this.healthForm.get('isMan')?.setValue(true);
      } else if (this.user.gender === 'Femenino') {
        this.healthForm.get('isWoman')?.setValue(true);
      }
      if (this.user.gender !== 'Otro' && this.user.gender) {
        this.getIdealWeight(this.user.gender, this.user.height!);
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  invalidInput(campo: string) {
    return (
      this.healthForm.get(campo)?.invalid && this.healthForm.get(campo)?.touched
    );
  }

  setManGender() {
    this.healthForm.get('isMan')?.setValue(true);
    this.healthForm.get('isWoman')?.setValue(false);
    this.healthForm.get('gender')?.setValue('Masculino');
  }

  setWomanGender() {
    this.healthForm.get('isWoman')?.setValue(true);
    this.healthForm.get('isMan')?.setValue(false);
    this.healthForm.get('gender')?.setValue('Femenino');
  }

  calculateWeight(): void {
    if (
      this.healthForm.invalid ||
      this.healthForm.get('gender')?.value === 'Otro'
    ) {
      console.log('Formulario no válido');
      this.toastrService.error('Rellene todos los campos', 'Error');
      return;
    }

    const { gender, height } = this.healthForm.value;
    this.user = {
      ...this.user,
      gender,
      height,
    };
    this.userService.updateUser(this.user);
    this.userService.setUser(this.user);
    this.getIdealWeight(gender, height);
  }

  getIdealWeight(gender: string, height: number) {
    if (gender === 'Masculino') {
      this.idealWeight = height - 100 - (height - 150) / 4;
    } else {
      this.idealWeight = height - 100 - (height - 150) / 2.5;
    }

    this.firstRange = this.idealWeight - 6.2;
    this.secondRange = this.idealWeight + 7.3;
    this.thirdRange = this.idealWeight + 20.2;
    this.fourthRange = this.idealWeight + 40.4;
  }
}
