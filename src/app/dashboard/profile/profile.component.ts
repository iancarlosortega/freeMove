import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  CountryService,
  StorageService,
  UserService,
} from 'src/app/services';
import { User } from 'src/app/interfaces';
import { FileUpload } from 'src/app/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  userObs!: Subscription;
  providerObs!: Subscription;
  countries: string[] = [];
  cities: string[] = [];
  selectedImage?: any;
  currentImageToUpload?: FileUpload;
  photoUrl!: string;
  uploadPercentage: number = 0;
  isUploading: boolean = true;
  isLoading: boolean = true;
  isDisabled: boolean = false;

  profileForm: FormGroup = this.fb.group({
    name: [
      { value: '', disabled: false },
      [Validators.required, , Validators.minLength(6)],
    ],
    country: [{ value: '', disabled: false }],
    city: [{ value: '', disabled: false }],
    gender: [{ value: '', disabled: false }],
    phone: [{ value: '', disabled: false }],
    weight: [
      { value: '', disabled: false },
      [Validators.required, Validators.min(0)],
    ],
    height: [
      { value: '', disabled: false },
      [Validators.required, Validators.min(0)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storageService: StorageService,
    private userService: UserService,
    private countryService: CountryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get information about user logged in
    this.providerObs = this.authService.getClaims().subscribe((res: any) => {
      const uid = res?.claims['user_id'];
      this.userObs = this.userService
        .getUserById(uid)
        .subscribe((user: User) => {
          this.user = user;
          this.isLoading = false;
          this.photoUrl = user.photoUrl || 'assets/no-image.png';
          //Reset form with user information
          this.profileForm.reset({
            ...this.user,
          });
        });
    });

    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    // Get cities by country selected
    this.profileForm
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.profileForm.get('city')?.reset({ value: '', disabled: true });
          this.profileForm.get('city')?.enable();
        }),
        switchMap((country) => this.countryService.getCitiesByCountry(country!))
      )
      .subscribe((cities: string[]) => {
        this.cities = cities.sort();
      });
  }

  ngOnDestroy(): void {
    this.providerObs.unsubscribe();
    this.userObs.unsubscribe();
  }

  invalidInput(field: string) {
    return (
      this.profileForm.get(field)?.invalid &&
      this.profileForm.get(field)?.touched
    );
  }

  selectFile(event: any): void {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      this.photoUrl = this.user.photoUrl || 'assets/no-image.png';
      this.selectedImage = undefined;
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    if (file.type.includes('image')) {
      this.selectedImage = file;
      reader.onload = (event) => {
        this.photoUrl = (<FileReader>event.target).result!.toString();
      };
    } else {
      this.selectedImage = undefined;
      this.photoUrl = this.user.photoUrl || 'assets/no-image.png';
      this.toastr.error('Por favor, solo subir imágenes.', 'Error');
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isDisabled = true;
    this.user = {
      ...this.user,
      ...this.profileForm.value,
    };

    // User didn't change the image
    if (!this.selectedImage) {
      this.userService
        .updateUser(this.user)
        .then((res) => {
          this.userService.setUser(this.user);
          this.isDisabled = false;
          this.toastr.info(
            '¡El perfil fue actualizado con éxito!',
            'Perfil actualizado'
          );
        })
        .catch((err) => {
          this.toastr.error('Error al actualizar el perfil', 'Error');
        });
      return;
    }

    if (this.user.photoFilename) {
      this.storageService.deleteImage('/userPhotos', this.user.photoFilename);
    }

    this.user.photoFilename = this.createUniqueFilename(
      this.selectedImage.name
    );

    this.currentImageToUpload = new FileUpload(this.selectedImage);
    this.isUploading = true;
    this.userService
      .updateProfile(this.currentImageToUpload, this.user)
      .subscribe((percentage) => {
        this.userService.setUser(this.user);
        this.uploadPercentage = Math.round(percentage ? percentage : 0);
        if (this.uploadPercentage == 100) {
          setTimeout(() => {
            this.toastr.info(
              'El perfil fue actualizado con éxito!',
              'Perfil actualizado'
            );
            this.isUploading = false;
            this.isDisabled = false;
            this.uploadPercentage = 0;
            this.selectedImage = undefined;
          }, 500);
        }
      });
  }

  createUniqueFilename(filename: string): string {
    const id = new Date().getTime();
    return `${id}-${filename.split('\\').slice(-1)[0]}`;
  }
}
