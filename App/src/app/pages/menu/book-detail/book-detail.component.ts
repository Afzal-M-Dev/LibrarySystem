import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BookStatus, UserRole } from 'src/app/core/constants/app-constants';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent {
  loggedinUser: ClaimsDto;
  bookId: string;
  book:any;
  ratings = [];
  avgRate = 0;

  bookStatusEnum = BookStatus;
  userRoleEnum = UserRole;

  modalRef?: BsModalRef;

  inputForm: FormGroup;
  allowRate = false;
  inputRate = 0;
  isLoading = false;
  isSubmitted = false;

  constructor(private storageService: StorageService, private params: ActivatedRoute,
  private modalService: BsModalService, private toastr: ToastrService, private router: Router,
  private formBuilder: FormBuilder, private apiService: ApiService)
  {}

  ngOnInit()
  {
    this.loggedinUser = this.storageService.getUserClaims();
    this.bookId = this.params.snapshot.params?.['id'];

    if(!this.bookId)
    {
      this.toastr.error('Invalid Url');
      this.router.navigate(['/']);
    }

    this.fetchBook();

    this.initializeForm();
  }

  fetchBook()
  {
    this.apiService.GetRequest(`/api/Book/GetBookById?BookId=${this.bookId}`, true, true)
    .subscribe((res) =>
    {
      this.book = res.data;

      this.fetchBookRatings()
    });
  }

  fetchBookRatings()
  {
    this.allowRate = false;

    this.apiService.GetRequest(`/api/Review/GetReviewsByBookId?bookId=${this.bookId}`, true, true)
    .subscribe((res) =>
    {
      this.ratings = res.data;
      const totalRatings = this.ratings.reduce((sum, review) => sum + review.rating, 0);
      this.avgRate = this.ratings.length ? totalRatings / this.ratings.length : 0;

      this.allowRate = !this.ratings.some(review => review.userId === this.loggedinUser.id);
    });
  }

  checkoutBook()
  {
    if(this.book.status === this.bookStatusEnum.CheckedOut)
    {
      this.toastr.error('Already Checked-out');
      return;
    }

    Swal.fire({
      title: 'Confirm Check-out?',
      html: `Are you sure to check-out <b>${this.book.title || 'this book'}</b>.`,
      showCancelButton: true,
      confirmButtonColor: '#34C38F',
      cancelButtonColor: '#F46C6A',
      confirmButtonText: 'Confirm'
    }).then(result =>
    {
      if (result.value)
      {
        this.apiService.PostRequest(null, `/api/Book/BookCheckOut?bookId=${this.book?.id}&userId=${this.loggedinUser.id}`, true, true)
        .subscribe((res)=>{
          this.toastr.success(res.message);

          this.fetchBook();
        });
      }
    });
  }

  returnBook()
  {
    if(this.loggedinUser.id != this.book.userId)
    {
      this.toastr.error('Not allowed!');
      return;
    }

    Swal.fire({
      title: 'Confirm Return?',
      html: `Are you sure to return <b>${this.book.title || 'this book'}</b>.`,
      showCancelButton: true,
      confirmButtonColor: '#34C38F',
      cancelButtonColor: '#F46C6A',
      confirmButtonText: 'Confirm'
    }).then(result =>
    {
      if (result.value)
      {
        this.apiService.PostRequest(null, `/api/Book/BookReturned?bookId=${this.book.id}&userId=${this.loggedinUser.id}`, true, true)
        .subscribe((res)=>{
          this.toastr.success(res.message);

          this.fetchBook();
        });
      }
    });
  }

  onRateSubmit()
  {
    if(!this.allowRate)
    {
      this.toastr.warning('Not allowed to rate!');
      return;
    }
    if(this.inputRate === 0)
    {
      this.toastr.warning('Please select rating!');
      return;
    }
    this.inputForm.controls.rating.setValue(this.inputRate);

    this.isSubmitted = true;
    if(this.inputForm.valid)
    {
      this.isLoading = true;

      this.apiService.PostRequest(this.inputForm.value, '/api/Review/AddReview', true).subscribe((res) => {
        this.toastr.success(res.message);
        this.fetchBookRatings();
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

  onDelete(id:string)
  {
    this.modalRef = this.modalService.show(DeleteModalComponent,
    {
      initialState: { endPoint: '/api/Review/DeleteReview?reviewId='+id },
      animated: true,
      class: 'modal-dialog-centered '
    });

    this.modalRef.content.onCloseEvent.subscribe((result: any) => {
      if(result.isSuccess)
      {
        this.toastr.success(result.message);
        this.fetchBookRatings();
      }
      else{
        this.toastr.warning(result.message);
      }
    });
  }

  initializeForm(){
    this.inputRate = 0;
    this.inputForm = this.formBuilder.group({
      bookId : [this.bookId, Validators.required],
      userId : [this.loggedinUser.id, Validators.required],
      rating : [null, Validators.required],
      reviewText : [null, Validators.required],
    });
  }
}
