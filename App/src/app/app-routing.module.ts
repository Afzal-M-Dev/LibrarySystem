import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { authDeactiveGuard, authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { UpdateProfileComponent } from './pages/account/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './pages/account/update-password/update-password.component';
import { SystemRoleEnum } from './core/models/enum';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminHomeComponent } from './pages/dashboards/admin-home/admin-home.component';
import { UserHomeComponent } from './pages/dashboards/user-home/user-home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AddBookComponent } from './pages/menu/add-book/add-book.component';
import { ViewBookComponent } from './pages/menu/view-book/view-book.component';
import { CheckedBookComponent } from './pages/menu/checked-book/checked-book.component';
import { BookDetailComponent } from './pages/menu/book-detail/book-detail.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '',
    canActivate:[authDeactiveGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' }
    ]
  },
  {
    path: 'account',
    component: LayoutComponent,
    canActivate:[authGuard], data:  { roles: ['all'] },
    children: [
      { path: 'profile', component: UpdateProfileComponent },
      { path: 'password', component: UpdatePasswordComponent},
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate:[authGuard], data:  { roles: [SystemRoleEnum.Librarian] },
    children: [
      { path: 'home', component: AdminHomeComponent, title: 'Librarian Dashboard' },
      { path: 'add-book', component: AddBookComponent, title: 'Add New Book' },
      { path: 'view-book', component: ViewBookComponent, title: 'View Books' },
    ]
  },
  {
    path: 'user',
    component: LayoutComponent,
    canActivate:[authGuard], data:  { roles: [SystemRoleEnum.Customer] },
    children: [
      { path: 'home', component: UserHomeComponent, title: 'Customer Dashboard' },
      { path: 'view-book', component: ViewBookComponent, title: 'View Books' },
    ]
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate:[authGuard], data:  { roles: ['all'] },
    children: [
      { path: 'checked-book', component: CheckedBookComponent, title: 'Checked-out Books' },
      { path: 'book-detail/:id', component: BookDetailComponent, title: 'Book Details' },
    ]
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
