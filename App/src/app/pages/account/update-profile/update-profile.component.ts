import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  loggedinUser: ClaimsDto;
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  inputForm: FormGroup;

  constructor(private store: StorageService, private formBuilder: FormBuilder,
  private toastr:ToastrService, private apiService: ApiService)
  { }

  ngOnInit(): void {
    this.loggedinUser = this.store.getUserClaims();
    this.initializeForm();
  }

  onSubmit()
  {
    this.isSubmitted = true;
    if (this.inputForm.valid)
    {
      this.isLoading = true;

      this.apiService.PutRequest(this.inputForm.value, '/api/Auth/updateprofile', true).subscribe((res) => {
        if(res.data)
        {
          this.toastr.success(res.message);

          setTimeout(() => {
            this.store.setUserClaims(res.data);
            window.location.reload();
          }, 1000);
        }
        else{
          this.toastr.warning(res.message);
        }
      }).add(() => {
        this.isSubmitted = false;
        this.isLoading = false;
      });
    }
    else
    {
      this.toastr.warning('Validate form!');
    }
  }

  initializeForm() {
    this.inputForm = this.formBuilder.group({
      id: [this.loggedinUser?.id, Validators.required],
      firstName: [this.loggedinUser?.firstName, Validators.required],
      lastName: [this.loggedinUser?.lastName, Validators.required],
      email: [this.loggedinUser?.email, Validators.email],
      contact: [this.loggedinUser?.contact, Validators.required],
      address: [this.loggedinUser?.address, Validators.required],
    });
  }
}
