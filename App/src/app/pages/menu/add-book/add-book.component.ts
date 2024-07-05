import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent {
  inputForm: FormGroup;
  AttachmentFile:any;
  clrAttachEvent = new EventEmitter<any>();
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(private formBuilder: FormBuilder, private toastr:ToastrService,
  private router:Router, private apiService: ApiService, private utilityService: UtilityService)
  { }

  ngOnInit()
  {
    this.initializeForm();
  }

  onSubmit()
  {
    this.isSubmitted = true;
    if(this.AttachmentFile && this.inputForm.valid)
    {
      this.isLoading = true;

      this.apiService.PostRequest(this.utilityService.prepareFormData(this.inputForm, this.AttachmentFile[0]), '/api/Book/AddBook', true).subscribe((res) => {
        this.toastr.success(res.message);
        this.initializeForm();

        if(res.data)
          this.router.navigate(['/home/book-detail/'+res.data]);

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

  initializeForm()
  {
    this.inputForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      publisher: ['', Validators.required],
      publicationDate: ['', Validators.required],
      category: ['', Validators.required],
      iSBN: ['', Validators.required],
      pageCount: ['', [Validators.required, Validators.min(50)]],
    });
  }

  getAttachmentFiles(event?:any)
  {
    this.AttachmentFile = event;
  }
}
