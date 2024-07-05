import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { systemRolesConst } from 'src/app/core/constants/app-constants';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isSubmitted:boolean = false;
  isLoading:boolean = false;
  pwType: string = 'password';
  roles = systemRolesConst;

  inputForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.email]],
    contact: ['', [Validators.required]],
    address: ['', [Validators.required]],
    role: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private toastr:ToastrService,
  private apiService: ApiService, private utilityService: UtilityService, private router: Router)
  { }

  onSubmit() {
    this.isSubmitted = true;
    if (this.inputForm.valid)
    {
      if(this.inputForm.get('password')?.value != this.inputForm.get('confirmPassword')?.value)
      {
        this.toastr.warning("Password and Confirm password not matched.");
        return;
      }

      this.isLoading = true;
      this.apiService.PostRequest(this.utilityService.prepareFormData(this.inputForm), '/api/Auth/SignUp', false).subscribe(res=>{
        this.toastr.success(res.message);
        this.router.navigate(['/login']);
      }).add(()=>{
        this.isSubmitted = false;
        this.isLoading = false;
      });
    }
    else
    {
      this.toastr.warning('Please validate form!');
    }
  }
}
