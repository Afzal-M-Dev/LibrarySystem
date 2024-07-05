import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { LoaderInterceptor } from './core/helpers/loader.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { AppComponent } from './app.component';
import { TextInputComponent } from './shared/components/text-input/text-input.component';
import { DataTableComponent } from './shared/components/data-table/data-table.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SelectInputComponent } from './shared/components/select-input/select-input.component';
import { DeleteModalComponent } from './shared/components/delete-modal/delete-modal.component';
import { SubmitButtonComponent } from './shared/components/submit-button/submit-button.component';
import { UpdateProfileComponent } from './pages/account/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './pages/account/update-password/update-password.component';
import { FileInputComponent } from './shared/components/file-input/file-input.component';
import { TextareaInputComponent } from './shared/components/textarea-input/textarea-input.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminHomeComponent } from './pages/dashboards/admin-home/admin-home.component';
import { UserHomeComponent } from './pages/dashboards/user-home/user-home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AddBookComponent } from './pages/menu/add-book/add-book.component';
import { ViewBookComponent } from './pages/menu/view-book/view-book.component';
import { CheckedBookComponent } from './pages/menu/checked-book/checked-book.component';
import { BookDetailComponent } from './pages/menu/book-detail/book-detail.component';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,
    RegisterComponent,
    UpdateProfileComponent,
    UpdatePasswordComponent,
    AdminHomeComponent,
    AddBookComponent,
    ViewBookComponent,
    CheckedBookComponent,
    BookDetailComponent,
    UserHomeComponent,
    NotFoundComponent,

    DataTableComponent,
    TextInputComponent,
    TextareaInputComponent,
    SelectInputComponent,
    FileInputComponent,
    SubmitButtonComponent,
    DeleteModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutsModule,
    AppRoutingModule,
    CarouselModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ScrollToModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    RatingModule.forRoot(),
    NgSelectModule,
    PickerModule,
    CollapseModule.forRoot(),
    TagInputModule,
    CKEditorModule,
  ],
  bootstrap: [AppComponent],
  exports:[],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
})
export class AppModule { }
