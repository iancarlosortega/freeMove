import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map, Subscription, switchMap, take, tap } from 'rxjs';
import {
  AuthService,
  CountryService,
  StorageService,
  UserService,
  ValidatorService,
} from 'src/app/services';
import { City, User } from 'src/app/interfaces';
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
  @ViewChild('modalEmail') modalEmail!: TemplateRef<any>;

  user!: User;
  userAux!: User;
  providerObs!: Subscription;
  userObs!: Subscription;
  countries: string[] = [];
  cities: string[] = [];
  email: string = '';
  newEmail: string = '';
  fileName: string = '';
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  percentage: number = 0;
  visible: boolean = true;
  isLoading: boolean = true;
  disabled: boolean = false;
  isError: boolean = false;
  isErrorEmail: boolean = false;
  modalRef?: BsModalRef;

  profileForm: FormGroup = this.fb.group({
    name: [
      { value: '', disabled: false },
      [Validators.required, , Validators.minLength(6)],
    ],
    email: [
      { value: '', disabled: false },
      [Validators.required, , Validators.email],
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

  emailForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [this.validator.camposIguales('password', 'password2')],
    }
  );

  invalidInput(campo: string) {
    return (
      this.profileForm.get(campo)?.invalid &&
      this.profileForm.get(campo)?.touched
    );
  }

  invalidInputEmail(campo: string) {
    return (
      this.emailForm.get(campo)?.invalid && this.emailForm.get(campo)?.touched
    );
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private storageService: StorageService,
    private userService: UserService,
    private countryService: CountryService,
    private authService: AuthService,
    private validator: ValidatorService
  ) {}

  ngOnInit(): void {
    // Get information about user logged in

    this.providerObs = this.authService
      .getClaims()
      .pipe(take(1))
      .subscribe((res: any) => {
        const uid = res?.claims['user_id'];
        const provider = res?.claims['firebase'].sign_in_provider;
        if (provider !== 'password') {
          this.profileForm.get('email')?.reset({ value: '', disabled: true });
        }

        this.userObs = this.userService
          .getUserById(uid)
          .subscribe((user: User) => {
            this.user = user;
            this.email = user.email;
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

    this.countryService
      .getCountries()
      .pipe(
        map((country) => country.data),
        map((countries) => countries.map((country) => country.name))
      )
      .subscribe((countries) => {
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
      .subscribe((cities: City) => {
        this.cities = cities['data'];
      });

    // When modal closes
    this.modalService.onHidden.subscribe((_) => {
      this.emailForm.reset();
      this.disabled = false;
    });
  }

  ngOnDestroy(): void {
    this.providerObs.unsubscribe();
    this.userObs.unsubscribe();
  }

  openModal() {
    this.modalRef = this.modalService.show(this.modalEmail);
  }

  closeModal() {
    this.modalRef?.hide();
    this.emailForm.reset();
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
    this.userAux = {
      ...this.user,
      ...this.profileForm.value,
    };

    // Check if user has changed email
    this.newEmail = this.profileForm.get('email')?.value;
    if (this.email !== this.newEmail) {
      this.openModal();
      return;
    }
    this.updateUser();
  }

  updateEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    // Update email in authFirebase
    this.authService
      .loginEmailPassword(this.email, this.emailForm.controls['password'].value)
      .then((userCredential) => {
        userCredential.user
          ?.updateEmail(this.newEmail)
          .then(() => {
            this.updateUser(); //Update user in database
            this.closeModal();
          })
          .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
              this.closeModal();
              this.toastr.error('Error', 'El correo ya está en uso');
            }
          });
      })
      .catch((error) => {
        this.emailForm.reset();
        if (error.code === 'auth/wrong-password') {
          this.isError = true;
        }
        setTimeout(() => {
          this.isError = false;
        }, 3500);
      });
  }

  updateUser() {
    // Update user in database
    if (this.selectedFiles) {
      this.fileName = this.selectedFiles?.[0].name;
      console.log(this.fileName);
      if (this.userAux.photoFilename) {
        this.storageService.deleteImage(
          '/userPhotos',
          this.userAux.photoFilename!
        );
      }
      const id = new Date().getTime();
      console.log(id);
      const fileName = `${id}-${this.fileName.split('\\').slice(-1)[0]}`;
      console.log(fileName);
      this.userAux.photoFilename = fileName;
      delete this.userAux.file;

      let file: File | null = this.selectedFiles.item(0);

      this.selectedFiles = undefined;
      console.log(file);
      if (file) {
        console.log('file');
        this.currentFileUpload = new FileUpload(file);
        this.visible = true;
        this.userService
          .updateProfile(this.currentFileUpload, fileName, this.userAux)
          .subscribe((percentage) => {
            console.log('updated');
            this.userService.setUser(this.userAux);
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
      delete this.userAux.file;
      this.userService
        .updateUser(this.userAux)
        .then((res) => {
          this.userService.setUser(this.userAux);
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
