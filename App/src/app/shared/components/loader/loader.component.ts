import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loaderService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
