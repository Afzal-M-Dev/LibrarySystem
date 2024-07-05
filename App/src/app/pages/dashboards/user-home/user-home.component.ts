import { Component } from '@angular/core';
import { ClaimsDto } from 'src/app/core/models/auth.models';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {

  loggedinUser: ClaimsDto;
  availableBooks = 0;
  checkedBooksByMe = 0;

  constructor(private apiService:ApiService, private storageService: StorageService)
  {}

  ngOnInit()
  {
    this.loggedinUser = this.storageService.getUserClaims();
    this.fetchBookCount();
  }

  fetchBookCount()
  {
    this.apiService.GetRequest('/api/Book/DashboardBookCountsForCustomer?customerId='+this.loggedinUser.id, true, true).subscribe((res)=>{
      this.availableBooks = res.data?.availableBooks;
      this.checkedBooksByMe = res.data?.checkedBooksByMe;
    });
  }
}
