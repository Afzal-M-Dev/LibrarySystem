import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SystemRoleEnum } from 'src/app/core/models/enum';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isSubmitted:boolean = false;
  isLoading:boolean = false;
  pwType: string = 'password';

  inputForm = this.formBuilder.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });


  constructor(private formBuilder: FormBuilder, private toastr:ToastrService,
  private apiService: ApiService, private store: StorageService,)
  { }

  onSubmit() {
    this.isSubmitted = true;
    if (this.inputForm.valid)
    {
      this.isLoading = true;
      this.apiService.PostRequest(this.inputForm.value, '/api/Auth/login', false).subscribe(res=>{
        this.store.setUserClaims(res.data);
        if(res.data.Role === SystemRoleEnum.Librarian)
          window.location.href = '/admin/home';
        else
          window.location.href = '/user/home';
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
