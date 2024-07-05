import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { dropdown } from 'src/app/core/models/dropdown.models';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent implements OnInit {
  @Input() control = new FormControl();
  @Input() controlName: string;
  @Input() label: string;
  @Input() showDefaultOption: boolean = true;
  @Input() placeholder?: string = null;
  @Input() data?: dropdown[];
  @Input() selectedOption?: any = null;
  @Input() isSubmitted: boolean;
  @Input() isReadonly?: boolean = false;
  @Input() endPoint?: string = '';
  @Input() icon?: string = '';
  @Input() tooltipData?: any;
  @Output() onChangeEmit? = new EventEmitter<any>();
  @Output() onClickEmit? = new EventEmitter<any>();

  temData?: dropdown[];
  isLoading: boolean= false;

  constructor(private apiService: ApiService)
  {}

  ngOnInit() {
    this.getDropDowns();
  }

  getDropDowns()
  {
    if(this.endPoint === '')
    {
      this.temData = this.data;
    }
    else
    {
      this.isLoading = true;
      this.apiService.GetRequest(this.endPoint!, true).subscribe((res) => {
          this.data = res.data;
          this.temData = this.data
      }).add(() => {
        this.isLoading = false;
      });
    }
  }

  isRequired()
  {
    return this.control?.hasValidator(Validators.required);
  }

  onChange(val:any)
  {
    this.onChangeEmit.emit(val.target.value);
  }

  onClick()
  {
    this.onClickEmit.emit(this.control.value);
  }
}
