import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, NewUserGuard } from '../guards';

import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './new-user/new-user.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'new-user',
        component: NewUserComponent,
        canActivate: [NewUserGuard],
        canLoad: [NewUserGuard],
      },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
