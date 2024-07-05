import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { tableHeaderDto } from 'src/app/core/models/tableHeaderDto.models';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit  {
  @Input() temp: TemplateRef<any>;
  @Input() tableHeader: tableHeaderDto[];
  @Input() endpoint: string;
  @Input() paramQuery?: string;
  @Output() chilRefFunc = new EventEmitter<any>();
  @Input() backgroundColor?: string;
  @Input() textColor?: string;
  @Input() viewType?: string = 'list';

  isLoading = false;
  totalRows = 0;
  currentRows = 0;
  currentPage = 0;
  pageSize = 10;
  totalPages = 1;
  sortColumnName = "";
  sortDirection = "asc";
  searchValue = "";
  isAltered = false;

  dataList : Array<any>;

  constructor(private apiService: ApiService) {

  }

  ngOnInit()
  {
    this.tableHeader = this.tableHeader?.filter(x=> x.visible === true);
    this.setTable();
  }

  setTable(): void
  {
    this.isLoading = true;
    this.apiService.PostRequest(null, this.endpoint+`?${this.paramQuery?this.paramQuery+'&':''}start=${this.currentPage}&length=${this.pageSize}&sortColumnName=${this.sortColumnName}&sortDirection=${this.sortDirection}&searchValue=${this.searchValue}`, true, true).subscribe((res) => {
      this.dataList= res.data.list;
      this.currentRows = res.data.recordsFiltered
      this.totalRows=res.data.totalRecords;
      this.totalPages = Math.ceil(this.totalRows/this.pageSize);
    }).add(()=>{
      this.isLoading = false;
    });
  }

  applyFilter(filterValue: string)
  {
    this.searchValue = filterValue;
    this.currentPage = 0;
    this.isAltered = true;

    this.setTable();
  }

  sortTable(colName: string)
  {
    if(colName != "")
    {
      this.sortColumnName = colName;
      if(this.sortDirection === "asc")
      {
        this.sortDirection = "desc";
      }
      else
      {
        this.sortDirection = "asc";
      }
      this.isAltered = true;

      this.setTable();
    }
  }

  goStart()
  {
    if(this.currentPage != 0)
    {
      this.currentPage = 0;
      this.isAltered = true;
      this.setTable();
    }
  }

  goPrev()
  {
    if(this.currentPage>0)
    {
      this.currentPage--;
      this.isAltered = true;
      this.setTable();
    }
  }

  goNext()
  {
    this.totalPages = Math.ceil(this.totalRows/this.pageSize);
    if(this.currentPage+1<this.totalPages)
    {
      this.currentPage++;
      this.isAltered = true;
      this.setTable();
    }
  }

  goLast()
  {
    this.totalPages = Math.ceil(this.totalRows/this.pageSize);
    if(this.currentPage+1 != this.totalPages)
    {
      this.currentPage= this.totalPages-1;
      this.isAltered = true;
      this.setTable();
    }
  }

  changeLength(pgSize:number)
  {
      this.pageSize = +pgSize;
      this.currentPage = 0;
      this.isAltered = true;
      this.setTable();
  }

  public resetTable()
  {
    this.currentPage = 0;
    this.pageSize = 10;
    this.totalPages = 1;
    this.sortColumnName = "";
    this.sortDirection = "asc";
    this.searchValue = "";
    this.isAltered = false;

    this.setTable();
  }

}
