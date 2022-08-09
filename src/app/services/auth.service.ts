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

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  loginEmailPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
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
            .createUser(user)
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
