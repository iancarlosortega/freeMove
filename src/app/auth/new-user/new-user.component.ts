import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CountryService, UserService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  user!: User;
  countries: string[] = [];
  cities: string[] = [];
  isLoading: boolean = true;
  userObs!: Subscription;

  newUserForm = this.fb.group({
    age: [''],
    phone: [''],
    gender: [''],
    country: [''],
    city: [{ value: '', disabled: this.cities.length === 0 }],
    weight: ['', [Validators.required, Validators.min(0)]],
    height: ['', [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private countryService: CountryService,
    private userService: UserService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    // Get information about user logged in

    this.userObs = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.newUserForm.reset({
        ...(this.user as any),
      });
      this.isLoading = false;
    });

    // Get countries

    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    // Get cities by country selected

    this.newUserForm
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.newUserForm.get('city')?.reset({ value: '', disabled: true });
          this.newUserForm.get('city')?.enable();
        }),
        switchMap((country) => this.countryService.getCitiesByCountry(country!))
      )
      .subscribe((cities: string[]) => {
        this.cities = cities.sort();
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  campoNoValido(campo: string) {
    return (
      this.newUserForm.get(campo)?.invalid &&
      this.newUserForm.get(campo)?.touched
    );
  }

  saveUserInfo() {
    if (this.newUserForm.invalid) {
      this.newUserForm.markAllAsTouched();
      return;
    }

    const { age, phone, gender, country, city, height, weight } =
      this.newUserForm.value;

    this.user = {
      ...this.user,
      age: Number(age)!,
      phone: phone!,
      gender: gender!,
      country: country!,
      city: city?.toString() || '',
      height: Number(height)!,
      weight: Number(weight)!,
    };

    this.userService
      .updateUser(this.user)
      .then(() => {
        this.userService.setUser(this.user);
        this.router.navigateByUrl('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        this.toastService.error('Error al guardar los datos');
      });
  }
}
