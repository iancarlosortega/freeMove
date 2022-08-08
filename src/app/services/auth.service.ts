import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from '@firebase/app-compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserService } from './user.service';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}

  register(user: User) {
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password!)
      .then((userCredential: any) => {
        user.idUser = userCredential.user.uid;
        delete user.password;

        this.userService
          .addUser(user)
          .then(() => {
            //TODO: Redireccionar a la pagina de newUser
            this.router.navigateByUrl('/');
          })
          .catch((error) => {
            console.log('Error al agregar el usuario:', error);
          });
      })
      .catch((error) => {
        console.log('Error al registrar el usuario:', error);
      });
  }

  loginEmailPassword(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
        //TODO: redireccionar a la pagina de dashboard
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loginGoogle() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.loginProvider(googleAuthProvider);
  }

  loginFacebook() {
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.loginProvider(facebookAuthProvider);
  }

  async loginProvider(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((response) => {
        if (response.additionalUserInfo?.isNewUser === true) {
          console.log(response);
          const user: User = {
            idUser: response.user?.uid!,
            firstName: response.user?.displayName!,
            lastName: response.user?.displayName!,
            email: response.user?.email!,
            photoUrl: response.user?.photoURL!,
            role: 'CLIENT-ROLE',
          };

          this.userService
            .addUser(user)
            .then((res) => {
              this.router.navigate(['auth/register/', user.idUser]);
            })
            .catch((err) => {
              console.log('Error agregar usuario', err);
            });
        } else {
          const { redirect } = window.history.state;
          this.router.navigateByUrl(redirect || '/play');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async logout() {
    await this.afAuth.signOut();
  }
}
