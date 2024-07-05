import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent {
  @ViewChild('fileInput') fileInput: ElementRef;

  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() isSubmitted?: boolean = false;
  @Input() showFiles?: boolean = false;
  @Input() tooltipData?: any;
  @Input() allowedFormats?: string[] = [];
  @Input() maxSize?: number = 2;
  @Input() multiple?: boolean = false;
  @Input() parentTrigger: EventEmitter<any>;
  @Output() outputFiles? = new EventEmitter<any>();

  private actionSub: Subscription;
  files?: any[] = [];
  public fileError: string = "";
  allowedSize: number = 1000000;

  ngOnInit(){
    this.allowedSize = this.maxSize * this.allowedSize;
    if (this.parentTrigger) {
      this.actionSub = this.parentTrigger.subscribe((data) => {
        if(data==='clear')
          this.clearInput();
      });
    }
  }

  onFileChange(event: any)
  {
    this.files = [];
    const files = event.target?.files;
    if (files)
      this.handleFiles(files);
  }

  handleFiles(f: FileList): void
  {
    let size:number = 0;
    for(var i =0; i< f.length; i++)
    {
      if(this.allowedFormats.length > 0 && !this.allowedFormats.includes(f[i].type))
      {
        this.fileInput.nativeElement.value = '';
        this.files = [];
        this.fileError = `Only ${this.allowedFormats.join(', ')} allowed`;
        return;
      }
      else
      {
        this.fileError = '';
        this.files?.push(f[i]);
        size += f[i].size;
      }
    }

    if(size > this.allowedSize)
    {
      this.fileInput.nativeElement.value = '';
      this.files = [];
      this.fileError = `Max allowed size is ${this.maxSize} MBs`;
    }

    this.outputFiles.emit(this.files);
  }

  clearInput()
  {
    this.fileInput.nativeElement.value = '';
    this.files = [];
    this.fileError = '';
    this.outputFiles.emit(this.files);
  }

  removeFile(f:any)
  {
    this.files = this.files?.filter((x:any)=> x!= f);
    if(this.files?.length === 0)
    {
      this.clearInput();
    }
  }

  ngOnDestroy() {
    if (this.actionSub) {
      this.actionSub.unsubscribe();
    }
  }
}


