import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent {
  @Input() label: string;
  @Input() btnType?: string = 'submit';
  @Input() btnClass?: string = 'btn btn-primary';
  @Input() isSubmitted?: boolean = false;
  @Input() backgroundColor?: string;
  @Input() textColor?: string;
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Output() EmitOnClick? = new EventEmitter<any>();

  onClick()
  {
    this.EmitOnClick.emit();
  }
}
