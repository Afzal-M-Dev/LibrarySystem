import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  protected isLoading: boolean = false;

  endPoint: string;
  @Output() onCloseEvent: EventEmitter<any> = new EventEmitter();
  constructor(private bsModalRef: BsModalRef, private apiService: ApiService) { }

  ngOnInit() {
  }

  onDelete(){
    this.isLoading = true;
    this.apiService.DeleteRequest(this.endPoint, true).subscribe((res)=>{
      this.bsModalRef.hide();
      this.onCloseEvent.emit(res);
    }).add(()=>this.isLoading = false);
  }

  onClose() {
    this.isLoading = false;
    this.bsModalRef.hide();
  }
}
