import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  @Input() control = new FormControl();
  @Input() type?: string = "text";
  @Input() min?: number | null;
  @Input() max?: number | null;
  @Input() step?: number | null;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() placeholder?: string = "";
  @Input() isSubmitted: boolean = false;
  @Input() isReadonly?: boolean = false;
  @Input() icon?: string = '';
  @Input() tooltipData?: any;
  @Input() maxCharacters?: number = 255;

  constructor() {
  }

  ngOnInit() {
  }

  isRequired()
  {
    return this.control?.hasValidator(Validators.required);
  }
}
