import { Component, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BookStatus, UserRole } from 'src/app/core/constants/app-constants';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { tableHeaderDto } from 'src/app/core/models/tableHeaderDto.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.scss']
})
export class ViewBookComponent {
  loggedinUser:ClaimsDto;

  @ViewChild('bookTable') bookTable: DataTableComponent;
  endpoint = "/api/Book/BookDatatable";
  tableHeader: tableHeaderDto[] =
  [
    {
      columnIndex: 0,
      title: 'Cover Image',
      value: 'CoverImage',
      sortable: false,
      visible: true
    },
    {
      columnIndex: 1,
      title: 'Book Title',
      value: 'Title',
      sortable: true,
      visible: true
    },
    {
      columnIndex: 2,
      title: 'Author',
      value: 'Author',
      sortable: true,
      visible: true
    },
    {
      columnIndex: 3,
      title: 'Availability',
      value: 'Availability',
      sortable: true,
      visible: true
    },
    {
      columnIndex: 4,
      title: 'Action',
      value: '',
      sortable: false,
      visible: true
    }
  ];

  modalRef: BsModalRef;
  inputForm: FormGroup;
  attachmentFile:any;
  clrAttachEvent = new EventEmitter<any>();
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  bookStatusEnum = BookStatus;
  userRoleEnum = UserRole;
  updBook:any;

  constructor(private modalService: BsModalService, private toastr: ToastrService,
  private formBuilder: FormBuilder, private apiService: ApiService,
  private storageService: StorageService, private utilityService: UtilityService)
  {}

  ngOnInit()
  {
    this.loggedinUser = this.storageService.getUserClaims();
  }

  openUpdateBookModal(updBookModal: any, book:any)
  {
    if(this.loggedinUser.role===this.userRoleEnum.Customer)
    {
      this.toastr.error('Not allowed');
      return;
    }

    this.inputForm = this.formBuilder.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      publisher: ['', Validators.required],
      publicationDate: ['', Validators.required],
      category: ['', Validators.required],
      isbn: ['', Validators.required],
      pageCount: ['', [Validators.required, Validators.min(50)]],
    });

    this.apiService.GetRequest('/api/Book/GetBookById?BookId='+book.id, true, true).subscribe((res)=>{
      this.updBook = res.data;
      this.inputForm.patchValue(res.data);
      this.modalRef = this.modalService.show(updBookModal,
      {
        animated: true,
        class: 'modal-dialog-centered'
      });
    });
  }

  onUpdate()
  {
    if(this.loggedinUser.role===this.userRoleEnum.Customer)
    {
      this.toastr.error('Not allowed');
      return;
    }

    this.isSubmitted = true;

    if (this.inputForm.valid)
    {
      this.isLoading = true;

      this.apiService.PutRequest(this.utilityService.prepareFormData(this.inputForm, this.attachmentFile?.length > 0 ? this.attachmentFile[0]: null),
      '/api/Book/UpdateBook/', true).subscribe((res) => {
        this.toastr.success(res.message);

        // const index = this.bookTable.dataList.findIndex((item) => item.id === res.data.id);
        // if (index >= 0)
        // {
        //   this.bookTable.dataList[index] = res.data;
        //   this.bookTable.dataList = [...this.bookTable.dataList];
        // }
        this.bookTable.resetTable();

        this.modalRef.hide();
      })
      .add(() => {
        this.isSubmitted = false;
        this.isLoading = false;
      });
    }
    else
    {
      this.toastr.warning('Please validate form!');
    }
  }

  checkoutBook(book:any)
  {
    if(book.status === this.bookStatusEnum.CheckedOut)
    {
      this.toastr.error('Already Checked-out');
      return;
    }

    Swal.fire({
      title: 'Confirm Check-out?',
      html: `Are you sure to check-out <b>${book.title || 'this book'}</b>.`,
      showCancelButton: true,
      confirmButtonColor: '#34C38F',
      cancelButtonColor: '#F46C6A',
      confirmButtonText: 'Confirm'
    }).then(result =>
    {
      if (result.value)
      {
        this.apiService.PostRequest(null, `/api/Book/BookCheckOut?bookId=${book.id}&userId=${this.loggedinUser.id}`, true, true)
        .subscribe((res)=>{
          this.toastr.success(res.message);

          this.bookTable.resetTable();
        });
      }
    });
  }

  openDeleteModal(id:string)
  {
    if(this.loggedinUser.role===this.userRoleEnum.Customer)
    {
      this.toastr.error('Not allowed');
      return;
    }
    this.modalRef = this.modalService.show(DeleteModalComponent,
    {
      initialState: { endPoint: '/api/Book/DeleteBook?bookId='+id },
      animated: true,
      class: 'modal-dialog-centered '
    });

    this.modalRef.content.onCloseEvent.subscribe((result: any) => {
      if(result.isSuccess)
      {
        this.toastr.success(result.message);
        this.bookTable.resetTable();
      }
      else{
        this.toastr.warning(result.message);
      }
    });
  }

  getAttachmentFiles(event?:any)
  {
    this.attachmentFile = event;
  }
}
