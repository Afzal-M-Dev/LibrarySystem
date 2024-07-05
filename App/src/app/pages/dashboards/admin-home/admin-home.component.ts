import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {

  totalBooks = 0;
  checkedOutBooks = 0;

  constructor(private apiService:ApiService)
  {}

  ngOnInit()
  {
    this.fetchBookCount();
  }

  fetchBookCount()
  {
    this.apiService.GetRequest('/api/Book/DashboardBookCountsForLibrarian', true, true).subscribe((res)=>{
      this.totalBooks = res.data?.totalBooks;
      this.checkedOutBooks = res.data?.checkedOutBooks;
    });
  }
}
