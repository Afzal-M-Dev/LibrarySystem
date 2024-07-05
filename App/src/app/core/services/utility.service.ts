import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor() { }

  prepareFormData(input: FormGroup, attachmentFile?:any): FormData {
    const formData = new FormData();

    const safelyAppend = (key: string, value: any) => {
      if (value != null && value !== '') {
        formData.append(key, value);
      }
    };

    Object.keys(input.controls).forEach(controlName => {
      const control = input.get(controlName);
      if (Array.isArray(control.value)) {
        control.value.forEach((val, index) => {
          safelyAppend(`${controlName}[${index}]`, val);
        });
      } else {
        safelyAppend(controlName, control.value);
      }
    });

    if(attachmentFile)
    {
      formData.append('coverImage', attachmentFile);
    }

    return formData;
  }
}
