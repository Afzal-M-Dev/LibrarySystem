import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent {
  @Input() control = new FormControl();
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() rows?: number  = 5;
  @Input() placeholder?: string = "";
  @Input() isSubmitted: boolean = false;
  @Input() isReadonly?: boolean = false;
  @Input() allowResize?: boolean = true;
  @Input() tooltipData?: any;

  constructor() {
  }

  ngOnInit() {
  }

  isRequired()
  {
    return this.control?.hasValidator(Validators.required);
  }
}
