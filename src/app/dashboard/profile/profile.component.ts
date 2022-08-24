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
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  percentage: number = 0;
  visible: boolean = true;
  isLoading: boolean = true;
  disabled: boolean = false;

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
    file: [{ value: '', disabled: false }],
  });

  invalidInput(campo: string) {
    return (
      this.profileForm.get(campo)?.invalid &&
      this.profileForm.get(campo)?.touched
    );
  }

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
          this.format = 'image';
          this.url = user.photoUrl;
          //Reset form with user information
          this.profileForm.reset({
            ...this.user,
          });
        });
    });

    // Get countries

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

  selectFile(event: any): void {
    const file = event.target.files && event.target.files[0];

    //Previsualizacion de la imagen
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      if (file.type.indexOf('image') > -1) {
        this.selectedFiles = event.target.files;
        this.format = 'image';
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      } else {
        this.selectedFiles = null;
        this.url = null;
        this.toastr.error(
          'Por favor, solo subir archivos de formato imagen',
          'Error'
        );
      }
    } else {
      this.url = null;
      this.selectedFiles = null;
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    // Disabled submit button
    this.disabled = true;

    // Get form values
    this.user = {
      ...this.user,
      ...this.profileForm.value,
    };

    if (this.selectedFiles) {
      if (this.user.photoFilename) {
        this.storageService.deleteImage(
          '/userPhotos',
          this.user.photoFilename!
        );
      }
      const id = new Date().getTime();
      let fileName: string = this.profileForm.controls['file'].value;
      fileName = `${id}-${fileName.split('\\').slice(-1)[0]}`;
      this.user.photoFilename = fileName;
      delete this.user.file;

      let file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.visible = true;
        this.userService
          .updateProfile(this.currentFileUpload, fileName, this.user)
          .subscribe((percentage) => {
            this.userService.setUser(this.user);
            this.percentage = Math.round(percentage ? percentage : 0);
            if (this.percentage == 100) {
              setTimeout(() => {
                this.toastr.info(
                  'El perfil fue actualizado con éxito!',
                  'Perfil actualizado'
                );
                this.visible = false;
                this.percentage = 0;
                this.disabled = false;
              }, 500);
            }
          });
      } else {
        this.toastr.info('Warning', 'Aviso');
      }
    } else {
      delete this.user.file;
      this.userService
        .updateUser(this.user)
        .then((res) => {
          this.userService.setUser(this.user);
          this.disabled = false;
          this.toastr.info(
            'El perfil fue actualizado con éxito!',
            'Perfil actualizado'
          );
        })
        .catch((err) => {
          this.toastr.error('Error al actualizar el perfil', 'Error');
        });
    }
  }
}
