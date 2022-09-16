import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import firebase from '@firebase/app-compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserService } from './user.service';
import { User, UserProvider } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  getClaims() {
    return this.afAuth.idTokenResult;
  }

  checkAuthState(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((authState) =>
        this.userService.getUserById(authState?.uid || ' ')
      ),
      tap((user) => this.userService.setUser(user)),
      map((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  checkDashState(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((authState) =>
        this.userService.getUserById(authState?.uid || ' ')
      ),
      tap((user) => this.userService.setUser(user)),
      map((user) => {
        if (user) {
          return false;
        } else {
          return true;
        }
      })
    );
  }

  checkProvider() {
    return this.getClaims().pipe(
      map((res: any) => {
        const provider = res?.claims['firebase'].sign_in_provider;
        if (provider !== 'password') {
          return false;
        } else {
          return true;
        }
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((authState) =>
        this.userService.getUserById(authState?.uid || ' ')
      ),
      tap((user) => this.userService.setUser(user)),
      map((user) => {
        if (user.role === 'CLIENT-ROLE') {
          return false;
        } else {
          return true;
        }
      })
    );
  }

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

  loginProvider(provider: any) {
    this.afAuth
      .signInWithPopup(provider)
      .then((response) => {
        if (response.additionalUserInfo?.isNewUser === true) {
          const user: User = {
            idUser: response.user?.uid!,
            name: response.user?.displayName!,
            email: response.user?.email!,
            photoUrl: response.user?.photoURL!,
            provider: response.additionalUserInfo?.providerId! as UserProvider,
            role: 'CLIENT-ROLE',
            followers: 0,
            following: 0,
          };

          this.userService
            .createUser(user)
            .then((res) => {
              this.router.navigateByUrl('/auth/new-user');
            })
            .catch((err) => {
              console.log('Error agregar usuario', err);
            });
        } else {
          const { redirect } = window.history.state;
          this.router.navigateByUrl(redirect || '/dashboard');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('/');
    });
  }

  forgotPassword(email: string) {
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.router.navigateByUrl('/auth/login');
        this.toastr.success(
          'Por favor revise su bandeja de entrada',
          'Email enviado'
        );
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found') {
          this.toastr.error(
            'Usuario no encontrado, pruebe otro email',
            'Error'
          );
        }
      });
  }
}
