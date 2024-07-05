import { Component, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BookStatus, UserRole } from 'src/app/core/constants/app-constants';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { tableHeaderDto } from 'src/app/core/models/tableHeaderDto.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checked-book',
  templateUrl: './checked-book.component.html',
  styleUrls: ['./checked-book.component.scss']
})
export class CheckedBookComponent {
  loggedinUser:ClaimsDto;

  @ViewChild('bookTable') bookTable: DataTableComponent;
  endpoint = "/api/Book/CheckOutBookDataTable";
  queryParam = '';
  tableHeader: tableHeaderDto[] = [];

  modalRef: BsModalRef;
  inputForm: FormGroup;
  attachmentFile:any;
  clrAttachEvent = new EventEmitter<any>();
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  bookStatusEnum = BookStatus;
  userRoleEnum = UserRole;
  updBook:any;

  constructor(private toastr: ToastrService, private apiService: ApiService,
  private storageService: StorageService)
  {}

  ngOnInit()
  {
    this.loggedinUser = this.storageService.getUserClaims();
    this.prepareTableHeader();
  }

  returnBook(book:any)
  {
    if(this.loggedinUser.id != book.userId)
    {
      this.toastr.error('Not allowed!');
      return;
    }

    Swal.fire({
      title: 'Confirm Return?',
      html: `Are you sure to return <b>${book.title || 'this book'}</b>.`,
      showCancelButton: true,
      confirmButtonColor: '#34C38F',
      cancelButtonColor: '#F46C6A',
      confirmButtonText: 'Confirm'
    }).then(result =>
    {
      if (result.value)
      {
        this.apiService.PostRequest(null, `/api/Book/BookReturned?bookId=${book.id}&userId=${this.loggedinUser.id}`, true, true)
        .subscribe((res)=>{
          this.toastr.success(res.message);
          this.bookTable.resetTable();
        });
      }
    });
  }

  prepareTableHeader()
  {
    this.tableHeader =
    [
      {
        columnIndex: 0,
        title: 'Cover Image',
        value: 'CoverImage',
        sortable: false,
        visible: true
      }
    ];

    if(this.loggedinUser.role === this.userRoleEnum.Customer)
    {
      this.queryParam = 'customerId='+this.loggedinUser.id;
      this.tableHeader.push(
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
          title: 'Check-out Date',
          value: 'CheckOutDate',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 4,
          title: 'Due Date',
          value: 'DueDate',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 5,
          title: 'Action',
          value: '',
          sortable: false,
          visible: true
        }
      );
    }
    else
    {
      this.tableHeader.push(
        {
          columnIndex: 1,
          title: 'Customer Name',
          value: 'UserName',
          sortable: false,
          visible: true
        },
        {
          columnIndex: 2,
          title: 'Book Title',
          value: 'Title',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 3,
          title: 'Author',
          value: 'Author',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 4,
          title: 'Check-out Date',
          value: 'CheckOutDate',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 5,
          title: 'Due Date',
          value: 'DueDate',
          sortable: true,
          visible: true
        },
        {
          columnIndex: 6,
          title: 'Action',
          value: '',
          sortable: false,
          visible: true
        }
      );
    }
  }
}
