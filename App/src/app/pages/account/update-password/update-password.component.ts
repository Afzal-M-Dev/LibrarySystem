import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {

  loggedinUser: ClaimsDto;
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  inputForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
  private toastr: ToastrService, private store: StorageService)
  {}

  ngOnInit(): void
  {
    this.loggedinUser = this.store.getUserClaims();
    this.initializeForm();
  }

  onSubmit()
  {
    this.isSubmitted = true;

    if(this.inputForm.valid)
    {
      if(this.inputForm.get('newPassword')?.value != this.inputForm.get('confirmPassword')?.value)
      {
        this.toastr.warning("New password and Confirm password not matched.");
        return;
      }

      this.isLoading = true;

      this.apiService.PutRequest(this.inputForm.value, '/api/Auth/UpdatePassword', true).subscribe((res) => {
        this.toastr.success(res.message);
        this.initializeForm();
      }).add(() => {
        this.isSubmitted = false;
        this.isLoading = false;
      });
    }
    else
    {
      this.toastr.warning('Please validate form!');
    }
  }

  initializeForm(){
    this.inputForm = this.formBuilder.group({
      id: [this.loggedinUser?.id, Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]],
      confirmPassword: ['', Validators.required],
    });
  }
}
